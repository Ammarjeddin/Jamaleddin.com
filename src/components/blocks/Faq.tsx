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
    <section className={cn("section dark:bg-slate-900", isFirstBlock && "-mt-20 pt-40")}>
      <Container size="narrow">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">
            {heading}
          </h2>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden dark:shadow-lg dark:shadow-black/20"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg pr-8 text-gray-900 dark:text-white">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[var(--color-primary)] transition-transform flex-shrink-0",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <div
                  className="p-5 pt-0 text-[var(--color-text-muted)] dark:text-slate-300 prose prose-lg dark:prose-invert"
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
