import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type { CartItem } from "@/lib/types/product";

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

    // Create line items for Stripe
    const lineItems = items.map((item) => {
      const { product, quantity } = item;

      return {
        price_data: {
          currency: "usd", // Could be dynamic from settings
          product_data: {
            name: product.name,
            description: product.description || undefined,
            images: product.images?.map((img) => {
              // Ensure absolute URLs for images
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
          unit_amount: Math.round(product.pricing.price * 100), // Convert to cents
        },
        quantity,
      };
    });

    // Determine product types for shipping
    const hasPhysicalProducts = items.some(
      (item) => item.product.productType === "physical"
    );

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/shop/cart`,
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
