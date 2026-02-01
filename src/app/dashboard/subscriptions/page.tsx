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
              <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatSubscriptionAmount(stats.mrr)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual Recurring Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatSubscriptionAmount(stats.arr)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Past Due</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pastDueSubscriptions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{stats.subscriptionsByStatus.active}</p>
                <p className="text-sm text-green-600">Active</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{stats.subscriptionsByStatus.trialing}</p>
                <p className="text-sm text-blue-600">Trialing</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{stats.subscriptionsByStatus.past_due}</p>
                <p className="text-sm text-yellow-600">Past Due</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{stats.subscriptionsByStatus.canceled}</p>
                <p className="text-sm text-red-600">Canceled</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-700">{stats.subscriptionsByStatus.paused}</p>
                <p className="text-sm text-gray-600">Paused</p>
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          {subscriptions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No subscriptions yet</h2>
              <p className="text-gray-600">
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
