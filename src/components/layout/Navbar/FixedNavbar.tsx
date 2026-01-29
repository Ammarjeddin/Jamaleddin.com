"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "../MobileMenu";
import { CartIcon } from "@/components/shop/CartIcon";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import type { NavItem } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/content";

interface FixedNavbarProps {
  settings: SiteSettings;
  navigation: NavItem[];
  showCart?: boolean;
}

export function FixedNavbar({ settings, navigation, showCart = false }: FixedNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-950/30">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {settings.logo?.main ? (
              <Image
                src={settings.logo.main}
                alt={settings.siteName}
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-[var(--color-primary)]">
                {settings.siteName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <NavLinks items={navigation} />

          {/* CTA Button, Cart, Dark Mode & Mobile Menu */}
          <div className="flex items-center gap-4">
            <DarkModeToggle className="hidden sm:flex" />
            {showCart && <CartIcon />}
            {settings.layout?.navbarButton?.enabled !== false && (
              <Link
                href={settings.layout?.navbarButton?.href || "/get-involved"}
                className="hidden sm:inline-flex btn btn-primary text-sm"
              >
                {settings.layout?.navbarButton?.text || "Get Involved"}
              </Link>
            )}
            <MobileMenu items={navigation} showCart={showCart} />
          </div>
        </div>
      </Container>
    </header>
  );
}
