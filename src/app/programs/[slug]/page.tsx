import { getSiteSettings, getProgramContent, getAllPrograms } from "@/lib/tina";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlockRenderer, Block } from "@/components/blocks";
import { defaultNavigation } from "@/lib/navigation";
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
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const content = await getProgramContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <PageLayout settings={settings} navigation={defaultNavigation}>
      <BlockRenderer blocks={(content.blocks || []) as Block[]} />
    </PageLayout>
  );
}
