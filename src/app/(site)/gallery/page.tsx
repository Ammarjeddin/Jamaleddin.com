import { getPageContent } from "@/lib/content";
import { BlockRenderer, Block } from "@/components/blocks";
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
  const content = await getPageContent("gallery");

  if (!content) {
    notFound();
  }

  return <BlockRenderer blocks={(content.blocks || []) as Block[]} />;
}
