import { getSiteSettings, getHomeContent } from "@/lib/content";
import { HomeLayout } from "@/components/home/layouts";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export default async function Home() {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const homeContent = await getHomeContent();

  return (
    <HomeLayout
      settings={settings}
      content={homeContent || { hero: { slides: [{ title: settings.siteName, subtitle: settings.tagline }] } }}
    >
      {homeContent?.blocks && <BlockRenderer blocks={homeContent.blocks} hasHero />}
    </HomeLayout>
  );
}
