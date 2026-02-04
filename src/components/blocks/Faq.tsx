"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SafeHtml } from "@/components/ui/SafeHtml";
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
    <section className={cn("section", isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container size="narrow">
        {heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-text)] px-4 sm:px-0">
            {heading}
          </h2>
        )}

        <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
          {items.map((item, index) => (
            <div
              key={index}
              className="faq-item"
              data-open={openIndex === index}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-white/[0.02] active:bg-white/[0.04] min-h-[56px]"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-base sm:text-lg pr-4 sm:pr-8 text-zinc-100">
                  {item.question}
                </span>
                <div className={cn(
                  "w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  openIndex === index
                    ? "bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30"
                    : "bg-white/5 border border-white/10"
                )}>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
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
                  openIndex === index ? "max-h-[500px]" : "max-h-0"
                )}
              >
                <SafeHtml
                  html={item.answer}
                  className="p-4 sm:p-5 pt-0 text-zinc-400 prose prose-sm sm:prose-lg prose-invert prose-p:text-zinc-400 prose-a:text-[var(--color-accent)] prose-strong:text-zinc-200"
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
