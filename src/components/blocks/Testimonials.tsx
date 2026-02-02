"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

interface TestimonialsProps {
  heading?: string;
  layout?: "carousel" | "grid";
  items: Testimonial[];
  isFirstBlock?: boolean;
}

export function Testimonials({
  heading,
  layout = "carousel",
  items,
  isFirstBlock = false,
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (layout !== "carousel" || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [layout, items.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-40")}>
      <Container>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--color-text)]">
            {heading}
          </h2>
        )}

        {/* Carousel Layout */}
        {layout === "carousel" && (
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {items.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="text-center">
                      <Quote className="w-12 h-12 text-[var(--color-accent)]/30 mx-auto mb-6" />
                      <blockquote className="text-xl md:text-2xl text-zinc-100 mb-8 leading-relaxed">
                        &ldquo;{item.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-center gap-4">
                        {item.avatar ? (
                          <Image
                            src={item.avatar}
                            alt={item.author}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-[var(--color-accent)]/30"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-accent)]/30 to-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] font-bold text-lg">
                            {item.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-semibold text-zinc-100">{item.author}</div>
                          {item.role && (
                            <div className="text-sm text-[var(--color-accent)]">
                              {item.role}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="testimonial-nav absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-zinc-300" />
                </button>
                <button
                  onClick={nextSlide}
                  className="testimonial-nav absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-zinc-300" />
                </button>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className="testimonial-dot w-3 h-3 rounded-full"
                      data-active={index === currentIndex}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Grid Layout */}
        {layout === "grid" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="glass-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="glass-card-inner p-6">
                  <Quote className="w-8 h-8 text-[var(--color-accent)]/30 mb-4" />
                  <blockquote className="text-zinc-200 mb-6 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <Image
                        src={item.avatar}
                        alt={item.author}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--color-accent)]/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/25 flex items-center justify-center text-[var(--color-accent)] font-bold">
                        {item.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-zinc-100">{item.author}</div>
                      {item.role && (
                        <div className="text-sm text-[var(--color-accent)]">
                          {item.role}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
