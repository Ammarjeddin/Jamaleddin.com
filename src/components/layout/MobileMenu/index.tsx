"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Home,
  User,
  Briefcase,
  Calendar,
  Image,
  Heart,
  Mail,
  Store,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/lib/navigation";
import { useCartSafe } from "@/contexts/CartContext";

interface MobileMenuProps {
  items: NavItem[];
  className?: string;
  showCart?: boolean;
}

// Theme colors that cycle through menu items
const THEME_COLORS = [
  "#E8B54D", // Gold/Accent
  "#22D3EE", // Cyan
  "#A78BFA", // Purple
  "#F472B6", // Pink
  "#34D399", // Emerald
  "#FB923C", // Orange
  "#60A5FA", // Blue
];

// Map common nav labels to icons
const ICON_MAP: Record<string, React.ElementType> = {
  home: Home,
  about: User,
  programs: Briefcase,
  services: Store,
  events: Calendar,
  gallery: Image,
  "get involved": Heart,
  contact: Mail,
};

function getIconForLabel(label: string): React.ElementType {
  const normalizedLabel = label.toLowerCase();
  return ICON_MAP[normalizedLabel] || Sparkles;
}

export function MobileMenu({ items, className, showCart = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Cart context
  const cartContext = useCartSafe();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const getItemColor = (index: number) => THEME_COLORS[index % THEME_COLORS.length];

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Hamburger Button with animated icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[rgba(10,10,10,0.8)] backdrop-blur-sm border border-white/20 hover:bg-[rgba(10,10,10,0.9)] hover:border-[var(--color-accent)]/30 active:scale-95 transition-all relative"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <div className="relative w-6 h-6">
          {/* Hamburger to X animation */}
          <span
            className={cn(
              "absolute left-0 block w-6 h-0.5 bg-zinc-100 rounded-full transition-all duration-300 ease-out",
              isOpen ? "top-[11px] rotate-45" : "top-[5px] rotate-0"
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-[11px] block w-6 h-0.5 bg-zinc-100 rounded-full transition-all duration-300 ease-out",
              isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
            )}
          />
          <span
            className={cn(
              "absolute left-0 block w-6 h-0.5 bg-zinc-100 rounded-full transition-all duration-300 ease-out",
              isOpen ? "top-[11px] -rotate-45" : "top-[17px] rotate-0"
            )}
          />
        </div>
      </button>

      {/* Backdrop - fades in */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Expanding Menu Container - positioned below the navbar */}
      <div
        className={cn(
          "fixed left-0 right-0 top-[60px] sm:top-[72px] z-50 overflow-hidden transition-all duration-500 ease-out",
          isOpen ? "max-h-[calc(100dvh-72px)] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-2 sm:mx-4 md:mx-8">
          <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Menu Items Container */}
            <nav className="p-4 overflow-y-auto max-h-[calc(100dvh-160px)] overscroll-contain">
              <ul className="space-y-2">
                {items.map((item, index) => {
                  const isActive = isNavItemActive(item, pathname);
                  const itemColor = getItemColor(index);
                  const Icon = getIconForLabel(item.label);

                  return (
                    <li
                      key={item.label}
                      style={{
                        transitionDelay: isOpen ? `${index * 40}ms` : "0ms",
                      }}
                      className={cn(
                        "transition-all duration-400 ease-out",
                        isOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-6 opacity-0"
                      )}
                    >
                      {item.children ? (
                        <div>
                          {/* Parent item with children */}
                          <button
                            onClick={() => toggleSubmenu(item.label)}
                            className={cn(
                              "flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] group",
                              isActive
                                ? "bg-[color-mix(in_srgb,var(--item-color)_15%,transparent)]"
                                : "hover:bg-white/5"
                            )}
                            style={{ "--item-color": itemColor } as React.CSSProperties}
                          >
                            {/* Icon container */}
                            <div
                              className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200",
                                isActive
                                  ? "bg-[color-mix(in_srgb,var(--item-color)_25%,transparent)]"
                                  : "bg-white/5 group-hover:bg-white/10"
                              )}
                              style={{ "--item-color": itemColor } as React.CSSProperties}
                            >
                              <Icon
                                className="w-5 h-5 transition-colors duration-200"
                                style={{ color: isActive ? itemColor : "#a1a1aa" }}
                              />
                            </div>

                            {/* Label */}
                            <span
                              className={cn(
                                "flex-1 text-left text-base font-medium transition-colors duration-200",
                                isActive ? "text-white" : "text-zinc-300 group-hover:text-white"
                              )}
                            >
                              {item.label}
                            </span>

                            {/* Chevron */}
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 text-zinc-500 transition-transform duration-300 ease-out",
                                openSubmenu === item.label && "rotate-180"
                              )}
                              style={{
                                color: openSubmenu === item.label ? itemColor : undefined,
                              }}
                            />
                          </button>

                          {/* Submenu items */}
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-300 ease-out",
                              openSubmenu === item.label
                                ? "max-h-96 opacity-100 mt-1"
                                : "max-h-0 opacity-0"
                            )}
                          >
                            <ul
                              className="ml-5 pl-4 space-y-1 border-l-2"
                              style={{ borderColor: `color-mix(in srgb, ${itemColor} 40%, transparent)` }}
                            >
                              {item.children.map((child, childIndex) => {
                                const isChildActive =
                                  child.href === "/"
                                    ? pathname === "/"
                                    : pathname === child.href ||
                                      pathname.startsWith(child.href + "/");

                                return (
                                  <li
                                    key={child.label}
                                    style={{
                                      transitionDelay:
                                        openSubmenu === item.label
                                          ? `${childIndex * 30}ms`
                                          : "0ms",
                                    }}
                                    className={cn(
                                      "transition-all duration-300 ease-out",
                                      openSubmenu === item.label
                                        ? "translate-x-0 opacity-100"
                                        : "translate-x-4 opacity-0"
                                    )}
                                  >
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "block px-3 py-2.5 rounded-lg text-sm transition-all duration-200 active:scale-[0.98]",
                                        isChildActive
                                          ? "text-white bg-[color-mix(in_srgb,var(--item-color)_15%,transparent)]"
                                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                                      )}
                                      style={{ "--item-color": itemColor } as React.CSSProperties}
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        /* Regular menu item */
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] group",
                            isActive
                              ? "bg-[color-mix(in_srgb,var(--item-color)_15%,transparent)]"
                              : "hover:bg-white/5"
                          )}
                          style={{ "--item-color": itemColor } as React.CSSProperties}
                          onClick={() => setIsOpen(false)}
                        >
                          {/* Icon container */}
                          <div
                            className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200",
                              isActive
                                ? "bg-[color-mix(in_srgb,var(--item-color)_25%,transparent)]"
                                : "bg-white/5 group-hover:bg-white/10"
                            )}
                            style={{ "--item-color": itemColor } as React.CSSProperties}
                          >
                            <Icon
                              className="w-5 h-5 transition-colors duration-200"
                              style={{ color: isActive ? itemColor : "#a1a1aa" }}
                            />
                          </div>

                          {/* Label */}
                          <span
                            className={cn(
                              "text-base font-medium transition-colors duration-200",
                              isActive ? "text-white" : "text-zinc-300 group-hover:text-white"
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Footer section with cart and CTA */}
              <div
                className="mt-6 pt-6 border-t border-white/10 space-y-3"
                style={{
                  transitionDelay: isOpen ? `${items.length * 40 + 100}ms` : "0ms",
                }}
              >
                {/* Cart button if enabled */}
                {showCart && cartContext && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      cartContext.toggleCart();
                    }}
                    className="flex items-center w-full px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 active:scale-[0.98] group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 mr-3 relative">
                      <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                      {cartContext.itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-black text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {cartContext.itemCount > 99 ? "99+" : cartContext.itemCount}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-medium text-zinc-300 group-hover:text-white transition-colors">
                      Cart
                    </span>
                    {cartContext.itemCount > 0 && (
                      <span className="ml-auto text-sm text-zinc-500">
                        {cartContext.itemCount} {cartContext.itemCount === 1 ? "item" : "items"}
                      </span>
                    )}
                  </button>
                )}

                {/* CTA Button */}
                <Link
                  href="/contact"
                  className={cn(
                    "block w-full py-4 px-6 rounded-xl text-center text-base font-semibold transition-all duration-200 active:scale-[0.98]",
                    "bg-gradient-to-r from-[var(--color-accent)] to-[color-mix(in_srgb,var(--color-accent)_80%,#fff)] text-black",
                    "hover:shadow-lg hover:shadow-[var(--color-accent)]/25"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Get in Touch
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
