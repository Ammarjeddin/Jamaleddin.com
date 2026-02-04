"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Container } from "@/components/ui/Container";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "verified" | "error">(
    sessionId ? "loading" : "error"
  );

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    async function verifySession() {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await res.json();

        if (res.ok && data.verified) {
          setStatus("verified");
          clearCart();
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    verifySession();
  }, [sessionId, clearCart]);

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
        <p className="text-lg text-[var(--color-text-muted)]">Verifying your order...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-8">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] mb-8">
          We couldn&apos;t verify your order. If you were charged, please contact support.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
        Thank you for your order!
      </h1>

      <p className="text-lg text-[var(--color-text-muted)] mb-8">
        Your order has been placed successfully. We&apos;ll send you an email confirmation shortly.
      </p>

      {/* Order Info Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="bg-white rounded-xl p-6 text-left shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-[var(--color-text)]">Confirmation Email</h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            A confirmation email with your order details has been sent to your email address.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 text-left shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-[var(--color-text)]">Order Processing</h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            We&apos;re preparing your order. Physical items typically ship within 2-3 business days.
          </p>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">What happens next?</h2>
        <ul className="text-left space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-medium flex-shrink-0">
              1
            </span>
            <span className="text-[var(--color-text-muted)]">
              You&apos;ll receive an email confirmation with your order details and receipt.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-medium flex-shrink-0">
              2
            </span>
            <span className="text-[var(--color-text-muted)]">
              For digital products, you&apos;ll receive download links in your confirmation email.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-medium flex-shrink-0">
              3
            </span>
            <span className="text-[var(--color-text-muted)]">
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
          Browse Services
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-gray-100 text-[var(--color-text)] px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen glass py-20">
      <Container>
        <Suspense
          fallback={
            <div className="max-w-2xl mx-auto text-center">
              <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-lg text-[var(--color-text-muted)]">Loading...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </Container>
    </div>
  );
}
