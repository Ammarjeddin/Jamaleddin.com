import { getPageContent } from "@/lib/content";
import { BlockRenderer, Block } from "@/components/blocks";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("about");
  return {
    title: content?.title || "About Us",
    description: content?.description,
  };
}

export default async function AboutPage() {
  const content = await getPageContent("about");

  if (!content) {
    notFound();
  }

  return <BlockRenderer blocks={(content.blocks || []) as Block[]} />;
}
