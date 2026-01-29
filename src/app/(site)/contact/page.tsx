import { getPageContent } from "@/lib/content";
import { BlockRenderer, Block } from "@/components/blocks";
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
  const content = await getPageContent("contact");

  if (!content) {
    notFound();
  }

  return <BlockRenderer blocks={(content.blocks || []) as Block[]} />;
}
