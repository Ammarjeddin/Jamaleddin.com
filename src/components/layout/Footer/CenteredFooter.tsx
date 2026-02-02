import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Settings } from "lucide-react";
import type { SiteSettings } from "@/lib/content";
import type { NavItem } from "@/lib/navigation";

interface CenteredFooterProps {
  settings: SiteSettings;
  navigation: NavItem[];
}

export function CenteredFooter({ settings, navigation }: CenteredFooterProps) {
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

      <div className="footer-glass py-14">
        <Container>
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <Link href="/" className="mb-8 group">
              {settings.logo?.dark ? (
                <Image
                  src={settings.logo.dark}
                  alt={settings.siteName}
                  width={180}
                  height={50}
                  className="h-14 w-auto transition-transform group-hover:scale-105"
                />
              ) : settings.logo?.light ? (
                <Image
                  src={settings.logo.light}
                  alt={settings.siteName}
                  width={180}
                  height={50}
                  className="h-14 w-auto transition-transform group-hover:scale-105"
                />
              ) : (
                <span className="text-3xl font-bold text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors">
                  {settings.siteName}
                </span>
              )}
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
              {navigation.slice(0, 6).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-zinc-400 hover:text-[var(--color-accent)] transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Social Links */}
            <div className="flex gap-4 mb-10">
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

            {/* Divider with gold accent */}
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent mb-8" />

            {/* Copyright & Admin */}
            <div className="flex items-center gap-4">
              <p className="text-zinc-500 text-sm">
                &copy; {currentYear} {settings.siteName}. All rights reserved.
              </p>
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
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
