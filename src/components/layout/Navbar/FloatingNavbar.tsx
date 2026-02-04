"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NavLinks } from "./NavLinks";
import { NavbarLogo } from "./NavbarLogo";
import { MobileMenu } from "../MobileMenu";
import { CartIcon } from "@/components/shop/CartIcon";
import type { NavItem } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/content";

interface FloatingNavbarProps {
  settings: SiteSettings;
  navigation: NavItem[];
  showCart?: boolean;
}

export function FloatingNavbar({ settings, navigation, showCart = false }: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 50;

      // Determine if user has scrolled past threshold
      setIsScrolled(scrollY > scrollThreshold);

      // Set scrolling state to true
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to detect when scrolling stops (150ms delay)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Determine animation state
  const animationState = isScrolled && isScrolling ? 'navbar-scrolling' : isScrolled ? 'navbar-scrolled' : 'navbar-idle';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-4">
      <Container>
        {/* Animated Gold Border Wrapper - Animation activates while scrolling */}
        <div className={`navbar-glow-wrapper mx-2 sm:mx-4 md:mx-8 ${animationState}`}>
          <div className="navbar-animated-border">
            <div className="navbar-inner flex items-center px-3 sm:px-6 py-2 sm:py-2.5">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 sm:gap-3 relative z-10 min-h-[44px]">
                <NavbarLogo
                  mainLogo={settings.logo?.main}
                  darkLogo={settings.logo?.dark}
                  siteName={settings.siteName}
                />
              </Link>

              {/* Spacer to push nav links to the right */}
              <div className="flex-1" />

              {/* Desktop Navigation - Right aligned */}
              <NavLinks items={navigation} />

              {/* CTA Button, Cart & Mobile Menu */}
              <div className="flex items-center gap-2 sm:gap-3 relative z-10 ml-2 sm:ml-4">
                {showCart && <CartIcon />}
                {settings.layout?.navbarButton?.enabled !== false && (
                  <Link
                    href={settings.layout?.navbarButton?.href || "/contact"}
                    className="hidden lg:inline-flex btn btn-primary text-sm px-4 py-2"
                  >
                    {settings.layout?.navbarButton?.text || "Get Involved"}
                  </Link>
                )}
                <MobileMenu items={navigation} showCart={showCart} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
