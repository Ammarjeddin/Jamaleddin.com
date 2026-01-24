"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Play } from "lucide-react";

interface VideoProps {
  heading?: string;
  videoUrl: string;
  thumbnail?: string;
  caption?: string;
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

export function Video({ heading, videoUrl, thumbnail, caption }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrl = getVideoEmbedUrl(videoUrl);
  const autoThumbnail = thumbnail || getVideoThumbnail(videoUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <section className="section">
      <Container size="narrow">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {heading}
          </h2>
        )}

        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
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
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-[var(--color-primary)] ml-1" />
                </div>
              </div>
            </button>
          )}
        </div>

        {caption && (
          <p className="text-center text-[var(--color-text-muted)] mt-4">
            {caption}
          </p>
        )}
      </Container>
    </section>
  );
}
