"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { Play } from "lucide-react";

interface VideoProps {
  heading?: string;
  videoUrl: string;
  thumbnail?: string;
  caption?: string;
  isFirstBlock?: boolean;
}

function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return null;
}

function getVideoThumbnail(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

export function Video({ heading, videoUrl, thumbnail, caption, isFirstBlock = false }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrl = getVideoEmbedUrl(videoUrl);
  const autoThumbnail = thumbnail || getVideoThumbnail(videoUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <section className={cn("section", isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container size="narrow">
        {heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-[var(--color-text)] px-4 sm:px-0">
            {heading}
          </h2>
        )}

        <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden shadow-lg dark:shadow-black/30 mx-4 sm:mx-0">
          {isPlaying ? (
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title={heading || "Video"}
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full group"
              aria-label="Play video"
            >
              {autoThumbnail ? (
                <Image
                  src={autoThumbnail}
                  alt={heading || "Video thumbnail"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]" />
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 active:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 active:scale-95 transition-transform">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-primary)] ml-0.5 sm:ml-1" />
                </div>
              </div>
            </button>
          )}
        </div>

        {caption && (
          <p className="text-center text-sm sm:text-base text-[var(--color-text-muted)] dark:text-gray-400 mt-3 sm:mt-4 px-4 sm:px-0">
            {caption}
          </p>
        )}
      </Container>
    </section>
  );
}
