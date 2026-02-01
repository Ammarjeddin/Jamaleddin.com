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
    <section className={cn("section dark:bg-slate-900", isFirstBlock && "-mt-20 pt-40")}>
      <Container>
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">{heading}</h2>
            )}
            {subheading && (
              <p className="text-lg text-[var(--color-text-muted)] dark:text-slate-300 max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-8">
          {members.map((member, index) => (
            <div key={index} className="card overflow-hidden group dark:shadow-lg dark:shadow-black/20 w-full sm:w-72">
              {/* Photo */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)]/10">
                    <span className="text-4xl font-bold text-[var(--color-primary)]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                )}

                {/* Social overlay */}
                {(member.linkedin || member.twitter || member.email) && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <Linkedin className="w-5 h-5 text-[var(--color-primary)]" />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label={`${member.name}'s Twitter`}
                      >
                        <Twitter className="w-5 h-5 text-[var(--color-primary)]" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                {member.role && (
                  <p className="text-[var(--color-primary)] text-sm mb-2">
                    {member.role}
                  </p>
                )}
                {member.bio && (
                  <p className="text-sm text-[var(--color-text-muted)] dark:text-slate-400 line-clamp-3">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
