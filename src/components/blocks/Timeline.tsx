import Image from "next/image";
import { Container } from "@/components/ui/Container";

interface TimelineItem {
  year: string;
  title: string;
  description?: string;
  image?: string;
}

interface TimelineProps {
  heading?: string;
  items: TimelineItem[];
}

export function Timeline({ heading, items }: TimelineProps) {
  return (
    <section className="section">
      <Container>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {heading}
          </h2>
        )}

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 md:-translate-x-1/2" />

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
                    className={`card p-6 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <span className="inline-block px-3 py-1 text-sm font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full mb-3">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-[var(--color-text-muted)]">
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
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-white shadow md:-translate-x-1/2" />

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
