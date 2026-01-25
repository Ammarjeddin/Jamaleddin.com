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
    <section className={cn("py-12 sm:py-16 md:py-20 dark:bg-slate-900", isFirstBlock && "-mt-20 pt-40 sm:pt-44 md:pt-48")}>
      <Container>
        {(heading || subheading) && (
          <div className="text-center mb-8 sm:mb-12">
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 dark:text-white">{heading}</h2>
            )}
            {subheading && (
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] dark:text-slate-300 max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid gap-3 sm:gap-4 md:gap-6", columnClasses[columns])}>
          {cards.map((card, index) => {
            const CardWrapper = card.link ? Link : "div";
            const Icon = card.icon ? getIcon(card.icon) : null;

            return (
              <CardWrapper
                key={index}
                href={card.link || "#"}
                className={cn(
                  "bg-white rounded-lg shadow-md overflow-hidden group",
                  "dark:shadow-lg dark:shadow-black/20",
                  card.link && "cursor-pointer"
                )}
              >
                {card.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-3 sm:p-4 md:p-6">
                  {Icon && !card.image && (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-[var(--color-primary)] flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-sm sm:text-base text-gray-600">
                      {card.description}
                    </p>
                  )}
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
