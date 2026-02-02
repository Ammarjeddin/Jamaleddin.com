"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageGalleryProps {
  heading?: string;
  layout?: "grid" | "masonry" | "carousel";
  images: GalleryImage[];
  isFirstBlock?: boolean;
}

export function ImageGallery({
  heading,
  layout = "grid",
  images,
  isFirstBlock = false,
}: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );

  return (
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container>
        {heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-text)] px-4 sm:px-0">
            {heading}
          </h2>
        )}

        {/* Grid Layout */}
        {layout === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-0">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="relative aspect-square overflow-hidden rounded-lg sm:rounded-xl group ring-1 ring-white/10 hover:ring-[var(--color-accent)]/40 active:scale-[0.98] transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Image
                  src={image.src}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        )}

        {/* Masonry Layout */}
        {layout === "masonry" && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 sm:gap-4 space-y-2 sm:space-y-4 px-4 sm:px-0">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="relative w-full overflow-hidden rounded-lg sm:rounded-xl group break-inside-avoid ring-1 ring-white/10 hover:ring-[var(--color-accent)]/40 active:scale-[0.98] transition-all duration-300"
              >
                <Image
                  src={image.src}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  width={400}
                  height={300 + (index % 3) * 100}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        )}

        {/* Carousel Layout - Touch-friendly horizontal scroll */}
        {layout === "carousel" && (
          <div className="relative -mx-4 sm:mx-0">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 sm:px-0">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative flex-shrink-0 w-64 sm:w-72 aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl snap-start group ring-1 ring-white/10 hover:ring-[var(--color-accent)]/40 active:scale-[0.98] transition-all duration-300"
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox - Mobile optimized */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
            <button
              onClick={closeLightbox}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="relative max-w-5xl max-h-[80vh] w-full h-full m-4 sm:m-8">
              <Image
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt || "Gallery image"}
                fill
                className="object-contain"
              />
              {images[lightboxIndex].caption && (
                <p className="absolute bottom-0 left-0 right-0 text-center text-sm sm:text-base text-zinc-100 bg-black/70 backdrop-blur-sm py-2.5 sm:py-3 px-3 sm:px-4 rounded-b-lg">
                  {images[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
