import { HeroSection } from "../HeroSection";
import type { SiteSettings } from "@/lib/content";

interface HomeContent {
  hero?: {
    slides?: Array<{
      title: string;
      subtitle?: string;
      backgroundImage?: string;
      buttonText?: string;
      buttonLink?: string;
    }>;
  };
}

interface HeroFullLayoutProps {
  settings: SiteSettings;
  content: HomeContent;
  children: React.ReactNode;
}

export function HeroFullLayout({
  settings,
  content,
  children,
}: HeroFullLayoutProps) {
  const heroSlides = content.hero?.slides || [
    {
      title: settings.siteName,
      subtitle: settings.tagline,
    },
  ];

  return (
    <>
      {/* Full-screen hero */}
      <HeroSection slides={heroSlides} height="full" />

      {/* Page Content */}
      <div className="pt-0">{children}</div>
    </>
  );
}
