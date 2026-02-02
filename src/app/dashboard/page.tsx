import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { getSiteSettings } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import {
  Settings,
  ShoppingBag,
  FileText,
  Image,
  Layout,
  Home,
  Receipt,
  RefreshCw,
  Plug,
  Rocket,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { DeployButton } from "@/components/admin/DeployButton";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your website content and settings.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Dashboard Card Component
function DashboardCard({
  href,
  icon: Icon,
  iconColor,
  title,
  subtitle,
  description,
  badge,
  badgeColor = "green",
  disabled = false,
  index = 0,
}: {
  href: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  badgeColor?: "green" | "gray";
  disabled?: boolean;
  index?: number;
}) {
  const iconContainerClass = `icon-container-${iconColor}`;
  const staggerClass = `stagger-${Math.min(index + 1, 6)}`;

  if (disabled) {
    return (
      <div
        className={`feature-disabled rounded-2xl p-6 opacity-60 animate-fade-in ${staggerClass}`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconContainerClass}`}>
            <Icon className="w-6 h-6 text-zinc-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-zinc-500">{title}</h4>
              <span className="status-disabled">{badge || "Disabled"}</span>
            </div>
            <p className="text-sm text-zinc-600">{subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 mt-4 leading-relaxed">{description}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`dashboard-card group rounded-2xl p-6 block transition-all duration-300 animate-fade-in ${staggerClass}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconContainerClass}`}>
          <Icon className={`w-6 h-6 text-${iconColor}-400`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors">{title}</h4>
            {badge && (
              <span className={badgeColor === "green" ? "status-enabled" : "status-disabled"}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400">{subtitle}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-[var(--color-accent)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="text-sm text-zinc-500 mt-4 leading-relaxed group-hover:text-zinc-400 transition-colors">{description}</p>
    </Link>
  );
}

// Section Title Component
function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[var(--color-accent)]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">{children}</h3>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data } = await getSiteSettings();
  const settings = data.siteSettings;

  const shopEnabled = settings.template?.features?.shop?.enabled === true;
  const programsEnabled = settings.template?.features?.programs?.enabled !== false;
  const eventsEnabled = settings.template?.features?.events?.enabled !== false;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <DashboardHeader username={user.username} />

      <main className="py-10">
        <Container>
          {/* Welcome Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-elevated)] to-[var(--color-surface)] border border-[var(--color-border)] p-8 mb-10 animate-fade-in">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-accent)]/3 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <span className="text-sm font-medium text-[var(--color-accent)]">Dashboard</span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2 tracking-tight">
                Welcome back to {settings.siteName}
              </h2>
              <p className="text-zinc-400 max-w-2xl">
                Manage your website content, configure settings, and monitor your business from this central hub.
                {user.role === "admin" && (
                  <span className="text-[var(--color-accent)]"> You have full admin access.</span>
                )}
              </p>
            </div>
          </div>

          {/* Content Management Section */}
          <section className="mb-12">
            <SectionTitle icon={FileText}>Content Management</SectionTitle>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <DashboardCard
                href="/dashboard/edit?collection=home&slug=index"
                icon={Home}
                iconColor="indigo"
                title="Homepage"
                subtitle="Edit homepage content"
                description="Update hero banner, featured sections, and homepage blocks."
                index={0}
              />
              <DashboardCard
                href="/dashboard/pages"
                icon={FileText}
                iconColor="blue"
                title="Pages"
                subtitle="Edit page content"
                description="Manage your website pages, add new content blocks, and update page information."
                index={1}
              />
              <DashboardCard
                href="/dashboard/edit?collection=settings&slug=site"
                icon={Settings}
                iconColor="purple"
                title="Site Settings"
                subtitle="Branding & configuration"
                description="Update site name, logo, colors, social links, and contact information."
                index={2}
              />
              <DashboardCard
                href="/dashboard/media"
                icon={Image}
                iconColor="green"
                title="Media Library"
                subtitle="Images & files"
                description="Upload and manage images, documents, and other media files."
                index={3}
              />
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12">
            <SectionTitle icon={Layout}>Features</SectionTitle>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <DashboardCard
                href="/dashboard/products"
                icon={ShoppingBag}
                iconColor="orange"
                title="Products"
                subtitle="Manage inventory"
                description="Manage products, pricing, and inventory."
                badge={shopEnabled ? "Enabled" : "Disabled"}
                badgeColor={shopEnabled ? "green" : "gray"}
                disabled={!shopEnabled}
                index={0}
              />
              <DashboardCard
                href="/dashboard/orders"
                icon={Receipt}
                iconColor="emerald"
                title="Orders"
                subtitle="View purchases"
                description="View customer orders, export data, and track sales."
                badge={shopEnabled ? "Enabled" : "Disabled"}
                badgeColor={shopEnabled ? "green" : "gray"}
                disabled={!shopEnabled}
                index={1}
              />
              <DashboardCard
                href="/dashboard/subscriptions"
                icon={RefreshCw}
                iconColor="purple"
                title="Subscriptions"
                subtitle="Recurring revenue"
                description="View active subscriptions, MRR, and manage recurring billing."
                badge={shopEnabled ? "Enabled" : "Disabled"}
                badgeColor={shopEnabled ? "green" : "gray"}
                disabled={!shopEnabled}
                index={2}
              />
              <DashboardCard
                href="/dashboard/programs"
                icon={Layout}
                iconColor="teal"
                title="Programs"
                subtitle="Services & offerings"
                description="Manage your programs and services."
                badge={programsEnabled ? "Enabled" : "Disabled"}
                badgeColor={programsEnabled ? "green" : "gray"}
                disabled={!programsEnabled}
                index={3}
              />
              <DashboardCard
                href="/events"
                icon={Calendar}
                iconColor="pink"
                title="Events"
                subtitle="Calendar & activities"
                description="View and manage your events calendar."
                badge={eventsEnabled ? "Enabled" : "Disabled"}
                badgeColor={eventsEnabled ? "green" : "gray"}
                disabled={!eventsEnabled}
                index={4}
              />
            </div>
          </section>

          {/* Admin Section */}
          {user.role === "admin" && (
            <>
              {/* Deployment Section */}
              <section className="mb-12">
                <SectionTitle icon={Rocket}>Deployment</SectionTitle>
                <div className="dashboard-card rounded-2xl p-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="icon-container-emerald w-14 h-14 rounded-xl flex items-center justify-center">
                        <Rocket className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-100 text-lg">Deploy to Live</h4>
                        <p className="text-sm text-zinc-400 mt-1">
                          Push all saved content changes to the live website
                        </p>
                      </div>
                    </div>
                    <DeployButton />
                  </div>
                </div>
              </section>

              {/* Settings Section */}
              <section className="mb-12">
                <SectionTitle icon={Settings}>Settings</SectionTitle>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <DashboardCard
                    href="/dashboard/integrations"
                    icon={Plug}
                    iconColor="indigo"
                    title="Integrations"
                    subtitle="API keys & services"
                    description="View Stripe, authentication, and other integration status."
                    index={0}
                  />
                </div>
              </section>
            </>
          )}
        </Container>
      </main>
    </div>
  );
}
