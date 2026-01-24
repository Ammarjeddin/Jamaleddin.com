"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/lib/types/product";
import { isInStock } from "@/lib/types/product";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variantId?: string;
  variant?: "default" | "compact" | "full";
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variantId,
  variant = "default",
  className = "",
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  const inStock = isInStock(product);

  const handleAddToCart = async () => {
    if (!inStock || status !== "idle") return;

    setStatus("adding");

    // Simulate a brief delay for feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem(product, quantity, variantId);
    setStatus("added");

    // Open the cart drawer
    openCart();

    // Reset status after animation
    setTimeout(() => {
      setStatus("idle");
    }, 1500);
  };

  const baseStyles = "font-medium rounded-lg transition-all flex items-center justify-center gap-2";

  const variantStyles = {
    default: "px-6 py-3",
    compact: "px-4 py-2 text-sm",
    full: "w-full px-6 py-3",
  };

  const stateStyles = {
    idle: inStock
      ? "bg-primary text-white hover:bg-primary/90"
      : "bg-gray-200 text-gray-500 cursor-not-allowed",
    adding: "bg-primary/80 text-white cursor-wait",
    added: "bg-green-500 text-white",
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!inStock || status !== "idle"}
      className={`${baseStyles} ${variantStyles[variant]} ${stateStyles[status]} ${className}`}
      aria-label={inStock ? "Add to cart" : "Out of stock"}
    >
      {status === "idle" && (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </>
      )}
      {status === "adding" && (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Adding...</span>
        </>
      )}
      {status === "added" && (
        <>
          <Check className="w-4 h-4" />
          <span>Added!</span>
        </>
      )}
    </button>
  );
}
