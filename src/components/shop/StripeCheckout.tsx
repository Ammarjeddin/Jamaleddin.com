"use client";

import { useState } from "react";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface StripeCheckoutProps {
  className?: string;
}

export function StripeCheckout({ className = "" }: StripeCheckoutProps) {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Checkout Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Proceed to Checkout
          </>
        )}
      </button>

      <p className="text-xs text-zinc-400 text-center mt-3">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}
