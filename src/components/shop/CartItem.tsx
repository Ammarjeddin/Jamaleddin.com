"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { CartItem as CartItemType } from "@/lib/types/product";
import { formatPrice } from "@/lib/types/product";

interface CartItemProps {
  item: CartItemType;
  currency?: string;
}

export function CartItem({ item, currency = "USD" }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, variantId } = item;

  const imageUrl = product.images?.[0]?.src || "/images/placeholder-product.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;

  const handleIncrement = () => {
    updateQuantity(product.slug, quantity + 1, variantId);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.slug, quantity - 1, variantId);
    } else {
      removeItem(product.slug, variantId);
    }
  };

  const handleRemove = () => {
    removeItem(product.slug, variantId);
  };

  // Get variant name if applicable
  const variantName = variantId
    ? product.variants?.find((v) => v.sku === variantId)?.name
    : null;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 dark:border-slate-700">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-[var(--color-text)] truncate">{product.name}</h3>
            {variantName && (
              <p className="text-sm text-gray-500">{variantName}</p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 dark:text-slate-500 hover:text-[var(--color-text-muted)] p-1"
            aria-label="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between items-end mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200 dark:border-slate-600 rounded-lg">
            <button
              onClick={handleDecrement}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Item Total */}
          <p className="font-semibold text-[var(--color-text)]">
            {formatPrice(product.pricing.price * quantity, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
