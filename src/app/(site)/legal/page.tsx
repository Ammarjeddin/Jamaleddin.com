import { getPageContent } from "@/lib/content";
import { BlockRenderer, type Block } from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("legal");

  if (!page) {
    return {
      title: "Privacy & Terms | Jamaleddin",
    };
  }

  return {
    title: `${page.title} | Jamaleddin`,
    description: page.description,
  };
}

export default async function LegalPage() {
  const page = await getPageContent("legal");

  if (!page) {
    notFound();
  }

  return (
    <BlockRenderer blocks={(page.blocks || []) as Block[]} />
  );
}
