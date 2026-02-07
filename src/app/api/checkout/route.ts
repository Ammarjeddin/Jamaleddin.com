import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import type { CartItem, Product } from "@/lib/types/product";
import { isSubscriptionProduct } from "@/lib/types/product";

function getActiveStripeProductId(product: Product): string | undefined {
  const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
  return isTestMode ? (product.stripeTestProductId || product.stripeProductId) : product.stripeProductId;
}

interface CheckoutRequestBody {
  items: CartItem[];
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { items, successUrl, cancelUrl } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Get the origin from the request
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Create line items for Stripe using server-side product data
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const { product: clientProduct, quantity } = item;

        // Look up the product server-side to prevent price manipulation
        const product = await getProduct(clientProduct.slug);
        if (!product) {
          throw new Error(`Product not found: ${clientProduct.slug}`);
        }

        // Use existing Stripe product if stripeProductId is set
        const stripeId = getActiveStripeProductId(product);
        if (stripeId) {
          return {
            price_data: {
              currency: "usd",
              product: stripeId,
              unit_amount: Math.round(product.pricing.price * 100),
            },
            quantity,
          };
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.images?.map((img) => {
                if (img.src.startsWith("http")) {
                  return img.src;
                }
                return `${origin}${img.src}`;
              }),
              metadata: {
                productSlug: product.slug,
                productType: product.productType,
                sku: product.inventory?.sku || "",
              },
            },
            unit_amount: Math.round(product.pricing.price * 100),
          },
          quantity,
        };
      })
    );

    // Determine product types for shipping using server-side data
    const productSlugs = items.map((item) => item.product.slug);
    const serverProducts = await Promise.all(productSlugs.map((slug) => getProduct(slug)));
    const validProducts = serverProducts.filter((p): p is Product => p !== null);
    const hasPhysicalProducts = validProducts.some(
      (p) => p.productType === "physical"
    );

    // Check for subscription products
    const subscriptionProducts = validProducts.filter(isSubscriptionProduct);
    const oneTimeProducts = validProducts.filter((p) => !isSubscriptionProduct(p));

    // Reject mixed carts (subscriptions + one-time products)
    if (subscriptionProducts.length > 0 && oneTimeProducts.length > 0) {
      return NextResponse.json(
        { error: "Please checkout subscriptions separately from one-time purchases" },
        { status: 400 }
      );
    }

    const isSubscriptionCheckout = subscriptionProducts.length > 0;

    // Create Stripe checkout session
    const stripe = getStripe();

    if (isSubscriptionCheckout) {
      // Subscription checkout
      const subscriptionLineItems = await Promise.all(
        items.map(async (item) => {
          const product = await getProduct(item.product.slug);
          if (!product || !product.subscription) {
            throw new Error(`Subscription product not found: ${item.product.slug}`);
          }

          // Use existing Stripe product if stripeProductId is set
          const subStripeId = getActiveStripeProductId(product);
          if (subStripeId) {
            return {
              price_data: {
                currency: "usd",
                product: subStripeId,
                unit_amount: Math.round(product.pricing.price * 100),
                recurring: {
                  interval: product.subscription.interval,
                  interval_count: product.subscription.intervalCount || 1,
                },
              },
              quantity: item.quantity,
            };
          }

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description || undefined,
                images: product.images?.map((img) => {
                  if (img.src.startsWith("http")) {
                    return img.src;
                  }
                  return `${origin}${img.src}`;
                }),
                metadata: {
                  productSlug: product.slug,
                  productType: product.productType,
                  sku: product.inventory?.sku || "",
                },
              },
              unit_amount: Math.round(product.pricing.price * 100),
              recurring: {
                interval: product.subscription.interval,
                interval_count: product.subscription.intervalCount || 1,
              },
            },
            quantity: item.quantity,
          };
        })
      );

      // Get trial days from the first subscription product (if any)
      const firstSubProduct = subscriptionProducts[0];
      const trialDays = firstSubProduct?.subscription?.trialDays;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: subscriptionLineItems,
        mode: "subscription",
        success_url: successUrl || `${origin}/services/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${origin}/services/cart`,
        // Only collect shipping for physical products
        ...(hasPhysicalProducts && {
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "AU"],
          },
        }),
        billing_address_collection: "auto",
        allow_promotion_codes: true,
        // Subscription-specific options
        ...(trialDays && {
          subscription_data: {
            trial_period_days: trialDays,
          },
        }),
        metadata: {
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
          hasPhysicalProducts: hasPhysicalProducts.toString(),
          isSubscription: "true",
        },
      });

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
      });
    }

    // Regular one-time payment checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${origin}/services/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/services/cart`,
      // Only collect shipping for physical products
      ...(hasPhysicalProducts && {
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB", "AU"],
        },
      }),
      // Add customer email collection
      billing_address_collection: "auto",
      // Allow promotion codes
      allow_promotion_codes: true,
      // Metadata for order tracking
      metadata: {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
        hasPhysicalProducts: hasPhysicalProducts.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof Error) {
      // Return 404 for product not found errors
      if (error.message.startsWith("Product not found")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
