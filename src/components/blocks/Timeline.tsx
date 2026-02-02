import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

interface TimelineItem {
  year: string;
  title: string;
  description?: string;
  image?: string;
}

interface TimelineProps {
  heading?: string;
  items: TimelineItem[];
  isFirstBlock?: boolean;
}

export function Timeline({ heading, items, isFirstBlock = false }: TimelineProps) {
  return (
    <section
      className={cn(
        "section glass",
        isFirstBlock && "-mt-20 pt-40"
      )}
    >
      <Container>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--color-text)]">
            {heading}
          </h2>
        )}

        <div className="relative">
          {/* Center line with gradient */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 bg-gradient-to-b from-[var(--color-accent)]/50 via-[var(--color-accent)]/20 to-transparent" />

          <div className="space-y-12">
            {items.map((item, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Content */}
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div
                    className={cn(
                      "relative rounded-xl p-6 bg-[rgba(10,10,10,0.4)] backdrop-blur-xl border border-white/[0.08] transition-all duration-400",
                      "hover:bg-[rgba(10,10,10,0.55)] hover:border-[var(--color-accent)]/30",
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    )}
                  >
                    {/* Inner highlight */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                    <span className="relative inline-block px-3 py-1 text-sm font-semibold rounded-lg mb-3 text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                      {item.year}
                    </span>
                    <h3 className="relative text-xl font-semibold mb-2 text-zinc-100">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="relative text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    {item.image && (
                      <div className="relative aspect-video mt-4 rounded-lg overflow-hidden ring-1 ring-white/10">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Circle marker with glow */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_rgba(232,181,77,0.5)] border-4 border-[var(--color-background)]" />
                </div>

                {/* Empty space for opposite side */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
