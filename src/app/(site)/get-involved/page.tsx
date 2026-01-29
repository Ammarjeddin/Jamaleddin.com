import { getPageContent } from "@/lib/content";
import { BlockRenderer, Block } from "@/components/blocks";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("get-involved");
  return {
    title: content?.title || "Get Involved",
    description: content?.description,
  };
}

export default async function GetInvolvedPage() {
  const content = await getPageContent("get-involved");

  if (!content) {
    notFound();
  }

  return <BlockRenderer blocks={(content.blocks || []) as Block[]} />;
}
