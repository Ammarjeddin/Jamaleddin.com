"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { formatPrice, getDiscountPercentage, isInStock, isSubscriptionProduct, formatSubscriptionPrice } from "@/lib/types/product";
import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
  currency?: string;
}

export function ProductCard({ product, currency = "USD" }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.src || "/images/placeholder-product.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const discount = getDiscountPercentage(product);
  const inStock = isInStock(product);
  const isSubscription = isSubscriptionProduct(product);

  return (
    <div className="glass-card group">
      {/* Gold glow border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[var(--color-accent)]/20 via-transparent to-[var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="glass-card-inner">
        {/* Image - Touch area */}
        <Link href={`/services/${product.slug}`} className="block relative aspect-square overflow-hidden active:opacity-90 transition-opacity">
          {/* Background for loading state */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-elevated)]" />

          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isSubscription && (
              <span className="bg-purple-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-400/30">
                Subscription
              </span>
            )}
            {discount && (
              <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-red-400/30">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="bg-[var(--color-accent)]/90 backdrop-blur-sm text-black text-xs font-bold px-2.5 py-1 rounded-lg border border-[var(--color-accent)]/50">
                Featured
              </span>
            )}
            {!inStock && (
              <span className="bg-zinc-800/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-zinc-600/30">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Type Badge */}
          {product.productType !== "physical" && (
            <div className="absolute top-3 right-3">
              <span className="bg-black/50 backdrop-blur-sm text-zinc-200 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/10 capitalize">
                {product.productType}
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="relative p-4 sm:p-5">
          {/* Category */}
          {product.category && (
            <p className="text-xs sm:text-sm mb-1 text-[var(--color-accent)]/80 font-medium">{product.category}</p>
          )}

          {/* Title */}
          <Link href={`/services/${product.slug}`} className="block min-h-[44px] flex items-center">
            <h3 className="font-semibold group-hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-2 text-zinc-100 text-sm sm:text-base">
              {product.name}
            </h3>
          </Link>

          {/* Description - Hidden on very small screens */}
          {product.description && (
            <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 line-clamp-2 text-zinc-400 leading-relaxed hidden xs:block">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-3 sm:mt-4">
            <span className="text-base sm:text-lg font-bold text-[var(--color-accent)]">
              {isSubscription && product.subscription
                ? formatSubscriptionPrice(
                    product.pricing.price,
                    product.subscription.interval,
                    product.subscription.intervalCount || 1,
                    currency
                  )
                : formatPrice(product.pricing.price, currency)}
            </span>
            {product.pricing.compareAtPrice && (
              <span className="text-xs sm:text-sm text-zinc-500 line-through">
                {formatPrice(product.pricing.compareAtPrice, currency)}
              </span>
            )}
          </div>

          {/* Add to Cart - Touch-friendly */}
          <div className="mt-3 sm:mt-4">
            <AddToCartButton product={product} variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
