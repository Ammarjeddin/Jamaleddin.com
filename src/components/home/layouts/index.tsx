import { StandardLayout } from "./StandardLayout";
import { HeroFullLayout } from "./HeroFullLayout";
import { MinimalLayout } from "./MinimalLayout";
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

interface HomeLayoutProps {
  settings: SiteSettings;
  navigation: NavItem[];
  content: HomeContent;
  children: React.ReactNode;
  variant?: "standard" | "hero-full" | "minimal";
}

export function HomeLayout({
  settings,
  navigation,
  content,
  children,
  variant,
}: HomeLayoutProps) {
  const layoutVariant = variant || settings.layout?.homepage || "standard";

  switch (layoutVariant) {
    case "hero-full":
      return (
        <HeroFullLayout
          settings={settings}
          navigation={navigation}
          content={content}
        >
          {children}
        </HeroFullLayout>
      );
    case "minimal":
      return (
        <MinimalLayout
          settings={settings}
          navigation={navigation}
          content={content}
        >
          {children}
        </MinimalLayout>
      );
    case "standard":
    default:
      return (
        <StandardLayout
          settings={settings}
          navigation={navigation}
          content={content}
        >
          {children}
        </StandardLayout>
      );
  }
}

export { StandardLayout, HeroFullLayout, MinimalLayout };
