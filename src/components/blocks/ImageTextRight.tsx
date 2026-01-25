import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

interface ImageTextRightProps {
  image: string;
  imageAlt?: string;
  heading: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  isFirstBlock?: boolean;
}

export function ImageTextRight({
  image,
  imageAlt = "",
  heading,
  content,
  buttonText,
  buttonLink,
  isFirstBlock = false,
}: ImageTextRightProps) {
  return (
    <section className={cn("section dark:bg-slate-900", isFirstBlock && "-mt-20 pt-40")}>
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">{heading}</h2>
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

          {/* Image */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg dark:shadow-black/30 order-1 md:order-2">
            <Image
              src={image}
              alt={imageAlt || heading}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
