import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, FileText, Plus, Edit, ChevronRight } from "lucide-react";

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
              <h1 className="text-xl font-semibold text-zinc-100">Pages</h1>
            </div>
            <Link
              href="/dashboard/pages/new"
              className="flex items-center gap-2 btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              New Page
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {pages.length === 0 ? (
            <div className="dashboard-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">No pages yet</h2>
              <p className="text-zinc-400 mb-6">
                Create your first page to get started.
              </p>
              <Link
                href="/dashboard/pages/new"
                className="inline-flex items-center gap-2 btn btn-primary"
              >
                <Plus className="w-5 h-5" />
                Create Page
              </Link>
            </div>
          ) : (
            <div className="dashboard-card rounded-2xl overflow-hidden">
              <div className="divide-y divide-[var(--color-border)]">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/dashboard/edit?collection=pages&slug=${page.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-[var(--color-surface-elevated)] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl icon-container-blue flex items-center justify-center transition-transform group-hover:scale-105">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors">{page.title}</h3>
                        {page.description && (
                          <p className="text-sm text-zinc-500 line-clamp-1">{page.description}</p>
                        )}
                        <p className="text-xs text-zinc-600 mt-0.5">/{page.slug}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" />
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
