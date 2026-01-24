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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Container>
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Site
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-2xl font-bold text-gray-900">Shop Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                TinaCMS Admin
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {activeProducts} active
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(totalInventoryValue)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Based on current stock
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lowStockProducts.length}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {outOfStockProducts.length} out of stock
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">—</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                View in Stripe Dashboard
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Products Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                  <Link
                    href="/admin"
                    className="text-sm text-primary hover:underline"
                  >
                    Manage in TinaCMS
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.slug} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              product.status === "active"
                                ? "bg-green-100 text-green-800"
                                : product.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {formatPrice(product.pricing.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.inventory?.trackInventory ? (
                            <span
                              className={`text-sm ${
                                (product.inventory.quantity ?? 0) === 0
                                  ? "text-red-600 font-medium"
                                  : (product.inventory.quantity ?? 0) <= 5
                                  ? "text-yellow-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {product.inventory.quantity ?? 0}
                            </span>
                          ) : (
                            <span className="text-gray-400">∞</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Manage Products in TinaCMS</span>
                  </Link>
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <span>View Stripe Dashboard</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                </div>
              </div>

              {/* Low Stock Alert */}
              {lowStockProducts.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Low Stock Alert
                  </h2>
                  <ul className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <li key={product.slug} className="text-sm text-yellow-700">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-yellow-600">
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
                <div className="bg-red-50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Out of Stock
                  </h2>
                  <ul className="space-y-2">
                    {outOfStockProducts.map((product) => (
                      <li key={product.slug} className="text-sm text-red-700">
                        {product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">About This Dashboard</h3>
                <p className="text-sm text-blue-700">
                  This dashboard provides a quick overview of your shop inventory.
                  For full product management, use TinaCMS. For order management
                  and payments, use the Stripe Dashboard.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
