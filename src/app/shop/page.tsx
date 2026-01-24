import { getSiteSettings } from "@/lib/tina";
import { getActiveProducts, getProductCategories } from "@/lib/products";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { defaultNavigation } from "@/lib/navigation";
import { ShopPageClient } from "./ShopPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our products and support our mission.",
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
    <PageLayout settings={settings} navigation={defaultNavigation}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Support our mission with every purchase
            </p>
          </div>
        </Container>
      </section>

      {/* Shop Content */}
      <section className="section">
        <Container>
          <ShopPageClient
            initialProducts={products}
            categories={categories}
            currency={currency}
            gridColumns={gridColumns}
          />
        </Container>
      </section>
    </PageLayout>
  );
}
