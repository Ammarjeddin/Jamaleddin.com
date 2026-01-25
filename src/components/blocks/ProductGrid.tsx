import { ProductCard } from "@/components/shop/ProductCard";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { getActiveProducts, getFeaturedProducts, getProductsByCategory } from "@/lib/products";
import type { Product } from "@/lib/types/product";

interface ProductGridProps {
  heading?: string;
  subheading?: string;
  displayMode?: "all" | "featured" | "category";
  category?: string;
  maxProducts?: number;
  columns?: "2" | "3" | "4";
  isFirstBlock?: boolean;
}

export async function ProductGrid({
  heading,
  subheading,
  displayMode = "all",
  category,
  maxProducts = 12,
  columns = "3",
  isFirstBlock = false,
}: ProductGridProps) {
  let products: Product[];

  switch (displayMode) {
    case "featured":
      products = await getFeaturedProducts();
      break;
    case "category":
      products = category
        ? await getProductsByCategory(category)
        : await getActiveProducts();
      break;
    default:
      products = await getActiveProducts();
  }

  products = products.slice(0, maxProducts);

  const gridColsClass = {
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  return (
    <section className={cn("section dark:bg-slate-900", isFirstBlock && "-mt-20 pt-40")}>
      <Container>
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        {products.length > 0 ? (
          <div className={`grid ${gridColsClass} gap-6`}>
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-slate-400 py-12">
            No products found.
          </p>
        )}
      </Container>
    </section>
  );
}
