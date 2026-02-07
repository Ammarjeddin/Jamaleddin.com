import fs from "fs";
import path from "path";
import type { Product } from "./types/product";
import { getStripe } from "./stripe";

const PRODUCTS_DIR = path.join(process.cwd(), "content/products");

/**
 * Enrich a local product with Stripe data (name, price, image).
 * Local description is always preserved.
 */
async function enrichWithStripeData(product: Product): Promise<Product> {
  if (!product.stripeProductId) return product;

  try {
    const stripe = getStripe();
    const stripeProduct = await stripe.products.retrieve(product.stripeProductId);

    // Fetch the default price if it exists
    let stripePrice: number | undefined;
    if (stripeProduct.default_price) {
      const priceId = typeof stripeProduct.default_price === "string"
        ? stripeProduct.default_price
        : stripeProduct.default_price.id;
      const price = await stripe.prices.retrieve(priceId);
      if (price.unit_amount) {
        stripePrice = price.unit_amount / 100;
      }
    }

    return {
      ...product,
      name: stripeProduct.name || product.name,
      images: stripeProduct.images?.length
        ? stripeProduct.images.map((src) => ({ src, alt: stripeProduct.name }))
        : product.images,
      pricing: {
        ...product.pricing,
        ...(stripePrice !== undefined ? { price: stripePrice } : {}),
      },
    };
  } catch (error) {
    console.error(`Error fetching Stripe data for ${product.stripeProductId}:`, error);
    return product; // Fall back to local data
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const filePath = path.join(PRODUCTS_DIR, `${slug}.json`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const product = JSON.parse(fileContent) as Product;
    return enrichWithStripeData(product);
  } catch (error) {
    console.error(`Error reading product ${slug}:`, error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return [];
    }

    const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".json"));

    const products = files.map((file) => {
      const content = fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf-8");
      return JSON.parse(content) as Product;
    });

    return Promise.all(products.map(enrichWithStripeData));
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.status === "active" && !p.unlisted);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((p) => p.featured);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((p) => {
    const tags = p.tags?.split(",").map((t) => t.trim().toLowerCase()) ?? [];
    return tags.includes(tag.toLowerCase());
  });
}

export async function getProductCategories(): Promise<string[]> {
  const products = await getActiveProducts();
  const categories = new Set<string>();

  products.forEach((p) => {
    if (p.category) {
      categories.add(p.category);
    }
  });

  return Array.from(categories).sort();
}

export async function getProductTags(): Promise<string[]> {
  const products = await getActiveProducts();
  const tags = new Set<string>();

  products.forEach((p) => {
    if (p.tags) {
      p.tags.split(",").forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) tags.add(trimmed);
      });
    }
  });

  return Array.from(tags).sort();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getActiveProducts();
  const lowerQuery = query.toLowerCase();

  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery) ||
      p.tags?.toLowerCase().includes(lowerQuery)
    );
  });
}

export interface ProductFilters {
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  productType?: string;
}

export async function getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
  let products = await getActiveProducts();

  if (filters.category) {
    products = products.filter(
      (p) => p.category?.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.tag) {
    const tag = filters.tag.toLowerCase();
    products = products.filter((p) => {
      const tags = p.tags?.split(",").map((t) => t.trim().toLowerCase()) ?? [];
      return tags.includes(tag);
    });
  }

  if (filters.minPrice !== undefined) {
    products = products.filter((p) => p.pricing.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => p.pricing.price <= filters.maxPrice!);
  }

  if (filters.inStock) {
    products = products.filter((p) => {
      if (!p.inventory?.trackInventory) return true;
      if (p.inventory.allowBackorder) return true;
      return (p.inventory.quantity ?? 0) > 0;
    });
  }

  if (filters.productType) {
    products = products.filter((p) => p.productType === filters.productType);
  }

  return products;
}

// Note: SortOption and sortProducts are exported from @/lib/types/product for client-side use

export async function getProductSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return [];
    }

    const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".json"));
    return files.map((f) => f.replace(".json", ""));
  } catch (error) {
    console.error("Error reading product slugs:", error);
    return [];
  }
}
