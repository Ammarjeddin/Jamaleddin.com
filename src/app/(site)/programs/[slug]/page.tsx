import { getProgramContent, getAllPrograms } from "@/lib/content";
import { BlockRenderer, Block } from "@/components/blocks";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programs = await getAllPrograms();
  return programs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getProgramContent(slug);
  return {
    title: content?.title || "Program",
    description: content?.description,
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const content = await getProgramContent(slug);

  if (!content) {
    notFound();
  }

  return <BlockRenderer blocks={(content.blocks || []) as Block[]} />;
}
