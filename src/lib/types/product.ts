export type ProductType = "physical" | "digital" | "service";
export type ProductStatus = "active" | "draft" | "archived";
export type BillingInterval = "month" | "year";

export interface SubscriptionDetails {
  interval: BillingInterval;
  intervalCount?: number; // e.g., 2 for "every 2 months"
  trialDays?: number;
}

export interface ProductImage {
  src: string;
  alt?: string;
}

export interface ProductPricing {
  price: number;
  compareAtPrice?: number;
  taxable?: boolean;
}

export interface ProductInventory {
  trackInventory?: boolean;
  quantity?: number;
  sku?: string;
  allowBackorder?: boolean;
}

export interface PhysicalProductDetails {
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  requiresShipping?: boolean;
}

export interface DigitalProductDetails {
  downloadUrl?: string;
  fileType?: string;
  fileSize?: string;
  downloadLimit?: number;
}

export interface ServiceDetails {
  duration?: string;
  requiresBooking?: boolean;
  bookingUrl?: string;
}

export interface ProductVariant {
  name: string;
  sku?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface Product {
  name: string;
  slug: string;
  description?: string;
  stripeProductId?: string; // Stripe live product ID (e.g., prod_xxx)
  stripeTestProductId?: string; // Stripe test product ID
  longDescription?: unknown; // Rich text from TinaCMS
  productType: ProductType;
  pricing: ProductPricing;
  images?: ProductImage[];
  category?: string;
  tags?: string;
  inventory?: ProductInventory;
  physical?: PhysicalProductDetails;
  digital?: DigitalProductDetails;
  service?: ServiceDetails;
  variants?: ProductVariant[];
  seo?: ProductSEO;
  status?: ProductStatus;
  featured?: boolean;
  unlisted?: boolean; // Hidden from listings but accessible via direct link/code
  subscription?: SubscriptionDetails; // Optional - if present, product is a subscription
}

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// Helper types for shop settings
export interface ShopSettings {
  enabled: boolean;
  currency: string;
  productsPerPage: number;
  gridColumns: "2" | "3" | "4";
}

// Format price with currency
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

// Check if product is in stock
export function isInStock(product: Product): boolean {
  if (!product.inventory?.trackInventory) {
    return true;
  }
  if (product.inventory.allowBackorder) {
    return true;
  }
  return (product.inventory.quantity ?? 0) > 0;
}

// Get available quantity
export function getAvailableQuantity(product: Product): number | null {
  if (!product.inventory?.trackInventory) {
    return null; // Unlimited
  }
  return product.inventory.quantity ?? 0;
}

// Parse tags string to array
export function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

// Calculate discount percentage
export function getDiscountPercentage(product: Product): number | null {
  const { price, compareAtPrice } = product.pricing;
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// Sort options type
export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";

// Sort products (pure function, safe for client)
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      return sorted.sort((a, b) => a.pricing.price - b.pricing.price);
    case "price-desc":
      return sorted.sort((a, b) => b.pricing.price - a.pricing.price);
    case "newest":
    default:
      return sorted;
  }
}

// Check if product is a subscription
export function isSubscriptionProduct(product: Product): boolean {
  return !!product.subscription;
}

// Format subscription price with interval
export function formatSubscriptionPrice(
  price: number,
  interval: BillingInterval,
  intervalCount: number = 1,
  currency: string = "USD"
): string {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);

  if (intervalCount === 1) {
    return `${formattedPrice}/${interval}`;
  }
  return `${formattedPrice}/${intervalCount} ${interval}s`;
}
