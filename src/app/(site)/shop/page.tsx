import { getSiteSettings } from "@/lib/content";
import { getActiveProducts, getProductCategories } from "@/lib/products";
import { Container } from "@/components/ui/Container";
import { ShopPageClient } from "./ShopPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our products and services.",
};

export default async function ShopPage() {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const products = await getActiveProducts();
  const categories = await getProductCategories();

  const shopSettings = settings.template?.features?.shop;
  const currency = shopSettings?.currency || "USD";
  const gridColumns = shopSettings?.gridColumns || "3";

  return (
    <>
      {/* Hero */}
      <section className="-mt-20 pt-44 pb-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Browse our products and services
            </p>
          </div>
        </Container>
      </section>

      {/* Shop Content */}
      <section className="section glass">
        <Container>
          <ShopPageClient
            initialProducts={products}
            categories={categories}
            currency={currency}
            gridColumns={gridColumns}
          />
        </Container>
      </section>
    </>
  );
}
