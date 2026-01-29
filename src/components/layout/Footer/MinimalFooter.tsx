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
    <footer className="bg-gray-900 text-white py-6">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            {navigation.slice(0, 4).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors"
              title="Admin Dashboard"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
