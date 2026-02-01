import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";
import {
  generateOrderId,
  saveOrder,
  getOrderBySessionId,
  type Order,
  type OrderItem,
} from "@/lib/orders";
import {
  generateSubscriptionId,
  saveSubscription,
  getSubscriptionByStripeId,
  updateSubscription,
  type Subscription,
  type SubscriptionStatus,
} from "@/lib/subscriptions";
import type { BillingInterval } from "@/lib/types/product";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout completed for session:", session.id);

      // Check if order already exists (idempotency)
      const existingOrder = getOrderBySessionId(session.id);
      if (existingOrder) {
        console.log("Order already exists:", existingOrder.id);
        break;
      }

      try {
        // Retrieve line items from the session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ["data.price.product"],
        });

        // Build order items from line items
        const orderItems: OrderItem[] = lineItems.data.map((item) => {
          const product = item.price?.product as Stripe.Product;
          const metadata = product?.metadata || {};

          return {
            productSlug: metadata.productSlug || product?.name || "unknown",
            productName: product?.name || item.description || "Unknown Product",
            productType: (metadata.productType as OrderItem["productType"]) || "physical",
            quantity: item.quantity || 1,
            unitPrice: item.price?.unit_amount || 0,
            totalPrice: item.amount_total || 0,
            sku: metadata.sku || undefined,
          };
        });

        // Extract shipping details (type assertion needed for Stripe API version differences)
        const shippingDetails = (session as unknown as Record<string, unknown>).shipping_details as {
          name?: string;
          address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
          };
        } | undefined;

        // Create the order
        const order: Order = {
          id: generateOrderId(),
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string | undefined,
          status: session.payment_status === "paid" ? "paid" : "pending",
          customer: {
            email: session.customer_details?.email || "",
            name: session.customer_details?.name || undefined,
            phone: session.customer_details?.phone || undefined,
          },
          items: orderItems,
          shipping: shippingDetails
            ? {
                name: shippingDetails.name || undefined,
                address: shippingDetails.address
                  ? {
                      line1: shippingDetails.address.line1 || undefined,
                      line2: shippingDetails.address.line2 || undefined,
                      city: shippingDetails.address.city || undefined,
                      state: shippingDetails.address.state || undefined,
                      postalCode: shippingDetails.address.postal_code || undefined,
                      country: shippingDetails.address.country || undefined,
                    }
                  : undefined,
              }
            : undefined,
          subtotal: session.amount_subtotal || 0,
          total: session.amount_total || 0,
          currency: session.currency?.toUpperCase() || "USD",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: session.metadata || undefined,
        };

        // Save the order
        saveOrder(order);
        console.log("Order created:", order.id, "for", order.customer.email);
      } catch (err) {
        console.error("Failed to create order:", err);
        // Don't fail the webhook - Stripe will retry
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session expired:", session.id);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      console.log("Charge refunded:", charge.id);

      // Find and update the order if it exists
      // Note: This is a simplified approach - in production you might want to
      // look up by payment_intent instead
      break;
    }

    // Subscription events
    case "customer.subscription.created": {
      const stripeSubscription = event.data.object;
      console.log("Subscription created:", stripeSubscription.id);

      // Check if subscription already exists (idempotency)
      const existingSub = getSubscriptionByStripeId(stripeSubscription.id);
      if (existingSub) {
        console.log("Subscription already exists:", existingSub.id);
        break;
      }

      try {
        // Get customer details
        const customerId = typeof stripeSubscription.customer === "string"
          ? stripeSubscription.customer
          : stripeSubscription.customer.id;
        const customer = await stripe.customers.retrieve(customerId);
        const customerData = customer as Stripe.Customer;

        // Get product details from the first subscription item
        const item = stripeSubscription.items.data[0];
        const priceData = item?.price;
        const productId = typeof priceData?.product === "string"
          ? priceData.product
          : priceData?.product?.id;
        const product = productId ? await stripe.products.retrieve(productId) : null;

        // Map Stripe status to our status
        const statusMap: Record<string, SubscriptionStatus> = {
          active: "active",
          past_due: "past_due",
          canceled: "canceled",
          unpaid: "past_due",
          trialing: "trialing",
          incomplete: "past_due",
          incomplete_expired: "canceled",
          paused: "paused",
        };

        // Access the raw subscription data for period timestamps
        const subData = stripeSubscription as unknown as {
          current_period_start: number;
          current_period_end: number;
          trial_end: number | null;
          canceled_at: number | null;
        };

        const subscription: Subscription = {
          id: generateSubscriptionId(),
          stripeSubscriptionId: stripeSubscription.id,
          stripeCustomerId: customerId,
          status: statusMap[stripeSubscription.status] || "active",
          customer: {
            email: customerData.email || "",
            name: customerData.name || undefined,
          },
          productSlug: product?.metadata?.productSlug || product?.name || "unknown",
          productName: product?.name || "Unknown Product",
          amount: priceData?.unit_amount || 0,
          currency: (priceData?.currency || "usd").toUpperCase(),
          interval: (priceData?.recurring?.interval || "month") as BillingInterval,
          intervalCount: priceData?.recurring?.interval_count || 1,
          currentPeriodStart: new Date(subData.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(subData.current_period_end * 1000).toISOString(),
          trialEnd: subData.trial_end
            ? new Date(subData.trial_end * 1000).toISOString()
            : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: stripeSubscription.metadata || undefined,
        };

        saveSubscription(subscription);
        console.log("Subscription saved:", subscription.id, "for", subscription.customer.email);
      } catch (err) {
        console.error("Failed to create subscription record:", err);
      }
      break;
    }

    case "customer.subscription.updated": {
      const stripeSubscription = event.data.object;
      console.log("Subscription updated:", stripeSubscription.id);

      const localSub = getSubscriptionByStripeId(stripeSubscription.id);
      if (localSub) {
        // Map Stripe status to our status
        const statusMap: Record<string, SubscriptionStatus> = {
          active: "active",
          past_due: "past_due",
          canceled: "canceled",
          unpaid: "past_due",
          trialing: "trialing",
          incomplete: "past_due",
          incomplete_expired: "canceled",
          paused: "paused",
        };

        // Access the raw subscription data for period timestamps
        const subData = stripeSubscription as unknown as {
          current_period_start: number;
          current_period_end: number;
          canceled_at: number | null;
        };

        updateSubscription(localSub.id, {
          status: statusMap[stripeSubscription.status] || localSub.status,
          currentPeriodStart: new Date(subData.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(subData.current_period_end * 1000).toISOString(),
          canceledAt: subData.canceled_at
            ? new Date(subData.canceled_at * 1000).toISOString()
            : undefined,
        });
        console.log("Subscription updated:", localSub.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const stripeSubscription = event.data.object;
      console.log("Subscription deleted:", stripeSubscription.id);

      const localSub = getSubscriptionByStripeId(stripeSubscription.id);
      if (localSub) {
        updateSubscription(localSub.id, {
          status: "canceled",
          canceledAt: new Date().toISOString(),
        });
        console.log("Subscription canceled:", localSub.id);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      // Access subscription from raw data
      const invoiceData = invoice as unknown as { subscription?: string };
      console.log("Invoice paid:", invoice.id, "for subscription:", invoiceData.subscription);
      // Could trigger fulfillment for physical subscription products here
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // Access subscription from raw data
      const invoiceData = invoice as unknown as { subscription?: string };
      console.log("Invoice payment failed:", invoice.id, "for subscription:", invoiceData.subscription);

      // Update subscription status if it exists
      if (invoiceData.subscription) {
        const localSub = getSubscriptionByStripeId(invoiceData.subscription);
        if (localSub) {
          updateSubscription(localSub.id, {
            status: "past_due",
          });
          console.log("Subscription marked as past_due:", localSub.id);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
