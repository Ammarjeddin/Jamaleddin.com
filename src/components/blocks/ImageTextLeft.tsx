import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
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
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-40")}>
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg dark:shadow-black/30">
            <Image
              src={image}
              alt={imageAlt || heading}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-text)]">{heading}</h2>
            {content && (
              <div
                className="prose prose-lg text-[var(--color-text-muted)] dark:prose-invert mb-8"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            {buttonText && buttonLink && (
              <Link href={buttonLink} className="btn btn-primary">
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
