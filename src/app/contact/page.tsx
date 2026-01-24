import { getSiteSettings, getPageContent } from "@/lib/tina";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlockRenderer, Block } from "@/components/blocks";
import { getNavigation } from "@/lib/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contact");
  return {
    title: content?.title || "Contact",
    description: content?.description,
  };
}

export default async function ContactPage() {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const content = await getPageContent("contact");

  if (!content) {
    notFound();
  }

  const navigation = getNavigation(settings.template);

  return (
    <PageLayout settings={settings} navigation={navigation}>
      <BlockRenderer blocks={(content.blocks || []) as Block[]} />
    </PageLayout>
  );
}
