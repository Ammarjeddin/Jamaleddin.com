"use client";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { useDarkMode } from "@/contexts/DarkModeContext";
import * as LucideIcons from "lucide-react";

interface Stat {
  number: string;
  label: string;
  icon?: string;
}

interface StatsProps {
  heading?: string;
  stats: Stat[];
  isFirstBlock?: boolean;
}

export function Stats({ heading, stats, isFirstBlock = false }: StatsProps) {
  const { isDarkMode } = useDarkMode();

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconKey] || null;
  };

  // Inline styles for dark mode
  const sectionStyle = { backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" };
  const headingStyle = { color: isDarkMode ? "#ffffff" : "#111827" };
  const numberStyle = { color: isDarkMode ? "#60a5fa" : "var(--color-primary)" }; // Brighter blue in dark mode
  const labelStyle = { color: isDarkMode ? "#cbd5e1" : "#6b7280" }; // Lighter labels in dark mode

  return (
    <section
      className={cn("section", isFirstBlock && "-mt-20 pt-40")}
      style={sectionStyle}
    >
      <Container>
        {heading && (
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
            style={headingStyle}
          >
            {heading}
          </h2>
        )}

        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <div key={index} className="text-center">
                {Icon && (
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                    <Icon className="w-5 h-5 md:w-7 md:h-7 text-[var(--color-primary)]" />
                  </div>
                )}
                <div
                  className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2"
                  style={numberStyle}
                >
                  {stat.number}
                </div>
                <div
                  className="text-xs md:text-base"
                  style={labelStyle}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
