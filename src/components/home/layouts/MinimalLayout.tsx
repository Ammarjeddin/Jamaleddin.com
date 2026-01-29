import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/lib/content";

interface HomeContent {
  hero?: {
    slides?: Array<{
      title: string;
      subtitle?: string;
      buttonText?: string;
      buttonLink?: string;
    }>;
  };
}

interface MinimalLayoutProps {
  settings: SiteSettings;
  content: HomeContent;
  children: React.ReactNode;
}

export function MinimalLayout({
  settings,
  content,
  children,
}: MinimalLayoutProps) {
  const heroContent = content.hero?.slides?.[0] || {
    title: settings.siteName,
    subtitle: settings.tagline,
  };

  return (
    <>
      {/* Text-only hero - minimal and clean */}
      <section className="-mt-20 pt-48 pb-20 bg-white dark:bg-slate-900">
        <Container size="narrow">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-6 leading-tight">
              {heroContent.title}
            </h1>
            {heroContent.subtitle && (
              <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
                {heroContent.subtitle}
              </p>
            )}
            {heroContent.buttonText && heroContent.buttonLink && (
              <div className="flex justify-center gap-4">
                <Link href={heroContent.buttonLink} className="btn btn-primary">
                  {heroContent.buttonText}
                </Link>
                <Link href="/about" className="btn btn-outline">
                  Learn More
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Page Content with clean spacing */}
      <div className="bg-[var(--color-background)]">{children}</div>
    </>
  );
}
