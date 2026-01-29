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
      <div className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-20 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to continue to checkout.</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Back Link */}
        <Link
          href="/shop/cart"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h1>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.slug}-${item.variantId || "default"}`}
                  className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.product.pricing.price * item.quantity, currency)}
                  </p>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Final amount will be calculated by Stripe including shipping and tax
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>

            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Trust Badges */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span>Encrypted payment</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Click below to proceed to our secure checkout powered by Stripe.
                You&apos;ll be able to enter your payment and shipping information there.
              </p>

              <StripeCheckout />

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Accepted payment methods:</p>
                <div className="flex gap-2 flex-wrap">
                  {["Visa", "Mastercard", "Amex", "Discover", "Apple Pay", "Google Pay"].map(
                    (method) => (
                      <span
                        key={method}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {method}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Need help?</strong> Contact us at{" "}
                <a href="mailto:support@example.com" className="underline">
                  support@example.com
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
