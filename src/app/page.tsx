import { getSiteSettings, getHomeContent } from "@/lib/tina";
import { HomeLayout } from "@/components/home/layouts";
import { Container } from "@/components/ui/Container";
import { defaultNavigation } from "@/lib/navigation";
import Link from "next/link";
import { Users, GraduationCap, Heart, Laptop } from "lucide-react";

export default async function Home() {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;
  const homeContent = await getHomeContent();

  const programs = [
    {
      title: "Youth Leadership",
      description: "Developing the next generation of community leaders.",
      icon: Users,
      color: "var(--color-primary)",
    },
    {
      title: "Adult Education",
      description: "Accessible learning for career and personal growth.",
      icon: GraduationCap,
      color: "var(--color-secondary)",
    },
    {
      title: "Community Wellness",
      description: "Promoting physical and mental health programs.",
      icon: Heart,
      color: "var(--color-accent)",
    },
    {
      title: "Digital Skills",
      description: "Bridging the digital divide with tech training.",
      icon: Laptop,
      color: "var(--color-primary)",
    },
  ];

  return (
    <HomeLayout
      settings={settings}
      navigation={defaultNavigation}
      content={homeContent || { hero: { slides: [{ title: settings.siteName, subtitle: settings.tagline }] } }}
    >
      {/* Stats Section */}
      <section className="section bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2,500+", label: "People Served Annually" },
              { number: "15", label: "Years of Service" },
              { number: "50+", label: "Community Partners" },
              { number: "95%", label: "Program Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">
                  {stat.number}
                </div>
                <div className="text-[var(--color-text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Programs Section */}
      <section className="section">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-4">Our Programs</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            Discover how we&apos;re making a difference in our community
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: program.color }}
                >
                  <program.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-[var(--color-text-muted)]">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="section bg-gray-50">
        <Container size="narrow">
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-medium text-[var(--color-text)] mb-6 leading-relaxed">
              &ldquo;The Youth Leadership Program changed my life. I gained confidence,
              skills, and a network of mentors who continue to support me today.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                MS
              </div>
              <div className="text-left">
                <div className="font-semibold">Maria Santos</div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Program Graduate, 2024
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="section text-center text-white"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Whether you want to volunteer, donate, or participate in our
            programs, there&apos;s a place for you at Horizon.
          </p>
          <Link href="/get-involved" className="btn btn-accent">
            Get Involved Today
          </Link>
        </Container>
      </section>
    </HomeLayout>
  );
}
