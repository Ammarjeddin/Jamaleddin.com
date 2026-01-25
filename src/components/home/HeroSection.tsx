"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface HeroSlide {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroSectionProps {
  slides: HeroSlide[];
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
}

export function HeroSection({
  slides,
  height = "large",
  overlay = true,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heights = {
    small: "h-[40vh]",
    medium: "h-[60vh]",
    large: "h-[80vh]",
    full: "h-screen",
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides.length) return null;

  const slide = slides[currentSlide];

  return (
    <section className={cn("relative overflow-visible", heights[height])}>
      {/* Background Image */}
      {slide.backgroundImage ? (
        <>
          {/* Extended image area above hero - stretches upward behind navbar */}
          <div className="absolute inset-x-0 -top-36 h-36 overflow-hidden z-0">
            {/* Same image, but positioned to show top portion and heavily blurred */}
            <div className="absolute inset-0 blur-3xl opacity-90">
              <Image
                src={slide.backgroundImage}
                alt=""
                fill
                priority
                className="object-cover object-top"
                style={{ transform: 'scale(1.2)' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
          </div>
          
          {/* Main hero image - covers whole section */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slide.backgroundImage}
              alt={slide.title}
              fill
              priority
              className="object-cover"
            />
            {overlay && <div className="absolute inset-0 bg-black/40" />}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]" />
      )}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center text-center text-white px-6">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              {slide.subtitle}
            </p>
          )}
          {slide.buttonText && slide.buttonLink && (
            <Link href={slide.buttonLink} className="btn btn-accent text-lg">
              {slide.buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
