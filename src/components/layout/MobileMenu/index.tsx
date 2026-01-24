"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/lib/navigation";
import { useCart } from "@/contexts/CartContext";

interface MobileMenuProps {
  items: NavItem[];
  className?: string;
  showCart?: boolean;
}

export function MobileMenu({ items, className, showCart = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <div className="flex items-center gap-2">
                {showCart && cartContext && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      cartContext?.toggleCart();
                    }}
                    className="relative p-2 rounded-md hover:bg-gray-100"
                    aria-label={`Shopping cart with ${cartContext.itemCount} items`}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartContext.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartContext.itemCount > 99 ? "99+" : cartContext.itemCount}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.label)}
                          className="flex items-center justify-between w-full px-4 py-3 text-left rounded-md hover:bg-gray-100"
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
                          <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  className="block px-4 py-2 text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-50 rounded-md"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-4 py-3 rounded-md hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
