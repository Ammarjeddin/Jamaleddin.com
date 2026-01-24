"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Package, Download, Calendar, Truck, Shield } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { formatPrice, getDiscountPercentage, isInStock, getAvailableQuantity } from "@/lib/types/product";
import { AddToCartButton } from "./AddToCartButton";

interface ProductDetailProps {
  product: Product;
  currency?: string;
}

export function ProductDetail({ product, currency = "USD" }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.sku
  );

  const images = product.images?.length
    ? product.images
    : [{ src: "/images/placeholder-product.jpg", alt: product.name }];

  const discount = getDiscountPercentage(product);
  const inStock = isInStock(product);
  const availableQty = getAvailableQuantity(product);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (availableQty !== null && newQty > availableQty) return availableQty;
      return newQty;
    });
  };

  const ProductTypeIcon = {
    physical: Package,
    digital: Download,
    service: Calendar,
  }[product.productType];

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <Image
            src={images[selectedImage].src}
            alt={images[selectedImage].alt || product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                Save {discount}%
              </span>
            )}
            {!inStock && (
              <span className="bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt || `${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Category & Type */}
        <div className="flex items-center gap-3 text-sm">
          {product.category && (
            <span className="text-gray-500">{product.category}</span>
          )}
          <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded capitalize">
            <ProductTypeIcon className="w-4 h-4" />
            {product.productType}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {product.name}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.pricing.price, currency)}
          </span>
          {product.pricing.compareAtPrice && (
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(product.pricing.compareAtPrice, currency)}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-lg">{product.description}</p>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3">
            <label className="block font-medium text-gray-900">
              Select Option
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.sku}
                  onClick={() => setSelectedVariant(variant.sku)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedVariant === variant.sku
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="px-6 py-3 font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={availableQty !== null && quantity >= availableQty}
              className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Add to Cart */}
          <div className="flex-1">
            <AddToCartButton
              product={product}
              quantity={quantity}
              variantId={selectedVariant}
              variant="full"
            />
          </div>
        </div>

        {/* Stock Status */}
        {product.inventory?.trackInventory && (
          <p className="text-sm">
            {inStock ? (
              <span className="text-green-600">
                {availableQty !== null && availableQty <= 10
                  ? `Only ${availableQty} left in stock`
                  : "In stock"}
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>
        )}

        {/* Product Type Specific Info */}
        {product.productType === "physical" && product.physical?.requiresShipping && (
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="w-5 h-5" />
            <span>Shipping calculated at checkout</span>
          </div>
        )}

        {product.productType === "digital" && (
          <div className="flex items-center gap-2 text-gray-600">
            <Download className="w-5 h-5" />
            <span>
              Instant download
              {product.digital?.fileType && ` • ${product.digital.fileType}`}
              {product.digital?.fileSize && ` • ${product.digital.fileSize}`}
            </span>
          </div>
        )}

        {product.productType === "service" && product.service?.duration && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Duration: {product.service.duration}</span>
          </div>
        )}

        {/* Trust Badges */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
