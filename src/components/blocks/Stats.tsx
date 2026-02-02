import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
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
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconKey] || null;
  };

  return (
    <section
      className={cn(
        "section glass",
        isFirstBlock && "-mt-20 pt-40"
      )}
    >
      <Container>
        {heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-text)]">
            {heading}
          </h2>
        )}

        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <div
                key={index}
                className="stats-card text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {Icon && (
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-[var(--color-accent)]" />
                  </div>
                )}
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 text-[var(--color-accent)]">
                  {stat.number}
                </div>
                <div className="text-xs md:text-base text-zinc-400">
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
