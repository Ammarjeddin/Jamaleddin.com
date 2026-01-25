"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { useDarkMode } from "@/contexts/DarkModeContext";

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
  const { isDarkMode } = useDarkMode();

  // Styles for dark mode
  const headingStyle = { color: isDarkMode ? "#ffffff" : "#111827" };
  const titleStyle = { color: isDarkMode ? "#ffffff" : "#1f2937" };
  const descriptionStyle = { color: isDarkMode ? "#cbd5e1" : "#4b5563" };
  const dateStyle = { 
    color: isDarkMode ? "var(--color-primary)" : "var(--color-primary)",
    backgroundColor: isDarkMode ? "rgba(var(--color-primary-rgb), 0.2)" : "rgba(var(--color-primary-rgb), 0.1)"
  };
  const lineColor = isDarkMode ? "#475569" : "#e5e7eb";
  const dotColor = isDarkMode ? "#3b82f6" : "var(--color-primary)";
  const dotBorderColor = isDarkMode ? "#0f172a" : "#ffffff";
  const cardStyle = {
    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
    boxShadow: isDarkMode 
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)" 
      : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
  };

  return (
    <section 
      className={cn("section", isFirstBlock && "-mt-20 pt-40")}
      style={{ backgroundColor: isDarkMode ? "#0f172a" : undefined }}
    >
      <Container>
        {heading && (
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={headingStyle}
          >
            {heading}
          </h2>
        )}

        <div className="relative">
          {/* Center line */}
          <div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2"
            style={{ backgroundColor: lineColor }}
          />

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
                    className={`rounded-lg p-6 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                    style={cardStyle}
                  >
                    <span 
                      className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3"
                      style={dateStyle}
                    >
                      {item.year}
                    </span>
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={titleStyle}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p style={descriptionStyle}>
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
                <div 
                  className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full shadow md:-translate-x-1/2"
                  style={{ 
                    backgroundColor: dotColor,
                    borderWidth: "4px",
                    borderStyle: "solid",
                    borderColor: dotBorderColor
                  }}
                />

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
