import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";
import {
  generateOrderId,
  saveOrder,
  getOrderBySessionId,
  updateOrder,
  type Order,
  type OrderItem,
} from "@/lib/orders";

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

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
