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
}

export function CardsGrid({
  heading,
  subheading,
  columns = "3",
  cards,
}: CardsGridProps) {
  const columnClasses = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-2 lg:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
  };

  const getIcon = (iconName: string) => {
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconKey] || LucideIcons.Star;
  };

  return (
    <section className="section">
      <Container>
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid gap-6", columnClasses[columns])}>
          {cards.map((card, index) => {
            const CardWrapper = card.link ? Link : "div";
            const Icon = card.icon ? getIcon(card.icon) : null;

            return (
              <CardWrapper
                key={index}
                href={card.link || "#"}
                className={cn(
                  "card overflow-hidden group",
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
                <div className="p-6">
                  {Icon && !card.image && (
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-[var(--color-text-muted)]">
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
