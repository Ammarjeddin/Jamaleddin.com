import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

interface TextBlockProps {
  heading?: string;
  content?: string;
  alignment?: "left" | "center" | "right";
}

export function TextBlock({ heading, content, alignment = "left" }: TextBlockProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <section className="section">
      <Container size="narrow">
        <div className={cn("max-w-3xl", alignmentClasses[alignment])}>
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          )}
          {content && (
            <div
              className="prose prose-lg max-w-none text-[var(--color-text-muted)]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
