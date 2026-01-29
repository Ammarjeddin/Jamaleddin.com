"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/lib/navigation";

interface NavLinksProps {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
}

export function NavLinks({ items, className, linkClassName }: NavLinksProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && openDropdown) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openDropdown]);

  return (
    <nav ref={navRef} className={cn("hidden lg:flex items-center gap-1", className)}>
      {items.map((item) => {
        const isActive = isNavItemActive(item, pathname);

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.children && setOpenDropdown(item.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {item.children ? (
              <>
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors text-gray-700 dark:text-white",
                    isActive && "bg-[var(--color-primary)]/10",
                    !isActive && "hover:bg-gray-100 dark:hover:bg-slate-800",
                    linkClassName
                  )}
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                  onFocus={() => item.children && setOpenDropdown(item.label)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenDropdown(openDropdown === item.label ? null : item.label);
                    }
                  }}
                >
                  {item.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div
                      className="w-56 rounded-xl shadow-xl border py-2 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                      role="menu"
                    >
                      {item.children.map((child) => {
                        const isChildActive =
                          child.href === "/"
                            ? pathname === "/"
                            : pathname === child.href ||
                              pathname.startsWith(child.href + "/");

                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            role="menuitem"
                            className={cn(
                              "block px-4 py-3 text-sm transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700",
                              isChildActive && "bg-gray-50 dark:bg-slate-700"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors text-gray-700 dark:text-white",
                  isActive && "bg-[var(--color-primary)]/10",
                  !isActive && "hover:bg-gray-100 dark:hover:bg-slate-800",
                  linkClassName
                )}
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
