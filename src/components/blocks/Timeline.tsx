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
        "section bg-white dark:bg-slate-900",
        isFirstBlock && "-mt-20 pt-40"
      )}
    >
      <Container>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {heading}
          </h2>
        )}

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 bg-gray-200 dark:bg-slate-600" />

          <div className="space-y-12">
            {items.map((item, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div
                    className={`rounded-lg p-6 bg-white dark:bg-slate-800 shadow dark:shadow-lg dark:shadow-black/20 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 text-[var(--color-primary)] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    )}
                    {item.image && (
                      <div className="relative aspect-video mt-4 rounded-lg overflow-hidden">
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

                {/* Circle marker */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full shadow md:-translate-x-1/2 bg-[var(--color-primary)] dark:bg-blue-500 border-4 border-white dark:border-slate-900" />

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
