import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

interface CtaBoxProps {
  heading: string;
  text?: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  style?: "primary" | "secondary" | "accent" | "image";
  isFirstBlock?: boolean;
}

export function CtaBox({
  heading,
  text,
  buttonText,
  buttonLink,
  backgroundImage,
  style = "primary",
  isFirstBlock = false,
}: CtaBoxProps) {
  const styleClasses = {
    primary: "bg-[var(--color-primary)] text-white",
    secondary: "bg-[var(--color-secondary)] text-[var(--color-text)]",
    accent: "bg-[var(--color-accent)] text-[var(--color-text)]",
    image: "text-white",
  };

  const buttonStyles = {
    primary: "btn-accent",
    secondary: "btn-primary",
    accent: "btn-primary",
    image: "btn-accent",
  };

  return (
    <section className={cn("relative overflow-hidden", styleClasses[style], isFirstBlock && "-mt-20 pt-40")}>
      {style === "image" && backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt={heading}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}

      <Container>
        <div className="relative z-10 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {text && (
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {text}
            </p>
          )}
          <Link href={buttonLink} className={cn("btn", buttonStyles[style])}>
            {buttonText}
          </Link>
        </div>
      </Container>
    </section>
  );
}
