import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Settings } from "lucide-react";
import type { SiteSettings } from "@/lib/tina";
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
    <footer className="bg-gray-900 text-white">
      <Container>
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {settings.logo?.light ? (
                <Image
                  src={settings.logo.light}
                  alt={settings.siteName}
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : (
                <span className="text-2xl font-bold">{settings.siteName}</span>
              )}
            </Link>
            <p className="text-gray-400 mb-6">{settings.tagline}</p>
            {/* Social Links */}
            <div className="flex gap-4">
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
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navigation.slice(0, 6).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              {settings.contact?.email && (
                <li>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.contact.email}
                  </a>
                </li>
              )}
              {settings.contact?.phone && (
                <li>
                  <a
                    href={`tel:${settings.contact.phone.replace(/\D/g, "")}`}
                    className="hover:text-white transition-colors"
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

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates and news.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary-dark)] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
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
