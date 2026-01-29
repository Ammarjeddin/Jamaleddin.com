"use client";

import { useState } from "react";
import { ChevronDown, X, Filter } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory?: string;
  onCategoryChange: (category: string | undefined) => void;
  priceRange?: { min: number; max: number };
  onPriceRangeChange?: (range: { min?: number; max?: number } | undefined) => void;
  inStockOnly?: boolean;
  onInStockChange?: (inStock: boolean) => void;
  productTypes?: string[];
  selectedProductType?: string;
  onProductTypeChange?: (type: string | undefined) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly = false,
  onInStockChange,
  productTypes = ["physical", "digital", "service"],
  selectedProductType,
  onProductTypeChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["category", "price", "availability"])
  );

  const toggleSection = (section: string) => {
    const newSections = new Set(openSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setOpenSections(newSections);
  };

  const hasActiveFilters =
    selectedCategory || priceRange || inStockOnly || selectedProductType;

  const clearAllFilters = () => {
    onCategoryChange(undefined);
    onPriceRangeChange?.(undefined);
    onInStockChange?.(false);
    onProductTypeChange?.(undefined);
  };

  const FilterContent = () => {
    return (
      <div className="space-y-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection("category")}
              className="flex items-center justify-between w-full text-left font-medium mb-3 text-gray-700 dark:text-white"
            >
              Category
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSections.has("category") ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.has("category") && (
              <div className="space-y-2">
                <button
                  onClick={() => onCategoryChange(undefined)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Type Filter */}
        {onProductTypeChange && (
          <div>
            <button
              onClick={() => toggleSection("type")}
              className="flex items-center justify-between w-full text-left font-medium mb-3 text-gray-700 dark:text-white"
            >
              Product Type
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSections.has("type") ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.has("type") && (
              <div className="space-y-2">
                <button
                  onClick={() => onProductTypeChange(undefined)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedProductType
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  All Types
                </button>
                {productTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => onProductTypeChange(type)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                      selectedProductType === type
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Availability Filter */}
        {onInStockChange && (
          <div>
            <button
              onClick={() => toggleSection("availability")}
              className="flex items-center justify-between w-full text-left font-medium mb-3 text-gray-700 dark:text-white"
            >
              Availability
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSections.has("availability") ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.has("availability") && (
              <label className="flex items-center gap-3 cursor-pointer px-3 py-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onInStockChange(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700 dark:text-white">In stock only</span>
              </label>
            )}
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-sm transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-white"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm p-6 overflow-y-auto bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 dark:text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </>
  );
}
