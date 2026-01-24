"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "../MobileMenu";
import { CartIcon } from "@/components/shop/CartIcon";
import type { NavItem } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/tina";

interface FloatingNavbarProps {
  settings: SiteSettings;
  navigation: NavItem[];
  showCart?: boolean;
}

export function FloatingNavbar({ settings, navigation, showCart = false }: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled
              ? ""
              : "bg-white/95 backdrop-blur-md rounded-full px-6 py-2 shadow-lg"
          )}
        >
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

          {/* CTA Button, Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            {showCart && <CartIcon />}
            <Link
              href="/get-involved"
              className="hidden sm:inline-flex btn btn-primary text-sm"
            >
              Get Involved
            </Link>
            <MobileMenu items={navigation} showCart={showCart} />
          </div>
        </div>
      </Container>
    </header>
  );
}
