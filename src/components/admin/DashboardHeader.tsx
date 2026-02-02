import Link from "next/link";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface DashboardHeaderProps {
  username: string;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <Container>
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline text-sm font-medium">Back to Site</span>
            </Link>
            <div className="h-5 w-px bg-[var(--color-border)]" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[var(--color-accent)]" />
              </div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Signed in as</span>
              <span className="font-medium text-zinc-200">{username}</span>
            </div>
            <div className="h-5 w-px bg-[var(--color-border)] hidden sm:block" />
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </Container>
    </header>
  );
}
