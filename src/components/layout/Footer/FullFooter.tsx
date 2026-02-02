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
          <div className="py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-5 group">
                {settings.logo?.dark ? (
                  <Image
                    src={settings.logo.dark}
                    alt={settings.siteName}
                    width={150}
                    height={40}
                    className="h-10 w-auto transition-transform group-hover:scale-105"
                  />
                ) : settings.logo?.light ? (
                  <Image
                    src={settings.logo.light}
                    alt={settings.siteName}
                    width={150}
                    height={40}
                    className="h-10 w-auto transition-transform group-hover:scale-105"
                  />
                ) : (
                  <span className="text-2xl font-bold text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors">
                    {settings.siteName}
                  </span>
                )}
              </Link>
              <p className="text-zinc-400 mb-6 leading-relaxed">{settings.tagline}</p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label={link.name}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-zinc-100">Quick Links</h3>
              <ul className="space-y-3">
                {navigation.slice(0, 6).map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-zinc-400 hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[var(--color-accent)] transition-all duration-200" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-zinc-100">Contact Us</h3>
              <ul className="space-y-3 text-zinc-400">
                {settings.contact?.email && (
                  <li>
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="hover:text-[var(--color-accent)] transition-colors"
                    >
                      {settings.contact.email}
                    </a>
                  </li>
                )}
                {settings.contact?.phone && (
                  <li>
                    <a
                      href={`tel:${settings.contact.phone.replace(/\D/g, "")}`}
                      className="hover:text-[var(--color-accent)] transition-colors"
                    >
                      {settings.contact.phone}
                    </a>
                  </li>
                )}
                {settings.contact?.address && (
                  <li className="whitespace-pre-line">{settings.contact.address}</li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              &copy; {currentYear} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <Link href="/privacy" className="hover:text-[var(--color-accent)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[var(--color-accent)] transition-colors">
                Terms of Service
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
