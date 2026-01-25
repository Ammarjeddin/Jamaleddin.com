import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, ShoppingBag, Plus, Edit } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Container>
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            </div>
            <Link
              href="/dashboard/products/new"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Product
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first product to start selling.
              </p>
              <Link
                href="/dashboard/products/new"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Product
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {products.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/dashboard/edit?collection=products&slug=${product.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <ShoppingBag className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.price !== undefined && (
                            <span className="text-sm text-gray-600">{formatPrice(product.price)}</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            product.status === "active"
                              ? "bg-green-100 text-green-700"
                              : product.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {product.status || "active"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
