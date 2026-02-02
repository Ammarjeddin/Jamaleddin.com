import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Settings } from "lucide-react";
import type { SiteSettings } from "@/lib/content";
import type { NavItem } from "@/lib/navigation";

interface MinimalFooterProps {
  settings: SiteSettings;
  navigation: NavItem[];
}

export function MinimalFooter({ settings, navigation }: MinimalFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section relative z-10">
      {/* Animated top border - matches navbar style */}
      <div className="footer-glow-border" />

      <div className="footer-glass py-6">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              &copy; {currentYear} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/privacy" className="hover:text-[var(--color-accent)] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--color-accent)] transition-colors">
                Terms
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-[var(--color-accent)] transition-colors"
                title="Admin Dashboard"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
