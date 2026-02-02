"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/types/product";
import { Container } from "@/components/ui/Container";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart, currency } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen glass">
        <Container>
          <div className="py-20 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-slate-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">Your cart is empty</h1>
            <p className="text-[var(--color-text-muted)] mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen glass py-12">
      <Container>
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:shadow-lg dark:shadow-black/20">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-medium text-[var(--color-text-muted)]">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              {items.map((item) => {
                const imageUrl = item.product.images?.[0]?.src || "/images/placeholder-product.jpg";
                const variantName = item.variantId
                  ? item.product.variants?.find((v) => v.sku === item.variantId)?.name
                  : null;

                return (
                  <div
                    key={`${item.product.slug}-${item.variantId || "default"}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center"
                  >
                    {/* Product Info */}
                    <div className="md:col-span-6 flex gap-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/services/${item.product.slug}`}
                          className="font-medium text-[var(--color-text)] hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {variantName && (
                          <p className="text-sm text-[var(--color-text-muted)]">{variantName}</p>
                        )}
                        <button
                          onClick={() => removeItem(item.product.slug, item.variantId)}
                          className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center gap-1 md:hidden"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex items-center justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.slug, item.quantity - 1, item.variantId)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.slug, item.quantity + 1, item.variantId)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 text-right">
                      <span className="md:hidden text-sm text-[var(--color-text-muted)] mr-2">Price:</span>
                      {formatPrice(item.product.pricing.price, currency)}
                    </div>

                    {/* Total */}
                    <div className="md:col-span-2 text-right flex items-center justify-end gap-4">
                      <span>
                        <span className="md:hidden text-sm text-[var(--color-text-muted)] mr-2">Total:</span>
                        <span className="font-semibold">
                          {formatPrice(item.product.pricing.price * item.quantity, currency)}
                        </span>
                      </span>
                      <button
                        onClick={() => removeItem(item.product.slug, item.variantId)}
                        className="hidden md:block text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Footer */}
              <div className="p-4 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-[var(--color-text-muted)] hover:text-gray-700 transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/services"
                  className="text-sm text-primary hover:underline"
                >
                  Browse Services
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4 dark:shadow-lg dark:shadow-black/20">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Items ({itemCount})</span>
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

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold text-[var(--color-text)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
              </div>

              <Link
                href="/services/checkout"
                className="block w-full bg-primary text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <p className="text-xs text-[var(--color-text-muted)] text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
