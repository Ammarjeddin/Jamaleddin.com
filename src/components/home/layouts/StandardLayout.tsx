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

interface StandardLayoutProps {
  settings: SiteSettings;
  content: HomeContent;
  children: React.ReactNode;
}

export function StandardLayout({
  settings,
  content,
  children,
}: StandardLayoutProps) {
  const heroSlides = content.hero?.slides || [
    {
      title: settings.siteName,
      subtitle: settings.tagline,
    },
  ];

  return (
    <>
      {/* Hero - 60vh for standard layout */}
      <HeroSection slides={heroSlides} height="medium" />

      {/* Page Content */}
      <div className="pt-0">{children}</div>
    </>
  );
}
