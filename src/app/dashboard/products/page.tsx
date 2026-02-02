import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, ShoppingBag, Plus, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Products - Admin Dashboard",
  description: "Manage your products.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

interface ProductItem {
  slug: string;
  name: string;
  price?: number;
  status?: string;
}

function getProducts(): ProductItem[] {
  const productsDir = path.join(process.cwd(), "content/products");

  if (!fs.existsSync(productsDir)) {
    return [];
  }

  const files = fs.readdirSync(productsDir).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const slug = file.replace(".json", "");
    const filePath = path.join(productsDir, file);

    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return {
        slug,
        name: content.name || slug,
        price: content.pricing?.price,
        status: content.status || "active",
      };
    } catch {
      return { slug, name: slug };
    }
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function ProductsListPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/products");
  }

  const products = getProducts();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
        <Container>
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-5 w-px bg-[var(--color-border)]" />
              <h1 className="text-xl font-semibold text-zinc-100">Products</h1>
            </div>
            <Link
              href="/dashboard/products/new"
              className="flex items-center gap-2 btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              New Product
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {products.length === 0 ? (
            <div className="dashboard-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">No products yet</h2>
              <p className="text-zinc-400 mb-6">
                Create your first product to start selling.
              </p>
              <Link
                href="/dashboard/products/new"
                className="inline-flex items-center gap-2 btn btn-primary"
              >
                <Plus className="w-5 h-5" />
                Create Product
              </Link>
            </div>
          ) : (
            <div className="dashboard-card rounded-2xl overflow-hidden">
              <div className="divide-y divide-[var(--color-border)]">
                {products.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/dashboard/edit?collection=products&slug=${product.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-[var(--color-surface-elevated)] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl icon-container-orange flex items-center justify-center transition-transform group-hover:scale-105">
                        <ShoppingBag className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.price !== undefined && (
                            <span className="text-sm text-zinc-400">{formatPrice(product.price)}</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            product.status === "active"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : product.status === "draft"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                          }`}>
                            {product.status || "active"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
