import { getPageContent } from "@/lib/content";
import { BlockRenderer, Block } from "@/components/blocks";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("events");
  return {
    title: content?.title || "Events",
    description: content?.description,
  };
}

export default async function EventsPage() {
  const content = await getPageContent("events");

  if (!content) {
    notFound();
  }

  return <BlockRenderer blocks={(content.blocks || []) as Block[]} />;
}
