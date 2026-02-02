import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, Layout, Plus, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Programs - Admin Dashboard",
  description: "Manage your programs.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

interface ProgramItem {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
}

function getPrograms(): ProgramItem[] {
  const programsDir = path.join(process.cwd(), "content/programs");

  if (!fs.existsSync(programsDir)) {
    return [];
  }

  const files = fs.readdirSync(programsDir).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const slug = file.replace(".json", "");
    const filePath = path.join(programsDir, file);

    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return {
        slug,
        title: content.title || slug,
        description: content.description || "",
        icon: content.icon,
      };
    } catch {
      return { slug, title: slug };
    }
  }).sort((a, b) => a.title.localeCompare(b.title));
}

export default async function ProgramsListPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/programs");
  }

  const programs = getPrograms();

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
              <h1 className="text-xl font-semibold text-zinc-100">Programs</h1>
            </div>
            <Link
              href="/dashboard/programs/new"
              className="flex items-center gap-2 btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              New Program
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {programs.length === 0 ? (
            <div className="dashboard-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">No programs yet</h2>
              <p className="text-zinc-400 mb-6">
                Create your first program to get started.
              </p>
              <Link
                href="/dashboard/programs/new"
                className="inline-flex items-center gap-2 btn btn-primary"
              >
                <Plus className="w-5 h-5" />
                Create Program
              </Link>
            </div>
          ) : (
            <div className="dashboard-card rounded-2xl overflow-hidden">
              <div className="divide-y divide-[var(--color-border)]">
                {programs.map((program) => (
                  <Link
                    key={program.slug}
                    href={`/dashboard/edit?collection=programs&slug=${program.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-[var(--color-surface-elevated)] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl icon-container-teal flex items-center justify-center transition-transform group-hover:scale-105">
                        <Layout className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors">{program.title}</h3>
                        {program.description && (
                          <p className="text-sm text-zinc-500 line-clamp-1">{program.description}</p>
                        )}
                        <p className="text-xs text-zinc-600 mt-0.5">/programs/{program.slug}</p>
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
