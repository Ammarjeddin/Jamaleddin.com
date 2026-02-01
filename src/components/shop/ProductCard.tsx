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
    <div className="group rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white dark:bg-slate-800">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square bg-gray-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isSubscription && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
              Subscription
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}
          {!inStock && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Type Badge */}
        {product.productType !== "physical" && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded capitalize">
              {product.productType}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-sm mb-1 text-gray-500 dark:text-slate-400">{product.category}</p>
        )}

        {/* Title */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 text-gray-900 dark:text-white">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-sm mt-1 line-clamp-2 text-gray-600 dark:text-slate-300">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
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
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.pricing.compareAtPrice, currency)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="mt-4">
          <AddToCartButton product={product} variant="compact" />
        </div>
      </div>
    </div>
  );
}
