import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { cn } from "@/lib/utils/cn";

interface ImageTextLeftProps {
  image: string;
  imageAlt?: string;
  heading: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  isFirstBlock?: boolean;
}

export function ImageTextLeft({
  image,
  imageAlt = "",
  heading,
  content,
  buttonText,
  buttonLink,
  isFirstBlock = false,
}: ImageTextLeftProps) {
  return (
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center px-4 sm:px-0">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shadow-lg dark:shadow-black/30">
            <Image
              src={image}
              alt={imageAlt || heading}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[var(--color-text)]">{heading}</h2>
            {content && (
              <SafeHtml
                html={content}
                className="prose prose-sm sm:prose-lg text-[var(--color-text-muted)] dark:prose-invert mb-6 sm:mb-8"
              />
            )}
            {buttonText && buttonLink && (
              <Link href={buttonLink} className="btn btn-primary w-full sm:w-auto">
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
