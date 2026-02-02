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
  Info,
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
              <h1 className="text-xl font-semibold text-zinc-100">Integrations</h1>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Info Banner */}
          <div className="dashboard-card rounded-xl p-4 mb-8 border-l-4 border-l-[var(--color-accent)]">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-zinc-100">API Keys & Environment Variables</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  API keys are stored securely as environment variables and cannot be viewed or edited from this dashboard.
                  To update keys, modify your <code className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] px-1.5 py-0.5 rounded text-xs">.env.local</code> file or update
                  environment variables in your hosting provider.
                </p>
              </div>
            </div>
          </div>

          {/* Stripe Integration */}
          <div className="dashboard-card rounded-2xl overflow-hidden mb-6">
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl icon-container-purple flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">Stripe</h2>
                    <p className="text-sm text-zinc-500">Payment processing for one-time and subscription billing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.stripe.configured ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Connected</span>
                      {status.stripe.isTestMode && (
                        <span className="ml-2 px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded border border-yellow-500/20">
                          Test Mode
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Not Configured</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Configuration Status</h3>

              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-[var(--color-surface-elevated)] rounded-lg">
                  <div className="flex items-center gap-3">
                    {status.stripe.hasSecretKey ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm text-zinc-300">STRIPE_SECRET_KEY</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {status.stripe.hasSecretKey ? "Configured" : "Missing"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--color-surface-elevated)] rounded-lg">
                  <div className="flex items-center gap-3">
                    {status.stripe.hasPublishableKey ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm text-zinc-300">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {status.stripe.hasPublishableKey ? "Configured" : "Missing"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--color-surface-elevated)] rounded-lg">
                  <div className="flex items-center gap-3">
                    {status.stripe.hasWebhookSecret ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-sm text-zinc-300">STRIPE_WEBHOOK_SECRET</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {status.stripe.hasWebhookSecret ? "Configured" : "Optional (for webhooks)"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]">
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Setup Instructions</h4>
                <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                  <li>Create a Stripe account at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">stripe.com</a></li>
                  <li>Get your API keys from the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">Stripe Dashboard</a></li>
                  <li>Add keys to your <code className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] px-1.5 py-0.5 rounded text-xs">.env.local</code> file</li>
                  <li>Set up webhooks pointing to <code className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] px-1.5 py-0.5 rounded text-xs">/api/webhooks/stripe</code></li>
                </ol>

                <div className="mt-4">
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn btn-primary text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Stripe Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div className="dashboard-card rounded-2xl overflow-hidden mb-6">
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl icon-container-blue flex items-center justify-center">
                    <Key className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-100">Authentication</h2>
                    <p className="text-sm text-zinc-500">JWT-based admin authentication</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.auth.configured && !status.auth.hasDefaultSecret ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Secure</span>
                    </>
                  ) : status.auth.hasDefaultSecret ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Using Default Secret</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Not Configured</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between p-3 bg-[var(--color-surface-elevated)] rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  {status.auth.configured ? (
                    status.auth.hasDefaultSecret ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm text-zinc-300">JWT_SECRET</span>
                </div>
                <span className="text-xs text-zinc-500">
                  {status.auth.hasDefaultSecret
                    ? "Using default (change for production!)"
                    : status.auth.configured
                    ? "Configured"
                    : "Missing"}
                </span>
              </div>

              {status.auth.hasDefaultSecret && (
                <div className="rounded-lg p-4 bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-400">Security Warning</h4>
                      <p className="text-sm text-yellow-300/80 mt-1">
                        You are using the default JWT secret. This is fine for development, but you must
                        set a unique, secure secret for production. Generate one with:
                      </p>
                      <code className="block mt-2 p-2 bg-yellow-500/10 rounded text-xs text-yellow-200 font-mono">
                        openssl rand -base64 32
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subscriptions Info */}
          <div className="dashboard-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-green flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">Subscription Billing</h2>
                  <p className="text-sm text-zinc-500">Recurring payments powered by Stripe Billing</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-zinc-400 mb-4">
                Subscription billing is automatically enabled when Stripe is configured. Features include:
              </p>
              <ul className="text-sm text-zinc-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Monthly and yearly billing intervals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Custom interval counts (e.g., every 3 months)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Free trial periods
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Stripe Customer Portal for self-service management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Webhook handling for subscription lifecycle events
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <p className="text-sm text-zinc-400">
                  <strong className="text-zinc-300">Customer Portal:</strong> Customers can manage their subscriptions at{" "}
                  <code className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] px-1.5 py-0.5 rounded text-xs">/api/subscriptions/portal</code>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
