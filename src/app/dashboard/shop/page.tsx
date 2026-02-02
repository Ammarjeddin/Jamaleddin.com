import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getAllProducts } from "@/lib/products";
import { formatPrice, isInStock } from "@/lib/types/product";
import {
  Package,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Settings,
  ArrowLeft,
  ExternalLink,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Shop Admin Dashboard",
  description: "Manage your shop, view orders, and track inventory.",
};

export default async function ShopAdminPage() {
  const products = await getAllProducts();

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter((p) => {
    if (!p.inventory?.trackInventory) return false;
    return (p.inventory.quantity ?? 0) <= 5 && (p.inventory.quantity ?? 0) > 0;
  });
  const outOfStockProducts = products.filter((p) => !isInStock(p));

  const totalInventoryValue = products.reduce((sum, p) => {
    if (!p.inventory?.trackInventory) return sum;
    return sum + p.pricing.price * (p.inventory.quantity ?? 0);
  }, 0);

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
              <h1 className="text-xl font-semibold text-zinc-100">Shop Dashboard</h1>
            </div>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Stripe Dashboard
            </a>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-blue flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Products</p>
                  <p className="text-2xl font-bold text-zinc-100">{totalProducts}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                {activeProducts} active
              </p>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-green flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Inventory Value</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {formatPrice(totalInventoryValue)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                Based on current stock
              </p>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-orange flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Low Stock</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {lowStockProducts.length}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                {outOfStockProducts.length} out of stock
              </p>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-purple flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Orders</p>
                  <p className="text-2xl font-bold text-zinc-100">—</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                View in Stripe Dashboard
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Products Table */}
            <div className="lg:col-span-2 dashboard-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-100">Products</h2>
                  <Link
                    href="/dashboard/products"
                    className="text-sm text-[var(--color-accent)] hover:underline"
                  >
                    Manage Products
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-surface-elevated)]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {products.map((product) => (
                      <tr key={product.slug} className="hover:bg-[var(--color-surface-elevated)] transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-zinc-100">{product.name}</p>
                            <p className="text-sm text-zinc-500">{product.category}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              product.status === "active"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : product.status === "draft"
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                            }`}
                          >
                            {product.status || "active"}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-zinc-100">
                          {formatPrice(product.pricing.price)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {product.inventory?.trackInventory ? (
                            <span
                              className={`text-sm ${
                                (product.inventory.quantity ?? 0) === 0
                                  ? "text-red-400 font-medium"
                                  : (product.inventory.quantity ?? 0) <= 5
                                  ? "text-yellow-400"
                                  : "text-zinc-100"
                              }`}
                            >
                              {product.inventory.quantity ?? 0}
                            </span>
                          ) : (
                            <span className="text-zinc-500">∞</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="dashboard-card rounded-xl p-5">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/products"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors text-zinc-300 hover:text-zinc-100"
                  >
                    <Settings className="w-5 h-5 text-zinc-500" />
                    <span>Manage Products</span>
                  </Link>
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors text-zinc-300 hover:text-zinc-100"
                  >
                    <DollarSign className="w-5 h-5 text-zinc-500" />
                    <span>View Stripe Dashboard</span>
                    <ExternalLink className="w-4 h-4 text-zinc-600 ml-auto" />
                  </a>
                </div>
              </div>

              {/* Low Stock Alert */}
              {lowStockProducts.length > 0 && (
                <div className="rounded-xl p-5 bg-yellow-500/10 border border-yellow-500/20">
                  <h2 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Low Stock Alert
                  </h2>
                  <ul className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <li key={product.slug} className="text-sm text-yellow-300">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-yellow-400/70">
                          {" "}
                          — {product.inventory?.quantity} left
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Out of Stock */}
              {outOfStockProducts.length > 0 && (
                <div className="rounded-xl p-5 bg-red-500/10 border border-red-500/20">
                  <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Out of Stock
                  </h2>
                  <ul className="space-y-2">
                    {outOfStockProducts.map((product) => (
                      <li key={product.slug} className="text-sm text-red-300">
                        {product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Info Box */}
              <div className="dashboard-card rounded-xl p-5 border-l-4 border-l-[var(--color-accent)]">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-zinc-100 mb-1">About This Dashboard</h3>
                    <p className="text-sm text-zinc-400">
                      This dashboard provides a quick overview of your shop inventory.
                      For order management and payments, use the Stripe Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
