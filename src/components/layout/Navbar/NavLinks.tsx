"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/lib/navigation";

interface NavLinksProps {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
}

export function NavLinks({ items, className, linkClassName }: NavLinksProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className={cn("hidden lg:flex items-center gap-1", className)}>
      {items.map((item) => (
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
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-[var(--color-primary)]",
                  linkClassName
                )}
              >
                {item.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              {openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--color-primary)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-[var(--color-primary)]",
                linkClassName
              )}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
