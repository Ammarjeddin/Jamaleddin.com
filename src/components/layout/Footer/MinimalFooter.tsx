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

      <div className="footer-glass py-5 sm:py-6">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-0">
            <p className="text-zinc-500 text-xs sm:text-sm text-center md:text-left">
              &copy; {currentYear} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-400">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-[var(--color-accent)] transition-colors py-1 min-h-[44px] sm:min-h-0 flex items-center"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/privacy" className="hover:text-[var(--color-accent)] transition-colors py-1 min-h-[44px] sm:min-h-0 flex items-center">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--color-accent)] transition-colors py-1 min-h-[44px] sm:min-h-0 flex items-center">
                Terms
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-[var(--color-accent)] transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
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
