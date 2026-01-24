import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { SiteSettings } from "@/lib/tina";
import type { NavItem } from "@/lib/navigation";

interface PageLayoutProps {
  settings: SiteSettings;
  navigation: NavItem[];
  children: React.ReactNode;
}

export function PageLayout({ settings, navigation, children }: PageLayoutProps) {
  const showCart = settings.template?.features?.shop?.enabled === true;

  return (
    <>
      <Navbar settings={settings} navigation={navigation} showCart={showCart} />
      <main className="pt-20 min-h-screen">{children}</main>
      <Footer settings={settings} navigation={navigation} />
    </>
  );
}
