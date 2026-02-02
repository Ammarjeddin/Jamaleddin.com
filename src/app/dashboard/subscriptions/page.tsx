import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { getAllSubscriptions, getSubscriptionStats, formatSubscriptionAmount } from "@/lib/subscriptions";
import { ArrowLeft, RefreshCw, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { SubscriptionsTable } from "@/components/admin/SubscriptionsTable";

export const metadata = {
  title: "Subscriptions - Admin Dashboard",
  description: "View and manage subscriptions.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export default async function SubscriptionsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/subscriptions");
  }

  const subscriptions = getAllSubscriptions();
  const stats = getSubscriptionStats();

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
              <h1 className="text-xl font-semibold text-zinc-100">Subscriptions</h1>
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
                <div className="w-12 h-12 rounded-xl icon-container-purple flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-zinc-100">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-green flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Monthly Recurring</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {formatSubscriptionAmount(stats.mrr)}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-blue flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Annual Recurring</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {formatSubscriptionAmount(stats.arr)}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-orange flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Past Due</p>
                  <p className="text-2xl font-bold text-zinc-100">{stats.pastDueSubscriptions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="dashboard-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Subscription Status Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-2xl font-bold text-green-400">{stats.subscriptionsByStatus.active}</p>
                <p className="text-sm text-green-400/80">Active</p>
              </div>
              <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-400">{stats.subscriptionsByStatus.trialing}</p>
                <p className="text-sm text-blue-400/80">Trialing</p>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-400">{stats.subscriptionsByStatus.past_due}</p>
                <p className="text-sm text-yellow-400/80">Past Due</p>
              </div>
              <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-2xl font-bold text-red-400">{stats.subscriptionsByStatus.canceled}</p>
                <p className="text-sm text-red-400/80">Canceled</p>
              </div>
              <div className="text-center p-3 bg-zinc-500/10 border border-zinc-500/20 rounded-lg">
                <p className="text-2xl font-bold text-zinc-400">{stats.subscriptionsByStatus.paused}</p>
                <p className="text-sm text-zinc-500">Paused</p>
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          {subscriptions.length === 0 ? (
            <div className="dashboard-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">No subscriptions yet</h2>
              <p className="text-zinc-400">
                Subscriptions will appear here when customers subscribe to recurring products.
              </p>
            </div>
          ) : (
            <SubscriptionsTable subscriptions={subscriptions} />
          )}
        </Container>
      </main>
    </div>
  );
}
