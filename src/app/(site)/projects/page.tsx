import { getPageContent } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Star, ExternalLink, Smartphone } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("projects");
  return {
    title: content?.title || "Projects",
    description: content?.description,
  };
}

const apps = [
  {
    name: "Zakir",
    subtitle: "Reimagined Zikr Reminders",
    description:
      "Transform your daily phone notifications into spiritually meaningful moments. Zakir sends gentle Islamic reminder notifications throughout the day to help you maintain consistent dhikr.",
    category: "Lifestyle",
    rating: 5.0,
    appStoreUrl: "https://apps.apple.com/us/app/zakir/id6755055774",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/67/06/e0/6706e0dc-ab2b-95c9-ab87-a4a320535f6a/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  },
  {
    name: "Salik السالك",
    subtitle: "The Path into Ihsan",
    description:
      "A privacy-first spiritual wellness companion for tracking daily Islamic practices. Log prayers, Quran reading, fasting, and custom habits while staying connected with your community.",
    category: "Lifestyle",
    rating: 5.0,
    appStoreUrl:
      "https://apps.apple.com/us/app/salik-%D8%A7%D9%84%D8%B3%D8%A7%D9%84%D9%83/id6757376449",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/7f/97/57/7f9757d0-972c-a82a-c1e6-29c098da7c3f/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg",
  },
  {
    name: "Trofi Foods",
    subtitle: "Cooking journey starts now!",
    description:
      "Document meals visually and get instant AI-powered nutritional analysis. Snap photos, import recipes with one tap, and track your eating patterns with smart insights.",
    category: "Food & Drink",
    rating: 5.0,
    appStoreUrl: "https://apps.apple.com/us/app/trofi-foods/id6502950424",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a2/d9/17/a2d917a2-f7e6-5075-443b-82da7626f5c3/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg",
  },
];

export default async function ProjectsPage() {
  const content = await getPageContent("projects");

  if (!content) {
    notFound();
  }

  return (
    <>
      {/* Hero Section - matches MinimalLayout hero pattern */}
      <section className="-mt-20 pt-44 sm:pt-40 md:pt-48 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-0">
        <Container size="narrow">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-4 sm:mb-6 leading-tight">
              Our Projects
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
              iOS apps crafted with purpose and precision
            </p>
          </div>
        </Container>
      </section>

      {/* iOS Apps Section - matches CardsGrid section pattern */}
      <section className="py-12 sm:py-16 md:py-20">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 sm:w-5 sm:h-5 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)]">
                iOS Apps
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Native applications available on the App Store
            </p>
          </div>

          {/* Apps Grid - matches CardsGrid grid pattern */}
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app, index) => (
              <a
                key={app.name}
                href={app.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group h-full flex flex-col cursor-pointer"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Gold glow border */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[var(--color-accent)]/20 via-transparent to-[var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="glass-card-inner h-full flex flex-col">
                  <div className="relative p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                    {/* App Icon + Meta Row */}
                    <div className="flex items-start gap-4 mb-4 sm:mb-5">
                      <Image
                        src={app.icon}
                        alt={`${app.name} app icon`}
                        width={72}
                        height={72}
                        className="rounded-2xl shadow-lg flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-zinc-100 group-hover:text-[var(--color-accent)] transition-colors duration-300 leading-tight">
                          {app.name}
                        </h3>
                        <p className="text-sm text-[var(--color-accent)] mt-0.5">
                          {app.subtitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="inline-block rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
                            {app.category}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3"
                                fill="var(--color-accent)"
                                stroke="var(--color-accent)"
                              />
                            ))}
                            <span className="ml-1 text-xs text-[var(--color-text-muted)]">
                              {app.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed flex-1">
                      {app.description}
                    </p>

                    {/* CTA */}
                    <div className="mt-4 sm:mt-5 flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] group-hover:gap-3 transition-all duration-300">
                      View on App Store
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
