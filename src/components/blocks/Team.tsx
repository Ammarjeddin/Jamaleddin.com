import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { Linkedin, Twitter, Mail } from "lucide-react";

interface TeamMember {
  name: string;
  role?: string;
  photo?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface TeamProps {
  heading?: string;
  subheading?: string;
  members: TeamMember[];
  isFirstBlock?: boolean;
  /** Layout style: "default" for grid, "featured" for larger centered cards */
  layout?: "default" | "featured";
}

export function Team({ heading, subheading, members, isFirstBlock = false, layout = "default" }: TeamProps) {
  // Use featured layout for 2 or fewer members, or when explicitly set
  const isFeatured = layout === "featured" || (layout === "default" && members.length <= 2);

  return (
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container size={isFeatured ? "default" : "default"}>
        {(heading || subheading) && (
          <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-[var(--color-text)]">{heading}</h2>
            )}
            {subheading && (
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className={cn(
          "px-4 sm:px-0",
          isFeatured
            ? "flex flex-col md:flex-row justify-center items-stretch gap-6 lg:gap-10 max-w-5xl mx-auto"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        )}>
          {members.map((member, index) => (
            <div
              key={index}
              className={cn(
                "team-card group",
                isFeatured ? "w-full md:w-[420px] flex-shrink-0" : "w-full"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow border effect */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[var(--color-accent)]/30 via-transparent to-[var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card inner */}
              <div className="relative rounded-2xl overflow-hidden bg-[rgba(10,10,10,0.4)] backdrop-blur-xl border border-white/[0.08] group-hover:border-[var(--color-accent)]/30 transition-all duration-500 group-hover:bg-[rgba(10,10,10,0.55)]">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                {/* Photo */}
                <div className="relative aspect-square overflow-hidden">
                  {/* Photo backdrop for glassmorphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/20 to-[var(--color-surface)]/60" />

                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5">
                      <span className="text-5xl font-bold text-[var(--color-accent)]/80 drop-shadow-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Social overlay - Touch-friendly on mobile */}
                  {(member.linkedin || member.twitter || member.email) && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-[44px] min-h-[44px] w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all duration-300"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <Linkedin className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-[44px] min-h-[44px] w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all duration-300"
                          aria-label={`${member.name}'s Twitter`}
                        >
                          <Twitter className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="min-w-[44px] min-h-[44px] w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all duration-300"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Info section with glass effect */}
                <div className={cn(
                  "relative bg-gradient-to-b from-transparent via-[rgba(10,10,10,0.3)] to-[rgba(10,10,10,0.5)]",
                  isFeatured ? "p-6" : "p-5"
                )}>
                  <h3 className={cn(
                    "font-semibold text-zinc-100 group-hover:text-white transition-colors duration-300",
                    isFeatured ? "text-xl" : "text-lg"
                  )}>
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className={cn(
                      "text-[var(--color-accent)] font-medium mb-2",
                      isFeatured ? "text-base" : "text-sm"
                    )}>
                      {member.role}
                    </p>
                  )}
                  {member.bio && (
                    <p className={cn(
                      "text-zinc-400 leading-relaxed",
                      isFeatured ? "text-base" : "text-sm line-clamp-3"
                    )}>
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
