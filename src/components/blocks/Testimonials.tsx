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
}

export function Testimonials({
  heading,
  layout = "carousel",
  items,
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
    <section className="section bg-gray-50">
      <Container>
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
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
                      <Quote className="w-12 h-12 text-[var(--color-primary)]/20 mx-auto mb-6" />
                      <blockquote className="text-xl md:text-2xl text-[var(--color-text)] mb-8 leading-relaxed">
                        &ldquo;{item.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-center gap-4">
                        {item.avatar ? (
                          <Image
                            src={item.avatar}
                            alt={item.author}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-lg">
                            {item.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-semibold">{item.author}</div>
                          {item.role && (
                            <div className="text-sm text-[var(--color-text-muted)]">
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all",
                        index === currentIndex
                          ? "bg-[var(--color-primary)] w-8"
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
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
              <div key={index} className="card p-6">
                <Quote className="w-8 h-8 text-[var(--color-primary)]/20 mb-4" />
                <blockquote className="text-[var(--color-text)] mb-6">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  {item.avatar ? (
                    <Image
                      src={item.avatar}
                      alt={item.author}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                      {item.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{item.author}</div>
                    {item.role && (
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {item.role}
                      </div>
                    )}
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
