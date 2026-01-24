import { Container } from "@/components/ui/Container";
import * as LucideIcons from "lucide-react";

interface Stat {
  number: string;
  label: string;
  icon?: string;
}

interface StatsProps {
  heading?: string;
  stats: Stat[];
}

export function Stats({ heading, stats }: StatsProps) {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconKey] || null;
  };

  return (
    <section className="section bg-white">
      <Container>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {heading}
          </h2>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <div key={index} className="text-center">
                {Icon && (
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[var(--color-primary)]" />
                  </div>
                )}
                <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">
                  {stat.number}
                </div>
                <div className="text-[var(--color-text-muted)]">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
