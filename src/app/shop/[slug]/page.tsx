import { getSiteSettings } from "@/lib/tina";
import { getProduct, getProductSlugs } from "@/lib/products";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { defaultNavigation } from "@/lib/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.description,
    openGraph: {
      title: product.seo?.metaTitle || product.name,
      description: product.seo?.metaDescription || product.description,
      images: product.seo?.ogImage
        ? [product.seo.ogImage]
        : product.images?.[0]?.src
        ? [product.images[0].src]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const currency = settings.template?.features?.shop?.currency || "USD";

  return (
    <PageLayout settings={settings} navigation={defaultNavigation}>
      <section className="section">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Shop
            </Link>
          </nav>

          {/* Product Detail */}
          <ProductDetail product={product} currency={currency} />

          {/* Long Description */}
          {product.longDescription ? (
            <div className="mt-12 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Product Details</h2>
              <div className="prose prose-lg max-w-none">
                {/* Rich text would be rendered here */}
                <p className="text-gray-600">
                  Additional product details and specifications would appear here.
                </p>
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </PageLayout>
  );
}
