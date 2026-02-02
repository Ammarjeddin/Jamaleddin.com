import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

interface TextBlockProps {
  heading?: string;
  content?: string;
  alignment?: "left" | "center" | "right";
  isFirstBlock?: boolean;
}

export function TextBlock({ heading, content, alignment = "left", isFirstBlock = false }: TextBlockProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <section className={cn("section glass", isFirstBlock && "-mt-20 pt-36 sm:pt-40")}>
      <Container size="narrow">
        <div className={cn("max-w-3xl px-4 sm:px-0", alignmentClasses[alignment])}>
          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[var(--color-text)]">{heading}</h2>
          )}
          {content && (
            <div
              className="prose prose-sm sm:prose-lg max-w-none text-[var(--color-text-muted)] dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
