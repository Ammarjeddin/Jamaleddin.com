import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/tina";
import {
  Settings,
  ShoppingBag,
  FileText,
  Image,
  ArrowLeft,
  ExternalLink,
  Layout,
  Palette,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your website content and settings.",
};

export default async function DashboardPage() {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;

  const shopEnabled = settings.template?.features?.shop?.enabled === true;
  const programsEnabled = settings.template?.features?.programs?.enabled !== false;
  const eventsEnabled = settings.template?.features?.events?.enabled !== false;

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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to {settings.siteName} Admin
            </h2>
            <p className="text-gray-600">
              Manage your website content, settings, and features from here.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Management</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* TinaCMS - Pages */}
            <a
              href="/admin/index.html#/collections/pages"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pages</h4>
                  <p className="text-sm text-gray-500">Edit page content</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Manage your website pages, add new content blocks, and update page information.
              </p>
            </a>

            {/* TinaCMS - Site Settings */}
            <a
              href="/admin/index.html#/collections/siteSettings"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Site Settings</h4>
                  <p className="text-sm text-gray-500">Branding & configuration</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Update site name, logo, colors, social links, and contact information.
              </p>
            </a>

            {/* TinaCMS - Media */}
            <a
              href="/admin/index.html#/media"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Image className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Media Library</h4>
                  <p className="text-sm text-gray-500">Images & files</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Upload and manage images, documents, and other media files.
              </p>
            </a>
          </div>

          {/* Features Section */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Shop Admin - Only show if enabled */}
            {shopEnabled ? (
              <Link
                href="/dashboard/shop"
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Shop</h4>
                    <p className="text-sm text-green-600">Enabled</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  View inventory, manage products, and track orders.
                </p>
              </Link>
            ) : (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-500">Shop</h4>
                    <p className="text-sm text-gray-400">Disabled</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Enable the shop feature in Site Settings to sell products.
                </p>
              </div>
            )}

            {/* Programs */}
            <div className={`rounded-xl p-6 ${programsEnabled ? 'bg-white shadow-sm' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${programsEnabled ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  <Layout className={`w-6 h-6 ${programsEnabled ? 'text-teal-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${programsEnabled ? 'text-gray-900' : 'text-gray-500'}`}>Programs</h4>
                  <p className={`text-sm ${programsEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                    {programsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${programsEnabled ? 'text-gray-600' : 'text-gray-500'}`}>
                {programsEnabled
                  ? 'Manage programs via TinaCMS content editor.'
                  : 'Enable programs in Site Settings to showcase your offerings.'}
              </p>
            </div>

            {/* Events */}
            <div className={`rounded-xl p-6 ${eventsEnabled ? 'bg-white shadow-sm' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${eventsEnabled ? 'bg-pink-100' : 'bg-gray-100'}`}>
                  <Palette className={`w-6 h-6 ${eventsEnabled ? 'text-pink-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${eventsEnabled ? 'text-gray-900' : 'text-gray-500'}`}>Events</h4>
                  <p className={`text-sm ${eventsEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                    {eventsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${eventsEnabled ? 'text-gray-600' : 'text-gray-500'}`}>
                {eventsEnabled
                  ? 'Events feature is active on your site.'
                  : 'Enable events in Site Settings to promote activities.'}
              </p>
            </div>
          </div>

          {/* External Links */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">External Tools</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/admin/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">TinaCMS</h4>
                    <p className="text-sm text-gray-500">Full admin panel</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                Open the full TinaCMS admin interface for advanced editing.
              </p>
            </a>

            {shopEnabled && (
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                      <ShoppingBag className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Stripe</h4>
                      <p className="text-sm text-gray-500">Payments & orders</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  View payments, manage orders, and access Stripe dashboard.
                </p>
              </a>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
