"use client";

import { useState, useMemo } from "react";
import type { Product, SortOption } from "@/lib/types/product";
import { sortProducts, isSubscriptionProduct } from "@/lib/types/product";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductSort } from "@/components/shop/ProductSort";

interface ShopPageClientProps {
  initialProducts: Product[];
  categories: string[];
  currency: string;
  gridColumns: string;
}

export function ShopPageClient({
  initialProducts,
  categories,
  currency,
  gridColumns,
}: ShopPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedProductType, setSelectedProductType] = useState<string | undefined>();
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Product type filter
    if (selectedProductType) {
      if (selectedProductType === "subscription") {
        filtered = filtered.filter((p) => isSubscriptionProduct(p));
      } else {
        filtered = filtered.filter((p) => p.productType === selectedProductType && !isSubscriptionProduct(p));
      }
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => {
        if (!p.inventory?.trackInventory) return true;
        if (p.inventory.allowBackorder) return true;
        return (p.inventory.quantity ?? 0) > 0;
      });
    }

    // Sort
    return sortProducts(filtered, sort);
  }, [initialProducts, selectedCategory, selectedProductType, inStockOnly, sort]);

  const gridColsClass = {
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[gridColumns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:w-64 flex-shrink-0">
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          selectedProductType={selectedProductType}
          onProductTypeChange={setSelectedProductType}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-gray-600 dark:text-slate-300">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
          <ProductSort value={sort} onChange={setSort} />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid ${gridColsClass} gap-6`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} currency={currency} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 dark:text-slate-400">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory(undefined);
                setSelectedProductType(undefined);
                setInStockOnly(false);
              }}
              className="mt-4 text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
