"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CartIcon() {
  const { itemCount, toggleCart } = useCart();

  // Only show cart icon if there are items in the cart
  if (itemCount === 0) return null;

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-300 hover:text-[var(--color-accent)] active:scale-95 transition-all"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-accent)] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </button>
  );
}
