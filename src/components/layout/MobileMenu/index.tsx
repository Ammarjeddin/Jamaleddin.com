"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingCart, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/lib/navigation";
import { useCart } from "@/contexts/CartContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface MobileMenuProps {
  items: NavItem[];
  className?: string;
  showCart?: boolean;
}

// Helper function to check if a nav item is active
function isNavItemActive(item: NavItem, pathname: string): boolean {
  // For items with children, check if any child matches
  if (item.children) {
    return item.children.some((child) => {
      if (child.href === "/") {
        return pathname === "/";
      }
      return pathname === child.href || pathname.startsWith(child.href + "/");
    });
  }

  // For home, only match exactly "/"
  if (item.href === "/") {
    return pathname === "/";
  }

  // For other items, match exact or nested routes
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function MobileMenu({ items, className, showCart = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Conditionally use cart hook only when shop is enabled
  let cartContext: { itemCount: number; toggleCart: () => void } | null = null;
  try {
    if (showCart) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      cartContext = useCart();
    }
  } catch {
    // Cart context not available
  }

  // Dark mode
  let darkModeContext: { isDarkMode: boolean; toggleDarkMode: () => void } | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    darkModeContext = useDarkMode();
  } catch {
    // Dark mode context not available
  }

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6 text-gray-700 dark:text-slate-200" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-slate-200" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">Menu</span>
              <div className="flex items-center gap-2">
                {darkModeContext && (
                  <button
                    onClick={darkModeContext.toggleDarkMode}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                    aria-label={darkModeContext.isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkModeContext.isDarkMode ? (
                      <Sun className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <Moon className="w-6 h-6 text-gray-600 dark:text-slate-400" />
                    )}
                  </button>
                )}
                {showCart && cartContext && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      cartContext?.toggleCart();
                    }}
                    className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                    aria-label={`Shopping cart with ${cartContext.itemCount} items`}
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-slate-200" />
                    {cartContext.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartContext.itemCount > 99 ? "99+" : cartContext.itemCount}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-slate-200" />
                </button>
              </div>
            </div>

            <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
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
                              "flex items-center justify-between w-full px-4 py-3 text-left rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors",
                              isActive
                                ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 dark:!text-slate-200"
                                : "text-gray-700 dark:text-slate-200"
                            )}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 transition-transform",
                                openSubmenu === item.label && "rotate-180"
                              )}
                            />
                          </button>
                          {openSubmenu === item.label && (
                            <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 dark:border-slate-700">
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
                                        "block px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800",
                                        isChildActive
                                          ? "text-[var(--color-primary)] bg-gray-50 dark:bg-slate-800 dark:!text-slate-200"
                                          : "text-gray-600 dark:text-slate-300",
                                        !isChildActive && "hover:text-[var(--color-primary)] dark:hover:!text-slate-200"
                                      )}
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "block px-4 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors",
                            isActive
                              ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 dark:!text-slate-200"
                              : "text-gray-700 dark:text-slate-200"
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
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
