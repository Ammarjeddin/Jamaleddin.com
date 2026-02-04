"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  Settings,
  Link as LinkIcon,
  Check,
  ExternalLink,
  FileEdit,
  Upload,
  RefreshCw,
} from "lucide-react";

interface ProductImage {
  src: string;
  alt?: string;
}

interface ProductVariant {
  name: string;
  sku?: string;
  quantity?: number;
  priceAdjustment?: number;
}

interface SubscriptionDetails {
  interval: "month" | "year";
  intervalCount?: number;
  trialDays?: number;
}

interface Product {
  name: string;
  slug: string;
  description?: string;
  productType: "physical" | "digital" | "service";
  pricing: {
    price: number;
    compareAtPrice?: number;
    taxable?: boolean;
  };
  subscription?: SubscriptionDetails;
  images?: ProductImage[];
  category?: string;
  tags?: string;
  inventory?: {
    trackInventory?: boolean;
    quantity?: number;
    sku?: string;
    allowBackorder?: boolean;
  };
  physical?: {
    weight?: number;
    requiresShipping?: boolean;
  };
  digital?: {
    downloadUrl?: string;
    downloadLimit?: number;
  };
  variants?: ProductVariant[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  status: "active" | "draft" | "archived";
  featured?: boolean;
  unlisted?: boolean;
}

interface ProductEditorProps {
  initialProduct?: Partial<Product>;
  isNew?: boolean;
  existingCategories?: string[];
}

const DEFAULT_PRODUCT: Product = {
  name: "",
  slug: "",
  description: "",
  productType: "physical",
  pricing: {
    price: 0,
    taxable: true,
  },
  images: [],
  category: "",
  tags: "",
  inventory: {
    trackInventory: true,
    quantity: 0,
    sku: "",
    allowBackorder: false,
  },
  physical: {
    weight: 0,
    requiresShipping: true,
  },
  variants: [],
  seo: {
    metaTitle: "",
    metaDescription: "",
  },
  status: "draft",
  featured: false,
  unlisted: false,
};

export function ProductEditor({ initialProduct, isNew = false, existingCategories = [] }: ProductEditorProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({ ...DEFAULT_PRODUCT, ...initialProduct });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "inventory" | "images" | "seo">("general");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const productUrl = typeof window !== "undefined"
    ? `${window.location.origin}/services/${product.slug}`
    : `/services/${product.slug}`;

  const copyProductLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (isNew && product.name && !initialProduct?.slug) {
      const slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setProduct(prev => ({ ...prev, slug }));
    }
  }, [product.name, isNew, initialProduct?.slug]);

  const handleSave = async (saveAsDraft: boolean = false) => {
    if (!product.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!product.slug.trim()) {
      setError("Product slug is required");
      return;
    }
    if (product.pricing.price < 0) {
      setError("Price cannot be negative");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);
    setSavedAsDraft(false);
    setShowSaveMenu(false);

    try {
      const filePath = `content/products/${product.slug}.json`;

      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: filePath,
          content: product,
          commitMessage: isNew ? `Add product: ${product.name}` : `Update product: ${product.name}`,
          saveAsDraft,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save");
      }

      if (saveAsDraft) {
        setSavedAsDraft(true);
        setTimeout(() => setSavedAsDraft(false), 3000);
      } else {
        setSaved(true);

        if (isNew) {
          // Redirect to edit page after creating
          router.push(`/dashboard/edit?collection=products&slug=${product.slug}`);
        } else {
          setTimeout(() => setSaved(false), 3000);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof Product>(field: K, value: Product[K]) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = <K extends keyof Product>(
    parent: K,
    field: string,
    value: unknown
  ) => {
    setProduct(prev => ({
      ...prev,
      [parent]: { ...(prev[parent] as Record<string, unknown>), [field]: value },
    }));
  };

  const addImage = () => {
    setProduct(prev => ({
      ...prev,
      images: [...(prev.images || []), { src: "", alt: "" }],
    }));
  };

  const updateImage = (index: number, field: keyof ProductImage, value: string) => {
    setProduct(prev => {
      const images = [...(prev.images || [])];
      images[index] = { ...images[index], [field]: value };
      return { ...prev, images };
    });
  };

  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= (product.images?.length || 0)) return;
    setProduct(prev => {
      const images = [...(prev.images || [])];
      const [removed] = images.splice(from, 1);
      images.splice(to, 0, removed);
      return { ...prev, images };
    });
  };

  const addVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { name: "", sku: "", quantity: 0 }],
    }));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: unknown) => {
    setProduct(prev => {
      const variants = [...(prev.variants || [])];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const removeVariant = (index: number) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index),
    }));
  };

  const addNewCategory = () => {
    if (newCategory.trim()) {
      updateField("category", newCategory.trim());
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  const tabs = [
    { id: "general" as const, label: "General", icon: Package },
    { id: "pricing" as const, label: "Pricing", icon: DollarSign },
    { id: "inventory" as const, label: "Inventory", icon: Tag },
    { id: "images" as const, label: "Images", icon: ImageIcon },
    { id: "seo" as const, label: "SEO", icon: Settings },
  ];

  // Combine existing categories with any new ones
  const allCategories = [...new Set([...existingCategories, product.category].filter(Boolean))] as string[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Products</span>
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-zinc-600" />
          <h1 className="font-semibold text-gray-900 dark:text-white">
            {isNew ? "New Product" : product.name || "Edit Product"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-600">{error}</span>}
          {saved && <span className="text-sm text-green-600 font-medium">✓ Published</span>}
          {savedAsDraft && <span className="text-sm text-blue-600 font-medium">✓ Draft saved</span>}

          {/* Copy Link Button - only show when product has a slug */}
          {product.slug && !isNew && (
            <div className="flex items-center">
              <button
                onClick={copyProductLink}
                className={`flex items-center gap-2 px-3 py-2 border rounded-l-lg text-sm transition-colors ${
                  copied
                    ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                    : "border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                }`}
                title="Copy product link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy Link</span>
                  </>
                )}
              </button>
              <a
                href={`/services/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 border border-l-0 border-gray-300 dark:border-zinc-600 rounded-r-lg text-sm text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                title="Open product page"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          <select
            value={product.status}
            onChange={(e) => updateField("status", e.target.value as Product["status"])}
            className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm bg-white dark:bg-zinc-700 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          {/* Save Options Dropdown */}
          <div className="relative">
            <div className="flex">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-l-lg transition-colors disabled:opacity-50"
                title={isNew ? "Create and publish" : "Save and publish"}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isNew ? "Create" : "Publish"}
              </button>
              <button
                onClick={() => setShowSaveMenu(!showSaveMenu)}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 rounded-r-lg border-l border-emerald-500 transition-colors disabled:opacity-50"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            {showSaveMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 z-50">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-t-lg"
                >
                  <Upload className="w-4 h-4" />
                  {isNew ? "Create & Publish" : "Save & Publish"}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-b-lg border-t border-gray-100 dark:border-zinc-700"
                >
                  <FileEdit className="w-4 h-4" />
                  Save as Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-zinc-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={product.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="product-slug"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                    disabled={!isNew}
                  />
                  {!isNew && (
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Slug cannot be changed after creation</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  value={product.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-zinc-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Product Type
                  </label>
                  <select
                    value={product.productType}
                    onChange={(e) => updateField("productType", e.target.value as Product["productType"])}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  >
                    <option value="physical">Physical Product</option>
                    <option value="digital">Digital Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Category
                  </label>
                  {showNewCategory ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyDown={(e) => e.key === "Enter" && addNewCategory()}
                      />
                      <button
                        onClick={addNewCategory}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowNewCategory(false)}
                        className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 dark:text-zinc-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={product.category || ""}
                        onChange={(e) => updateField("category", e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">No category</option>
                        {allCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowNewCategory(true)}
                        className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300"
                        title="Add new category"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={product.tags || ""}
                  onChange={(e) => updateField("tags", e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Separate tags with commas</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.featured || false}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Featured Product</span>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Display this product prominently</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.unlisted || false}
                  onChange={(e) => updateField("unlisted", e.target.checked)}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Unlisted Product</span>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Hidden from shop, accessible via direct link only</p>
                </div>
              </label>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.pricing.price}
                      onChange={(e) => updateNestedField("pricing", "price", parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Compare at Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.pricing.compareAtPrice || ""}
                      onChange={(e) => updateNestedField("pricing", "compareAtPrice", parseFloat(e.target.value) || undefined)}
                      placeholder="Original price for sale display"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Shows as strikethrough price if set</p>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.pricing.taxable ?? true}
                  onChange={(e) => updateNestedField("pricing", "taxable", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Charge tax on this product</span>
              </label>

              {/* Subscription Settings */}
              <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Recurring Billing</h3>
                </div>

                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={!!product.subscription}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProduct(prev => ({
                          ...prev,
                          subscription: { interval: "month", intervalCount: 1 },
                        }));
                      } else {
                        setProduct(prev => {
                          const { subscription, ...rest } = prev;
                          return rest as Product;
                        });
                      }
                    }}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Enable subscription billing</span>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Charge customers on a recurring basis</p>
                  </div>
                </label>

                {product.subscription && (
                  <div className="pl-8 space-y-4 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                          Billing Interval
                        </label>
                        <select
                          value={product.subscription.interval}
                          onChange={(e) => updateNestedField("subscription", "interval", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-zinc-700 dark:text-white"
                        >
                          <option value="month">Monthly</option>
                          <option value="year">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                          Interval Count
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={product.subscription.intervalCount || 1}
                          onChange={(e) => updateNestedField("subscription", "intervalCount", parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-zinc-700 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                          {product.subscription.intervalCount === 1
                            ? `Billed every ${product.subscription.interval}`
                            : `Billed every ${product.subscription.intervalCount} ${product.subscription.interval}s`}
                        </p>
                      </div>
                    </div>

                    <div className="max-w-xs">
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        Free Trial (days)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="365"
                        value={product.subscription.trialDays || ""}
                        onChange={(e) => updateNestedField("subscription", "trialDays", parseInt(e.target.value) || undefined)}
                        placeholder="No trial"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-zinc-700 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Optional: Offer a free trial period</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        <strong>Price Summary:</strong>{" "}
                        ${product.pricing.price.toFixed(2)}
                        {product.subscription.intervalCount === 1
                          ? ` / ${product.subscription.interval}`
                          : ` / ${product.subscription.intervalCount} ${product.subscription.interval}s`}
                        {product.subscription.trialDays && (
                          <span className="text-purple-600 ml-2">
                            ({product.subscription.trialDays}-day free trial)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Product Variants</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Add size, color, or other variations</p>
                  </div>
                  <button
                    onClick={addVariant}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </button>
                </div>

                {product.variants && product.variants.length > 0 ? (
                  <div className="space-y-3">
                    {product.variants.map((variant, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => updateVariant(index, "name", e.target.value)}
                            placeholder="Variant name (e.g., Small)"
                            className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm bg-white dark:bg-zinc-700 dark:text-white"
                          />
                          <input
                            type="text"
                            value={variant.sku || ""}
                            onChange={(e) => updateVariant(index, "sku", e.target.value)}
                            placeholder="SKU"
                            className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm bg-white dark:bg-zinc-700 dark:text-white"
                          />
                          <input
                            type="number"
                            value={variant.quantity || 0}
                            onChange={(e) => updateVariant(index, "quantity", parseInt(e.target.value) || 0)}
                            placeholder="Quantity"
                            className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm bg-white dark:bg-zinc-700 dark:text-white"
                          />
                        </div>
                        <button
                          onClick={() => removeVariant(index)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">No variants added</p>
                )}
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.inventory?.trackInventory ?? false}
                  onChange={(e) => updateNestedField("inventory", "trackInventory", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Track inventory</span>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Keep track of stock levels</p>
                </div>
              </label>

              {product.inventory?.trackInventory && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={product.inventory?.quantity || 0}
                      onChange={(e) => updateNestedField("inventory", "quantity", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={product.inventory?.sku || ""}
                      onChange={(e) => updateNestedField("inventory", "sku", e.target.value)}
                      placeholder="Stock keeping unit"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.inventory?.allowBackorder ?? false}
                  onChange={(e) => updateNestedField("inventory", "allowBackorder", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Allow backorders</span>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Continue selling when out of stock</p>
                </div>
              </label>

              {/* Physical Product Options */}
              {product.productType === "physical" && (
                <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Shipping</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.physical?.requiresShipping ?? true}
                        onChange={(e) => updateNestedField("physical", "requiresShipping", e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Requires shipping</span>
                    </label>

                    <div className="max-w-xs">
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        Weight (oz)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={product.physical?.weight || ""}
                        onChange={(e) => updateNestedField("physical", "weight", parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Product Options */}
              {product.productType === "digital" && (
                <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Digital Delivery</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        Download URL
                      </label>
                      <input
                        type="url"
                        value={product.digital?.downloadUrl || ""}
                        onChange={(e) => updateNestedField("digital", "downloadUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                      />
                    </div>
                    <div className="max-w-xs">
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        Download Limit
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={product.digital?.downloadLimit || ""}
                        onChange={(e) => updateNestedField("digital", "downloadLimit", parseInt(e.target.value) || undefined)}
                        placeholder="Unlimited"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Product Images</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">First image will be the main product image</p>
                </div>
                <button
                  onClick={addImage}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Image
                </button>
              </div>

              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                      <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-600 rounded-lg overflow-hidden flex-shrink-0">
                        {image.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image.src}
                            alt={image.alt || "Product image"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          type="url"
                          value={image.src}
                          onChange={(e) => updateImage(index, "src", e.target.value)}
                          placeholder="Image URL"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          value={image.alt || ""}
                          onChange={(e) => updateImage(index, "alt", e.target.value)}
                          placeholder="Alt text (for accessibility)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveImage(index, index - 1)}
                          disabled={index === 0}
                          className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveImage(index, index + 1)}
                          disabled={index === product.images!.length - 1}
                          className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-zinc-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-600">
                  <ImageIcon className="w-12 h-12 text-gray-400 dark:text-zinc-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-zinc-400 mb-3">No images added yet</p>
                  <button
                    onClick={addImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Add First Image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={product.seo?.metaTitle || ""}
                  onChange={(e) => updateNestedField("seo", "metaTitle", e.target.value)}
                  placeholder={product.name || "Product title for search engines"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  {(product.seo?.metaTitle || product.name || "").length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={product.seo?.metaDescription || ""}
                  onChange={(e) => updateNestedField("seo", "metaDescription", e.target.value)}
                  placeholder={product.description || "Description for search engine results"}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-zinc-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  {(product.seo?.metaDescription || product.description || "").length}/160 characters
                </p>
              </div>

              {/* Preview */}
              <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Search Preview</h3>
                <div className="p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                  <p className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer">
                    {product.seo?.metaTitle || product.name || "Product Title"}
                  </p>
                  <p className="text-green-700 dark:text-green-500 text-sm">
                    yoursite.com/services/{product.slug || "product-slug"}
                  </p>
                  <p className="text-gray-600 dark:text-zinc-400 text-sm mt-1">
                    {product.seo?.metaDescription || product.description || "Product description will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
