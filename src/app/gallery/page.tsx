import { getSiteSettings, getPageContent } from "@/lib/tina";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlockRenderer, Block } from "@/components/blocks";
import { defaultNavigation } from "@/lib/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("gallery");
  return {
    title: content?.title || "Gallery",
    description: content?.description,
  };
}

export default async function GalleryPage() {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const content = await getPageContent("gallery");

  if (!content) {
    notFound();
  }

  return (
    <PageLayout settings={settings} navigation={defaultNavigation}>
      <BlockRenderer blocks={(content.blocks || []) as Block[]} />
    </PageLayout>
  );
}
