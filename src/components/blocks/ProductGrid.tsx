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
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container>
        {(heading || subheading) && (
          <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-3 sm:mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        {products.length > 0 ? (
          <div className={`grid ${gridColsClass} gap-4 sm:gap-6 px-4 sm:px-0`}>
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--color-text-muted)] py-8 sm:py-12 px-4 sm:px-0">
            No products found.
          </p>
        )}
      </Container>
    </section>
  );
}
