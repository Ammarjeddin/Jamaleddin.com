import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { getProduct } from "@/lib/products";
import { formatPrice, getDiscountPercentage } from "@/lib/types/product";

interface ProductShowcaseProps {
  heading?: string;
  productSlug?: string;
  layout?: "left" | "right";
  backgroundColor?: "white" | "gray" | "primary";
  isFirstBlock?: boolean;
}

export async function ProductShowcase({
  heading,
  productSlug,
  layout = "left",
  backgroundColor = "white",
  isFirstBlock = false,
}: ProductShowcaseProps) {
  const product = productSlug ? await getProduct(productSlug) : null;

  const bgClass = {
    white: "",
    gray: "",
    primary: "bg-[var(--color-primary)] text-white",
  }[backgroundColor];

  const textColorClass = backgroundColor === "primary" ? "text-white" : "text-[var(--color-text)] ";
  const mutedTextClass = backgroundColor === "primary" ? "text-white/80" : "text-[var(--color-text-muted)] dark:text-gray-300";

  if (!product) {
    return null;
  }

  const discount = getDiscountPercentage(product);
  const imageUrl = product.images?.[0]?.src || "/images/placeholder-product.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;

  const ImageSection = (
    <div className="relative aspect-square">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover rounded-xl sm:rounded-2xl"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {discount && (
        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1 rounded-full">
          Save {discount}%
        </span>
      )}
    </div>
  );

  const ContentSection = (
    <div className="space-y-4 sm:space-y-6">
      {heading && (
        <p className={`text-xs sm:text-sm font-medium uppercase tracking-wider ${mutedTextClass}`}>
          {heading}
        </p>
      )}

      <Link href={`/services/${product.slug}`} className="block min-h-[44px] flex items-center">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColorClass} hover:opacity-80 active:opacity-70 transition-opacity`}>
          {product.name}
        </h2>
      </Link>

      {product.description && (
        <p className={`text-base sm:text-lg ${mutedTextClass}`}>{product.description}</p>
      )}

      <div className="flex items-baseline gap-2 sm:gap-3">
        <span className={`text-2xl sm:text-3xl font-bold ${textColorClass}`}>
          {formatPrice(product.pricing.price)}
        </span>
        {product.pricing.compareAtPrice && (
          <span className={`text-lg sm:text-xl line-through ${mutedTextClass}`}>
            {formatPrice(product.pricing.compareAtPrice)}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <AddToCartButton product={product} variant="default" />
        <Link
          href={`/services/${product.slug}`}
          className={`px-5 sm:px-6 py-3 rounded-lg font-medium border text-center transition-colors min-h-[44px] flex items-center justify-center active:scale-[0.98] ${
            backgroundColor === "primary"
              ? "border-white/30 text-white hover:bg-white/10"
              : "border-gray-300 dark:border-slate-600 text-[var(--color-text)] hover:bg-gray-50 dark:hover:bg-slate-700"
          }`}
        >
          View Details
        </Link>
      </div>
    </div>
  );

  return (
    <section className={cn("section", bgClass, isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center px-4 sm:px-0">
          {layout === "left" ? (
            <>
              {ImageSection}
              {ContentSection}
            </>
          ) : (
            <>
              <div className="order-2 md:order-1">{ContentSection}</div>
              <div className="order-1 md:order-2">{ImageSection}</div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
