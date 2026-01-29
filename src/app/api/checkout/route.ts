import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
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

    // Create line items for Stripe using server-side product data
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const { product: clientProduct, quantity } = item;

        // Look up the product server-side to prevent price manipulation
        const product = await getProduct(clientProduct.slug);
        if (!product) {
          throw new Error(`Product not found: ${clientProduct.slug}`);
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
            unit_amount: Math.round(product.pricing.price * 100), // Server-side price in cents
          },
          quantity,
        };
      })
    );

    // Determine product types for shipping using server-side data
    const productSlugs = items.map((item) => item.product.slug);
    const serverProducts = await Promise.all(productSlugs.map((slug) => getProduct(slug)));
    const hasPhysicalProducts = serverProducts.some(
      (p) => p?.productType === "physical"
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
