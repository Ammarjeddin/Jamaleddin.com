import { getPageContent } from "@/lib/content";
import { BlockRenderer, type Block } from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("services");

  if (!page) {
    return {
      title: "Services | Jamaleddin",
    };
  }

  return {
    title: `${page.title} | Jamaleddin`,
    description: page.description,
  };
}

export default async function ServicesPage() {
  const page = await getPageContent("services");

  if (!page) {
    notFound();
  }

  return (
    <BlockRenderer blocks={(page.blocks || []) as Block[]} />
  );
}
