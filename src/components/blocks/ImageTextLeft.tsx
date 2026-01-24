import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface ImageTextLeftProps {
  image: string;
  imageAlt?: string;
  heading: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function ImageTextLeft({
  image,
  imageAlt = "",
  heading,
  content,
  buttonText,
  buttonLink,
}: ImageTextLeftProps) {
  return (
    <section className="section">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={image}
              alt={imageAlt || heading}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
            {content && (
              <div
                className="prose prose-lg text-[var(--color-text-muted)] mb-8"
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
