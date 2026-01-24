import { HeroSection } from "../HeroSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { SiteSettings } from "@/lib/tina";
import type { NavItem } from "@/lib/navigation";

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
  navigation: NavItem[];
  content: HomeContent;
  children: React.ReactNode;
}

export function HeroFullLayout({
  settings,
  navigation,
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
      {/* Transparent navbar overlays the hero */}
      <Navbar settings={settings} navigation={navigation} variant="transparent" />

      <main>
        {/* Full-screen hero */}
        <HeroSection slides={heroSlides} height="full" />

        {/* Page Content */}
        <div className="pt-0">{children}</div>
      </main>

      <Footer settings={settings} navigation={navigation} />
    </>
  );
}
