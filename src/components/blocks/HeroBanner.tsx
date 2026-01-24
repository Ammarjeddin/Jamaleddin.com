import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
  height?: "small" | "medium" | "large" | "full";
}

export function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  buttonText,
  buttonLink,
  height = "medium",
}: HeroBannerProps) {
  const heights = {
    small: "h-[40vh]",
    medium: "h-[60vh]",
    large: "h-[80vh]",
    full: "h-screen",
  };

  return (
    <section className={cn("relative overflow-hidden", heights[height])}>
      {/* Background */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-6">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {buttonText && buttonLink && (
            <Link href={buttonLink} className="btn btn-accent text-lg">
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
