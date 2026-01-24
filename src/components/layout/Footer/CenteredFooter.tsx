import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Settings } from "lucide-react";
import type { SiteSettings } from "@/lib/tina";
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
    <footer className="bg-gray-900 text-white py-12">
      <Container>
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <Link href="/" className="mb-6">
            {settings.logo?.light ? (
              <Image
                src={settings.logo.light}
                alt={settings.siteName}
                width={150}
                height={40}
                className="h-12 w-auto"
              />
            ) : (
              <span className="text-2xl font-bold">{settings.siteName}</span>
            )}
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
            {navigation.slice(0, 6).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex gap-4 mb-8">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-gray-800 mb-6" />

          {/* Copyright & Admin */}
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {settings.siteName}. All rights reserved.
            </p>
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white transition-colors"
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
