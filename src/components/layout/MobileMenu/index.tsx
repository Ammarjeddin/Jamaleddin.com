"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/lib/navigation";
import { useCartSafe } from "@/contexts/CartContext";

interface MobileMenuProps {
  items: NavItem[];
  className?: string;
  showCart?: boolean;
}

export function MobileMenu({ items, className, showCart = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Hooks called unconditionally at top of component
  const cartContext = useCartSafe();

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

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Hamburger Button - 44px minimum touch target */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[rgba(10,10,10,0.8)] backdrop-blur-sm border border-white/20 hover:bg-[rgba(10,10,10,0.9)] hover:border-[var(--color-accent)]/30 active:scale-95 transition-all"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-zinc-100" />
        ) : (
          <Menu className="w-6 h-6 text-zinc-100" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel - Full width on small screens */}
          <div className="fixed top-0 right-0 bottom-0 w-full sm:max-w-sm bg-[var(--color-background)] border-l border-white/10 shadow-2xl animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="text-lg font-semibold text-zinc-100">Menu</span>
              <div className="flex items-center gap-2">
                {showCart && cartContext && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      cartContext.toggleCart();
                    }}
                    className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
                    aria-label={`Shopping cart with ${cartContext.itemCount} items`}
                  >
                    <ShoppingCart className="w-5 h-5 text-zinc-100" />
                    {cartContext.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-black text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                        {cartContext.itemCount > 99 ? "99+" : cartContext.itemCount}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-zinc-100" />
                </button>
              </div>
            </div>

            {/* Navigation - Touch-optimized */}
            <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)] overscroll-contain">
              <ul className="space-y-2">
                {items.map((item) => {
                  const isActive = isNavItemActive(item, pathname);

                  return (
                    <li key={item.label}>
                      {item.children ? (
                        <div>
                          <button
                            onClick={() => toggleSubmenu(item.label)}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-4 text-left rounded-xl transition-all active:scale-[0.98]",
                              isActive
                                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20"
                                : "text-zinc-100 bg-white/5 border border-white/5 hover:bg-white/10"
                            )}
                          >
                            <span className="text-base font-medium">{item.label}</span>
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 transition-transform duration-200",
                                openSubmenu === item.label && "rotate-180"
                              )}
                            />
                          </button>
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-200",
                              openSubmenu === item.label ? "max-h-96 mt-2" : "max-h-0"
                            )}
                          >
                            <ul className="ml-3 pl-4 space-y-1 border-l-2 border-[var(--color-accent)]/30">
                              {item.children.map((child) => {
                                const isChildActive =
                                  child.href === "/"
                                    ? pathname === "/"
                                    : pathname === child.href ||
                                      pathname.startsWith(child.href + "/");

                                return (
                                  <li key={child.label}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "block px-4 py-3 rounded-lg text-base transition-all active:scale-[0.98]",
                                        isChildActive
                                          ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                          : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                      )}
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
                        <Link
                          href={item.href}
                          className={cn(
                            "block px-4 py-4 rounded-xl text-base font-medium transition-all active:scale-[0.98]",
                            isActive
                              ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20"
                              : "text-zinc-100 bg-white/5 border border-white/5 hover:bg-white/10"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* CTA Button for mobile */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/contact"
                  className="btn btn-primary w-full py-4 text-base"
                  onClick={() => setIsOpen(false)}
                >
                  Get in Touch
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
