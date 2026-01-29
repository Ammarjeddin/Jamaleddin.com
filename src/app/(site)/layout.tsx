import { getSiteSettings } from "@/lib/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getNavigation } from "@/lib/navigation";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const navigation = getNavigation(settings.template, settings);
  const showCart = settings.template?.features?.shop?.enabled === true;

  return (
    <>
      <Navbar settings={settings} navigation={navigation} showCart={showCart} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} navigation={navigation} />
    </>
  );
}
