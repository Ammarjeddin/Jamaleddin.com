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
}

export function Team({ heading, subheading, members, isFirstBlock = false }: TeamProps) {
  return (
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-40")}>
      <Container>
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text)]">{heading}</h2>
            )}
            {subheading && (
              <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-8">
          {members.map((member, index) => (
            <div
              key={index}
              className="team-card group w-full sm:w-72"
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

                  {/* Social overlay */}
                  {(member.linkedin || member.twitter || member.email) && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300 hover:scale-110"
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
                          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300 hover:scale-110"
                          aria-label={`${member.name}'s Twitter`}
                        >
                          <Twitter className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300 hover:scale-110"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Info section with glass effect */}
                <div className="relative p-5 bg-gradient-to-b from-transparent via-[rgba(10,10,10,0.3)] to-[rgba(10,10,10,0.5)]">
                  <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors duration-300">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="text-[var(--color-accent)] text-sm mb-2 font-medium">
                      {member.role}
                    </p>
                  )}
                  {member.bio && (
                    <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
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
