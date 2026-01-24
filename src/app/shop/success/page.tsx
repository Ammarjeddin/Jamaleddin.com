"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Container } from "@/components/ui/Container";

export default function SuccessPage() {
  const { clearCart } = useCart();

  // Clear cart on successful order
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank you for your order!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your order has been placed successfully. We&apos;ll send you an email confirmation shortly.
          </p>

          {/* Order Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <div className="bg-white rounded-xl p-6 text-left shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-gray-900">Confirmation Email</h3>
              </div>
              <p className="text-sm text-gray-600">
                A confirmation email with your order details has been sent to your email address.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-left shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-gray-900">Order Processing</h3>
              </div>
              <p className="text-sm text-gray-600">
                We&apos;re preparing your order. Physical items typically ship within 2-3 business days.
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-medium flex-shrink-0">
                  1
                </span>
                <span className="text-gray-600">
                  You&apos;ll receive an email confirmation with your order details and receipt.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-medium flex-shrink-0">
                  2
                </span>
                <span className="text-gray-600">
                  For digital products, you&apos;ll receive download links in your confirmation email.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-medium flex-shrink-0">
                  3
                </span>
                <span className="text-gray-600">
                  For physical products, we&apos;ll send tracking information once your order ships.
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
