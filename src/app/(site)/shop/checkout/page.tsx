"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, Shield, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/types/product";
import { Container } from "@/components/ui/Container";
import { StripeCheckout } from "@/components/shop/StripeCheckout";

export default function CheckoutPage() {
  const { items, subtotal, itemCount, currency } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen glass">
        <Container>
          <div className="py-20 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">Your cart is empty</h1>
            <p className="text-[var(--color-text-muted)] mb-8">Add some items to continue to checkout.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen glass pt-24 pb-12">
      <Container>
        {/* Back Link */}
        <Link
          href="/shop/cart"
          className="inline-flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Order Summary</h1>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.slug}-${item.variantId || "default"}`}
                  className="flex justify-between items-start py-3 border-b border-white/10 last:border-0"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{item.product.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-[var(--color-text)]">
                    {formatPrice(item.product.pricing.price * item.quantity, currency)}
                  </p>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Tax</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between text-xl font-bold text-[var(--color-text)]">
                  <span>Total</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Final amount will be calculated by Stripe including shipping and tax
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Payment</h2>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              {/* Trust Badges */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span>Encrypted payment</span>
                </div>
              </div>

              <p className="text-[var(--color-text-muted)] mb-6">
                Click below to proceed to our secure checkout powered by Stripe.
                You&apos;ll be able to enter your payment and shipping information there.
              </p>

              <StripeCheckout />

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Accepted payment methods:</p>
                <div className="flex gap-2 flex-wrap">
                  {["Visa", "Mastercard", "Amex", "Discover", "Apple Pay", "Google Pay"].map(
                    (method) => (
                      <span
                        key={method}
                        className="px-3 py-1 bg-white/10 text-[var(--color-text-muted)] text-xs rounded-full"
                      >
                        {method}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-zinc-300">
                <strong className="text-white">Need help?</strong> Contact us at{" "}
                <a href="mailto:info@jamaleddin.com" className="underline">
                  info@jamaleddin.com
                </a>{" "}
                if you have any questions about your order.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
