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
      <section className="-mt-20 pt-36 sm:pt-40 md:pt-48 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-0">
        <Container size="narrow">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-4 sm:mb-6 leading-tight">
              {heroContent.title}
            </h1>
            {heroContent.subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                {heroContent.subtitle}
              </p>
            )}
            {heroContent.buttonText && heroContent.buttonLink && (
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Link href={heroContent.buttonLink} className="btn btn-primary py-3.5 sm:py-3 text-base">
                  {heroContent.buttonText}
                </Link>
                <Link href="/about" className="btn btn-outline py-3.5 sm:py-3 text-base">
                  Learn More
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Page Content with clean spacing */}
      <div>{children}</div>
    </>
  );
}
