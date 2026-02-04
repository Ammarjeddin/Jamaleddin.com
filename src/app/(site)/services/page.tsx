import { getActiveProducts } from "@/lib/products";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brain, Globe, Smartphone, Cloud, ShoppingCart, BarChart2, Zap, Code } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Jamaleddin",
  description: "Comprehensive software development services including AI solutions, web applications, mobile apps, SaaS platforms, and business consulting.",
};

const serviceIcons: Record<string, React.ReactNode> = {
  "ai-enablement": <Brain className="w-8 h-8" />,
  "web-applications": <Globe className="w-8 h-8" />,
  "ios-development": <Smartphone className="w-8 h-8" />,
  "saas-development": <Cloud className="w-8 h-8" />,
  "custom-websites": <Code className="w-8 h-8" />,
  "ecommerce-seo": <ShoppingCart className="w-8 h-8" />,
  "business-consulting": <BarChart2 className="w-8 h-8" />,
  "custom-software": <Zap className="w-8 h-8" />,
};

export default async function ServicesPage() {
  const products = await getActiveProducts();

  // Filter only services (not physical products)
  const services = products.filter(p => p.productType === "service");

  return (
    <>
      {/* Hero Section */}
      <section className="-mt-20 pt-44 pb-20 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--color-accent-rgb),0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(var(--color-accent-rgb),0.1),transparent_50%)]" />

        <Container>
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              End-to-end software solutions designed to transform your business.
              From AI-powered systems to custom applications, we build technology that delivers results.
            </p>
          </div>
        </Container>
      </section>

      {/* Services List */}
      <section className="section glass">
        <Container>
          <div className="space-y-24">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              const icon = serviceIcons[service.slug] || <Code className="w-8 h-8" />;

              return (
                <div
                  key={service.slug}
                  id={service.slug}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800/50 border border-white/10">
                      {service.images?.[0]?.src ? (
                        <Image
                          src={service.images[0].src}
                          alt={service.images[0].alt || service.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5">
                          <div className="text-[var(--color-accent)]">
                            {icon}
                          </div>
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    {/* Icon and category badge */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                        {icon}
                      </div>
                      {service.category && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-zinc-400">
                          {service.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {service.name}
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-zinc-400 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Tags */}
                    {service.tags && (
                      <div className="flex flex-wrap gap-2">
                        {service.tags.split(',').map((tag: string) => (
                          <span
                            key={tag.trim()}
                            className="px-3 py-1 rounded-lg text-sm bg-zinc-800/50 border border-zinc-700/50 text-zinc-400"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-4">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-black font-semibold hover:bg-[var(--color-accent)]/90 transition-all duration-300 hover:gap-3"
                      >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section glass">
        <Container size="narrow">
          <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help transform your business with custom software solutions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--color-accent)] text-black font-semibold text-lg hover:bg-[var(--color-accent)]/90 transition-all duration-300 hover:gap-3"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
