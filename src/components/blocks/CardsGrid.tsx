import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import * as LucideIcons from "lucide-react";

interface Card {
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  link?: string;
}

interface CardsGridProps {
  heading?: string;
  subheading?: string;
  columns?: "2" | "3" | "4";
  cards: Card[];
  isFirstBlock?: boolean;
}

export function CardsGrid({
  heading,
  subheading,
  columns = "3",
  cards,
  isFirstBlock = false,
}: CardsGridProps) {
  const columnClasses = {
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  const getIcon = (iconName: string) => {
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconKey] || LucideIcons.Star;
  };

  return (
    <section className={cn("py-12 sm:py-16 md:py-20 glass", isFirstBlock && "-mt-20 pt-40 sm:pt-44 md:pt-48")}>
      <Container>
        {(heading || subheading) && (
          <div className="text-center mb-8 sm:mb-12">
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-[var(--color-text)]">{heading}</h2>
            )}
            {subheading && (
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid gap-4 sm:gap-5 md:gap-6", columnClasses[columns])}>
          {cards.map((card, index) => {
            const CardWrapper = card.link ? Link : "div";
            const Icon = card.icon ? getIcon(card.icon) : null;

            return (
              <CardWrapper
                key={index}
                href={card.link || "#"}
                className={cn(
                  "glass-card group h-full flex flex-col",
                  card.link && "cursor-pointer"
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Gold glow border */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[var(--color-accent)]/20 via-transparent to-[var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="glass-card-inner h-full flex flex-col">
                  {card.image && (
                    <div className="relative aspect-video overflow-hidden flex-shrink-0">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                  <div className="relative p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                    {Icon && !card.image && (
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:border-[var(--color-accent)]/40 transition-all duration-300 flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[var(--color-accent)]" />
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed flex-1">
                        {card.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
