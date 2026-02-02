import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { getAllOrders, getOrderStats, formatOrderPrice } from "@/lib/orders";
import { ArrowLeft, Package, DollarSign, TrendingUp, ShoppingBag } from "lucide-react";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = {
  title: "Orders - Admin Dashboard",
  description: "View and manage orders.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export default async function OrdersPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/orders");
  }

  const orders = getAllOrders();
  const stats = getOrderStats();

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
              <h1 className="text-xl font-semibold text-zinc-100">Orders</h1>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-blue flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Orders</p>
                  <p className="text-2xl font-bold text-zinc-100">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-green flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {formatOrderPrice(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-purple flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Last 30 Days</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {formatOrderPrice(stats.recentRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-orange flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {formatOrderPrice(stats.averageOrderValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          {orders.length === 0 ? (
            <div className="dashboard-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">No orders yet</h2>
              <p className="text-zinc-400">
                Orders will appear here when customers complete purchases.
              </p>
            </div>
          ) : (
            <OrdersTable orders={orders} />
          )}
        </Container>
      </main>
    </div>
  );
}
