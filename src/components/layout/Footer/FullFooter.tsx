import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Settings } from "lucide-react";
import type { SiteSettings } from "@/lib/content";
import type { NavItem } from "@/lib/navigation";

interface FullFooterProps {
  settings: SiteSettings;
  navigation: NavItem[];
}

export function FullFooter({ settings, navigation }: FullFooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "facebook", icon: Facebook, url: settings.social?.facebook },
    { name: "instagram", icon: Instagram, url: settings.social?.instagram },
    { name: "twitter", icon: Twitter, url: settings.social?.twitter },
    { name: "linkedin", icon: Linkedin, url: settings.social?.linkedin },
    { name: "youtube", icon: Youtube, url: settings.social?.youtube },
  ].filter((link) => link.url);

  return (
    <footer className="footer-section relative z-10">
      {/* Animated top border - matches navbar style */}
      <div className="footer-glow-border" />

      <div className="footer-glass">
        <Container>
          {/* Main Footer Content */}
          <div className="py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 px-4 sm:px-0">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
              <Link href="/" className="inline-block mb-4 sm:mb-5 group">
                {settings.logo?.dark ? (
                  <Image
                    src={settings.logo.dark}
                    alt={settings.siteName}
                    width={150}
                    height={40}
                    className="h-8 sm:h-10 w-auto transition-transform group-hover:scale-105 mx-auto sm:mx-0"
                  />
                ) : settings.logo?.light ? (
                  <Image
                    src={settings.logo.light}
                    alt={settings.siteName}
                    width={150}
                    height={40}
                    className="h-8 sm:h-10 w-auto transition-transform group-hover:scale-105 mx-auto sm:mx-0"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors">
                    {settings.siteName}
                  </span>
                )}
              </Link>
              <p className="text-sm sm:text-base text-zinc-400 mb-5 sm:mb-6 leading-relaxed max-w-sm mx-auto sm:mx-0">{settings.tagline}</p>
              {/* Social Links - Touch-friendly */}
              <div className="flex gap-3 justify-center sm:justify-start">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon min-w-[44px] min-h-[44px] w-11 h-11"
                    aria-label={link.name}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 text-zinc-100">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.slice(0, 6).map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-zinc-400 hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 group py-1 min-h-[44px] sm:min-h-0"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[var(--color-accent)] transition-all duration-200" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 text-zinc-100">Contact Us</h3>
              <ul className="space-y-3 sm:space-y-3 text-zinc-400">
                {settings.contact?.email && (
                  <li>
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="hover:text-[var(--color-accent)] transition-colors inline-block py-1 min-h-[44px] sm:min-h-0 text-sm sm:text-base break-all"
                    >
                      {settings.contact.email}
                    </a>
                  </li>
                )}
                {settings.contact?.phone && (
                  <li>
                    <a
                      href={`tel:${settings.contact.phone.replace(/\D/g, "")}`}
                      className="hover:text-[var(--color-accent)] transition-colors inline-block py-1 min-h-[44px] sm:min-h-0 text-sm sm:text-base"
                    >
                      {settings.contact.phone}
                    </a>
                  </li>
                )}
                {settings.contact?.address && (
                  <li className="whitespace-pre-line text-sm sm:text-base">{settings.contact.address}</li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-5 sm:py-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-0">
            <p className="text-zinc-500 text-xs sm:text-sm text-center sm:text-left">
              &copy; {currentYear} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-400">
              <Link href="/legal" className="hover:text-[var(--color-accent)] transition-colors py-1 min-h-[44px] sm:min-h-0 flex items-center">
                Privacy
              </Link>
              <Link href="/legal#terms-of-service" className="hover:text-[var(--color-accent)] transition-colors py-1 min-h-[44px] sm:min-h-0 flex items-center">
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
