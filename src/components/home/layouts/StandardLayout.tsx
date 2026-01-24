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

interface StandardLayoutProps {
  settings: SiteSettings;
  navigation: NavItem[];
  content: HomeContent;
  children: React.ReactNode;
}

export function StandardLayout({
  settings,
  navigation,
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
      <Navbar settings={settings} navigation={navigation} variant="floating" />

      <main>
        {/* Hero - 60vh for standard layout */}
        <HeroSection slides={heroSlides} height="medium" />

        {/* Page Content */}
        <div className="pt-0">{children}</div>
      </main>

      <Footer settings={settings} navigation={navigation} />
    </>
  );
}
