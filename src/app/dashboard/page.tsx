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
  Palette,
  Home,
  Upload,
} from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <DashboardHeader username={user.username} />

      <main className="py-8">
        <Container>
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to {settings.siteName} Admin
            </h2>
            <p className="text-gray-600">
              Manage your website content, settings, and features from here.
              {user.role === "admin" && " You have full admin access."}
            </p>
          </div>

          {/* Quick Actions Grid */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Management</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Homepage */}
            <Link
              href="/dashboard/edit?collection=home&slug=index"
              className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Home className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Homepage</h4>
                  <p className="text-sm text-gray-500">Edit homepage content</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Update hero banner, featured sections, and homepage blocks.
              </p>
            </Link>

            {/* Pages */}
            <Link
              href="/dashboard/pages"
              className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 hover:shadow-md transition-shadow group"
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
            </Link>

            {/* Site Settings */}
            <Link
              href="/dashboard/edit?collection=settings&slug=site"
              className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 hover:shadow-md transition-shadow group"
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
            </Link>

            {/* Media Library */}
            <Link
              href="/dashboard/media"
              className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 hover:shadow-md transition-shadow group"
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
            </Link>
          </div>

          {/* Features Section */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Shop Admin */}
            {shopEnabled ? (
              <Link
                href="/dashboard/products"
                className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Products</h4>
                    <p className="text-sm text-green-600">Shop Enabled</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Manage products, pricing, and inventory.
                </p>
              </Link>
            ) : (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-300 p-6 dark:shadow-slate-700/20">
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
            {programsEnabled ? (
              <Link
                href="/dashboard/programs"
                className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <Layout className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Programs</h4>
                    <p className="text-sm text-green-600">Enabled</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Manage your programs and services.
                </p>
              </Link>
            ) : (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-300 p-6 dark:shadow-slate-700/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Layout className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-500">Programs</h4>
                    <p className="text-sm text-gray-400">Disabled</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Enable programs in Site Settings to showcase your offerings.
                </p>
              </div>
            )}

            {/* Events */}
            {eventsEnabled ? (
              <Link
                href="/events"
                className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <Palette className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Events</h4>
                    <p className="text-sm text-green-600">Enabled</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  View and manage your events calendar.
                </p>
              </Link>
            ) : (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-300 p-6 dark:shadow-slate-700/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-500">Events</h4>
                    <p className="text-sm text-gray-400">Disabled</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Enable events in Site Settings to promote activities.
                </p>
              </div>
            )}
          </div>

          {/* Publish Section (Admin only) */}
          {user.role === "admin" && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Publishing</h3>
              <div className="bg-white rounded-xl shadow-sm dark:shadow-slate-700/20 p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Publish Changes</h4>
                      <p className="text-sm text-gray-500">
                        Push your content changes to the live site
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/publish"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Review & Publish
                  </Link>
                </div>
              </div>
            </>
          )}
        </Container>
      </main>
    </div>
  );
}
