import { FullFooter } from "./FullFooter";
import { MinimalFooter } from "./MinimalFooter";
import { CenteredFooter } from "./CenteredFooter";
import type { NavItem } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/tina";

interface FooterProps {
  settings: SiteSettings;
  navigation: NavItem[];
  variant?: "full" | "minimal" | "centered";
}

export function Footer({ settings, navigation, variant }: FooterProps) {
  const footerVariant = variant || settings.layout?.footer || "full";

  switch (footerVariant) {
    case "minimal":
      return <MinimalFooter settings={settings} />;
    case "centered":
      return <CenteredFooter settings={settings} navigation={navigation} />;
    case "full":
    default:
      return <FullFooter settings={settings} navigation={navigation} />;
  }
}

export { FullFooter, MinimalFooter, CenteredFooter };
