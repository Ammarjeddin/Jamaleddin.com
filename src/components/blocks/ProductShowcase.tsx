import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { getProduct } from "@/lib/products";
import { formatPrice, getDiscountPercentage } from "@/lib/types/product";

interface ProductShowcaseProps {
  heading?: string;
  productSlug?: string;
  layout?: "left" | "right";
  backgroundColor?: "white" | "gray" | "primary";
}

export async function ProductShowcase({
  heading,
  productSlug,
  layout = "left",
  backgroundColor = "white",
}: ProductShowcaseProps) {
  const product = productSlug ? await getProduct(productSlug) : null;

  const bgClass = {
    white: "bg-white",
    gray: "bg-gray-50",
    primary: "bg-[var(--color-primary)] text-white",
  }[backgroundColor];

  const textColorClass = backgroundColor === "primary" ? "text-white" : "text-gray-900";
  const mutedTextClass = backgroundColor === "primary" ? "text-white/80" : "text-gray-600";

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
        className="object-cover rounded-2xl"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {discount && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          Save {discount}%
        </span>
      )}
    </div>
  );

  const ContentSection = (
    <div className="space-y-6">
      {heading && (
        <p className={`text-sm font-medium uppercase tracking-wider ${mutedTextClass}`}>
          {heading}
        </p>
      )}

      <Link href={`/shop/${product.slug}`}>
        <h2 className={`text-3xl md:text-4xl font-bold ${textColorClass} hover:opacity-80 transition-opacity`}>
          {product.name}
        </h2>
      </Link>

      {product.description && (
        <p className={`text-lg ${mutedTextClass}`}>{product.description}</p>
      )}

      <div className="flex items-baseline gap-3">
        <span className={`text-3xl font-bold ${textColorClass}`}>
          {formatPrice(product.pricing.price)}
        </span>
        {product.pricing.compareAtPrice && (
          <span className={`text-xl line-through ${mutedTextClass}`}>
            {formatPrice(product.pricing.compareAtPrice)}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <AddToCartButton product={product} variant="default" />
        <Link
          href={`/shop/${product.slug}`}
          className={`px-6 py-3 rounded-lg font-medium border text-center transition-colors ${
            backgroundColor === "primary"
              ? "border-white/30 text-white hover:bg-white/10"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          View Details
        </Link>
      </div>
    </div>
  );

  return (
    <section className={`section ${bgClass}`}>
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {layout === "left" ? (
            <>
              {ImageSection}
              {ContentSection}
            </>
          ) : (
            <>
              {ContentSection}
              {ImageSection}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
