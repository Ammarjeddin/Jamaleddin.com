import { getSiteSettings, getAllPrograms } from "@/lib/tina";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { defaultNavigation } from "@/lib/navigation";
import Link from "next/link";
import { Users, GraduationCap, Heart, Laptop } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Programs",
  description: "Explore our community programs including Youth Leadership, Adult Education, Community Wellness, and Digital Skills training.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  "graduation-cap": GraduationCap,
  heart: Heart,
  laptop: Laptop,
};

export default async function ProgramsPage() {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const programs = await getAllPrograms();

  return (
    <PageLayout settings={settings} navigation={defaultNavigation}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Empowering our community through education, mentorship, and wellness initiatives
            </p>
          </div>
        </Container>
      </section>

      {/* Programs Grid */}
      <section className="section">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map(({ slug, content }) => {
              const Icon = iconMap[content.icon || "users"] || Users;
              return (
                <Link
                  key={slug}
                  href={`/programs/${slug}`}
                  className="card p-8 hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {content.title}
                      </h2>
                      <p className="text-[var(--color-text-muted)] mb-4">
                        {content.description}
                      </p>
                      <span className="text-[var(--color-primary)] font-medium">
                        Learn more →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section bg-gray-50">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Not Sure Which Program Is Right for You?</h2>
            <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
              Contact us and we&apos;ll help you find the perfect fit based on your goals and schedule.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
