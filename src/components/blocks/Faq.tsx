"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  heading?: string;
  items: FaqItem[];
  isFirstBlock?: boolean;
}

export function Faq({ heading, items, isFirstBlock = false }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-40")}>
      <Container size="narrow">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--color-text)]">
            {heading}
          </h2>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="faq-item"
              data-open={openIndex === index}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg pr-8 text-zinc-100">
                  {item.question}
                </span>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                  openIndex === index
                    ? "bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30"
                    : "bg-white/5 border border-white/10"
                )}>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-all duration-300 flex-shrink-0",
                      openIndex === index
                        ? "rotate-180 text-[var(--color-accent)]"
                        : "text-zinc-400"
                    )}
                  />
                </div>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <div
                  className="p-5 pt-0 text-zinc-400 prose prose-lg prose-invert prose-p:text-zinc-400 prose-a:text-[var(--color-accent)] prose-strong:text-zinc-200"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
