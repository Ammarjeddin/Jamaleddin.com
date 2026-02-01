import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Key,
  RefreshCw,
} from "lucide-react";

export const metadata = {
  title: "Integrations - Admin Dashboard",
  description: "View and manage integrations and API configurations.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Check if environment variables are configured
function getIntegrationStatus() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const jwtSecret = process.env.JWT_SECRET;

  return {
    stripe: {
      configured: !!(stripeSecretKey && stripePublishableKey),
      hasSecretKey: !!stripeSecretKey,
      hasPublishableKey: !!stripePublishableKey,
      hasWebhookSecret: !!stripeWebhookSecret,
      isTestMode: stripeSecretKey?.startsWith("sk_test_") || stripePublishableKey?.startsWith("pk_test_"),
    },
    auth: {
      configured: !!jwtSecret,
      hasDefaultSecret: jwtSecret === "dev-secret-change-in-production",
    },
  };
}

export default async function IntegrationsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/integrations");
  }

  // Only admins can view integrations
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const status = getIntegrationStatus();

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
              <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">API Keys & Environment Variables</h3>
                <p className="text-sm text-blue-700 mt-1">
                  API keys are stored securely as environment variables and cannot be viewed or edited from this dashboard.
                  To update keys, modify your <code className="bg-blue-100 px-1 rounded">.env.local</code> file or update
                  environment variables in your hosting provider (Vercel, etc.).
                </p>
              </div>
            </div>
          </div>

          {/* Stripe Integration */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Stripe</h2>
                    <p className="text-sm text-gray-500">Payment processing for one-time and subscription billing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.stripe.configured ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Connected</span>
                      {status.stripe.isTestMode && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          Test Mode
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-red-700">Not Configured</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Configuration Status</h3>

              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {status.stripe.hasSecretKey ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">STRIPE_SECRET_KEY</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {status.stripe.hasSecretKey ? "Configured" : "Missing"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {status.stripe.hasPublishableKey ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {status.stripe.hasPublishableKey ? "Configured" : "Missing"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {status.stripe.hasWebhookSecret ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-gray-700">STRIPE_WEBHOOK_SECRET</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {status.stripe.hasWebhookSecret ? "Configured" : "Optional (for webhooks)"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Setup Instructions</h4>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Create a Stripe account at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe.com</a></li>
                  <li>Get your API keys from the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a></li>
                  <li>Add keys to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file</li>
                  <li>Set up webhooks pointing to <code className="bg-gray-100 px-1 rounded">/api/webhooks/stripe</code></li>
                </ol>

                <div className="mt-4 flex gap-3">
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Stripe Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Key className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Authentication</h2>
                    <p className="text-sm text-gray-500">JWT-based admin authentication</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.auth.configured && !status.auth.hasDefaultSecret ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Secure</span>
                    </>
                  ) : status.auth.hasDefaultSecret ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">Using Default Secret</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-red-700">Not Configured</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  {status.auth.configured ? (
                    status.auth.hasDefaultSecret ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700">JWT_SECRET</span>
                </div>
                <span className="text-xs text-gray-500">
                  {status.auth.hasDefaultSecret
                    ? "Using default (change for production!)"
                    : status.auth.configured
                    ? "Configured"
                    : "Missing"}
                </span>
              </div>

              {status.auth.hasDefaultSecret && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Security Warning</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        You are using the default JWT secret. This is fine for development, but you must
                        set a unique, secure secret for production. Generate one with:
                      </p>
                      <code className="block mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-900">
                        openssl rand -base64 32
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subscriptions Info */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Subscription Billing</h2>
                  <p className="text-sm text-gray-500">Recurring payments powered by Stripe Billing</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Subscription billing is automatically enabled when Stripe is configured. Features include:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Monthly and yearly billing intervals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Custom interval counts (e.g., every 3 months)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free trial periods
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Stripe Customer Portal for self-service management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Webhook handling for subscription lifecycle events
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Customer Portal:</strong> Customers can manage their subscriptions at{" "}
                  <code className="bg-gray-100 px-1 rounded">/api/subscriptions/portal</code>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
