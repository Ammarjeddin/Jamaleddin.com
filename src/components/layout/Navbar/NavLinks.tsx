"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useDarkMode } from "@/contexts/DarkModeContext";
import type { NavItem } from "@/lib/navigation";

interface NavLinksProps {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
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

export function NavLinks({ items, className, linkClassName }: NavLinksProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { isDarkMode } = useDarkMode();

  // Use inline style to force text color
  const textStyle = { color: isDarkMode ? "#ffffff" : "#374151" };

  return (
    <nav className={cn("hidden lg:flex items-center gap-1", className)}>
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
                  style={textStyle}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors",
                    isActive && "bg-[var(--color-primary)]/10",
                    !isActive && (isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"),
                    linkClassName
                  )}
                >
                  {item.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openDropdown === item.label && (
                  <div
                    className={cn(
                      "absolute top-full left-0 pt-2 z-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-56 rounded-xl shadow-xl border py-2",
                        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                      )}
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
                            style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
                            className={cn(
                              "block px-4 py-3 text-sm transition-colors",
                              isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100",
                              isChildActive && (isDarkMode ? "bg-slate-700" : "bg-gray-50")
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
                style={textStyle}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  isActive && "bg-[var(--color-primary)]/10",
                  !isActive && (isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"),
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
