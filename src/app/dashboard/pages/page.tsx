import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, FileText, Plus, Edit } from "lucide-react";

export const metadata = {
  title: "Pages - Admin Dashboard",
  description: "Manage your website pages.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

interface PageItem {
  slug: string;
  title: string;
  description?: string;
}

function getPages(): PageItem[] {
  const pagesDir = path.join(process.cwd(), "content/pages");

  if (!fs.existsSync(pagesDir)) {
    return [];
  }

  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const slug = file.replace(".json", "");
    const filePath = path.join(pagesDir, file);

    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return {
        slug,
        title: content.title || slug,
        description: content.description || "",
      };
    } catch {
      return { slug, title: slug };
    }
  }).sort((a, b) => a.title.localeCompare(b.title));
}

export default async function PagesListPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/pages");
  }

  const pages = getPages();

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
              <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
            </div>
            <Link
              href="/dashboard/pages/new"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Page
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {pages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No pages yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first page to get started.
              </p>
              <Link
                href="/dashboard/pages/new"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Page
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/dashboard/edit?collection=pages&slug=${page.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        {page.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{page.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">/{page.slug}</p>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
