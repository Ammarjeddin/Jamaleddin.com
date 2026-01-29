import { FloatingNavbar } from "./FloatingNavbar";
import { FixedNavbar } from "./FixedNavbar";
import { TransparentNavbar } from "./TransparentNavbar";
import type { NavItem } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/content";

interface NavbarProps {
  settings: SiteSettings;
  navigation: NavItem[];
  variant?: "floating" | "fixed" | "transparent";
  showCart?: boolean;
}

export function Navbar({ settings, navigation, variant, showCart = false }: NavbarProps) {
  const navbarVariant = variant || settings.layout?.navbar || "floating";

  switch (navbarVariant) {
    case "fixed":
      return <FixedNavbar settings={settings} navigation={navigation} showCart={showCart} />;
    case "transparent":
      return <TransparentNavbar settings={settings} navigation={navigation} showCart={showCart} />;
    case "floating":
    default:
      return <FloatingNavbar settings={settings} navigation={navigation} showCart={showCart} />;
  }
}

export { FloatingNavbar, FixedNavbar, TransparentNavbar };
