"use client";

import { useState, useMemo } from "react";
import type { Product, SortOption } from "@/lib/types/product";
import { sortProducts, isSubscriptionProduct } from "@/lib/types/product";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductSort } from "@/components/shop/ProductSort";
import { Search, Lock } from "lucide-react";

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
  const [accessCode, setAccessCode] = useState("");
  const [unlistedProduct, setUnlistedProduct] = useState<Product | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleAccessCodeSearch = async () => {
    if (!accessCode.trim()) return;

    setSearching(true);
    setSearchError("");
    setUnlistedProduct(null);

    try {
      const response = await fetch(`/api/services/access?code=${encodeURIComponent(accessCode.trim())}`);
      const data = await response.json();

      if (response.ok && data.product) {
        setUnlistedProduct(data.product);
      } else {
        setSearchError(data.error || "Service not found");
      }
    } catch {
      setSearchError("Failed to search. Please try again.");
    } finally {
      setSearching(false);
    }
  };

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
    <div>
      {/* Access Code Search - Top of page */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-[var(--color-text)]">Have an access code?</span>
          </div>
          <div className="flex gap-2 flex-1 max-w-md">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAccessCodeSearch()}
              placeholder="Enter your access code"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-[var(--color-text)] placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={handleAccessCodeSearch}
              disabled={searching || !accessCode.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
          {searchError && (
            <p className="text-sm text-red-600 dark:text-red-400">{searchError}</p>
          )}
        </div>
      </div>

      {/* Unlisted Product Result */}
      {unlistedProduct && (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">🔓 Exclusive Service Unlocked</h3>
            <button
              onClick={() => {
                setUnlistedProduct(null);
                setAccessCode("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Clear
            </button>
          </div>
          <div className="max-w-sm">
            <ProductCard product={unlistedProduct} currency={currency} />
          </div>
        </div>
      )}

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
          <p className="text-[var(--color-text-muted)]">
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
    </div>
  );
}
