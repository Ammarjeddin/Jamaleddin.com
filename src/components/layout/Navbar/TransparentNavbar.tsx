"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "../MobileMenu";
import { CartIcon } from "@/components/shop/CartIcon";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import type { NavItem } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/content";

interface TransparentNavbarProps {
  settings: SiteSettings;
  navigation: NavItem[];
  showCart?: boolean;
}

export function TransparentNavbar({ settings, navigation, showCart = false }: TransparentNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-950/30"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {isScrolled ? (
              settings.logo?.main ? (
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
              )
            ) : settings.logo?.light ? (
              <Image
                src={settings.logo.light}
                alt={settings.siteName}
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {settings.siteName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <NavLinks
            items={navigation}
            linkClassName={cn(
              isScrolled ? "text-gray-700 dark:text-white" : "text-white hover:text-white/80"
            )}
          />

          {/* CTA Button, Cart, Dark Mode & Mobile Menu */}
          <div className="flex items-center gap-4">
            <DarkModeToggle className="hidden sm:flex" />
            {showCart && <CartIcon />}
            {settings.layout?.navbarButton?.enabled !== false && (
              <Link
                href={settings.layout?.navbarButton?.href || "/get-involved"}
                className={cn(
                  "hidden sm:inline-flex btn text-sm",
                  isScrolled ? "btn-primary" : "bg-white text-[var(--color-primary)] hover:bg-white/90"
                )}
              >
                {settings.layout?.navbarButton?.text || "Get Involved"}
              </Link>
            )}
            <MobileMenu
              items={navigation}
              showCart={showCart}
              className={isScrolled ? "" : "[&_button]:text-white"}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
