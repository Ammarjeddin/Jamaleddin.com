import { TextBlock } from "./TextBlock";
import { HeroBanner } from "./HeroBanner";
import { ImageTextLeft } from "./ImageTextLeft";
import { ImageTextRight } from "./ImageTextRight";
import { CardsGrid } from "./CardsGrid";
import { CtaBox } from "./CtaBox";
import { Faq } from "./Faq";
import { ImageGallery } from "./ImageGallery";
import { ContactInfo } from "./ContactInfo";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import { Video } from "./Video";
import { Timeline } from "./Timeline";
import { Team } from "./Team";
import { Divider } from "./Divider";
import { ProductGrid } from "./ProductGrid";
import { ProductShowcase } from "./ProductShowcase";

// Block type definitions
export type BlockType =
  | "textBlock"
  | "heroBanner"
  | "imageTextLeft"
  | "imageTextRight"
  | "cardsGrid"
  | "ctaBox"
  | "faq"
  | "imageGallery"
  | "contactInfo"
  | "stats"
  | "testimonials"
  | "video"
  | "timeline"
  | "team"
  | "divider"
  | "productGrid"
  | "productShowcase";

// Color settings for light/dark mode
export interface BlockColorSettings {
  light?: {
    textColor?: string;
    backgroundColor?: string;
    headingColor?: string;
  };
  dark?: {
    textColor?: string;
    backgroundColor?: string;
    headingColor?: string;
  };
}

export interface Block {
  _template: BlockType;
  colorSettings?: BlockColorSettings;
  [key: string]: unknown;
}

// Wrapper component that applies custom color CSS variables
function BlockColorWrapper({
  colorSettings,
  children,
}: {
  colorSettings?: BlockColorSettings;
  children: React.ReactNode;
}) {
  if (!colorSettings) {
    return <>{children}</>;
  }

  const lightStyles: Record<string, string> = {};
  const darkStyles: Record<string, string> = {};

  if (colorSettings.light) {
    if (colorSettings.light.textColor) lightStyles["--block-text-color"] = colorSettings.light.textColor;
    if (colorSettings.light.backgroundColor) lightStyles["--block-bg-color"] = colorSettings.light.backgroundColor;
    if (colorSettings.light.headingColor) lightStyles["--block-heading-color"] = colorSettings.light.headingColor;
  }

  if (colorSettings.dark) {
    if (colorSettings.dark.textColor) darkStyles["--block-text-color"] = colorSettings.dark.textColor;
    if (colorSettings.dark.backgroundColor) darkStyles["--block-bg-color"] = colorSettings.dark.backgroundColor;
    if (colorSettings.dark.headingColor) darkStyles["--block-heading-color"] = colorSettings.dark.headingColor;
  }

  // Create style tag content for light/dark mode
  const hasLightStyles = Object.keys(lightStyles).length > 0;
  const hasDarkStyles = Object.keys(darkStyles).length > 0;

  if (!hasLightStyles && !hasDarkStyles) {
    return <>{children}</>;
  }

  return (
    <div
      className="block-color-wrapper"
      style={lightStyles as React.CSSProperties}
      data-dark-styles={hasDarkStyles ? JSON.stringify(darkStyles) : undefined}
    >
      <style>{`
        .dark .block-color-wrapper[data-dark-styles] {
          ${Object.entries(darkStyles).map(([key, value]) => `${key}: ${value};`).join("\n          ")}
        }
        .block-color-wrapper [class*="text-[var(--color-text)"] {
          color: var(--block-text-color, var(--color-text));
        }
        .block-color-wrapper h1, .block-color-wrapper h2, .block-color-wrapper h3 {
          color: var(--block-heading-color, var(--block-text-color, var(--color-text)));
        }
      `}</style>
      {children}
    </div>
  );
}

interface BlockRendererProps {
  blocks: Block[];
  /** When true, skips the isFirstBlock styling (e.g. when blocks follow a hero section) */
  hasHero?: boolean;
}

export function BlockRenderer({ blocks, hasHero = false }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const { _template, colorSettings, ...props } = block;

        // Cast props to unknown first to satisfy TypeScript strict mode
        const blockProps = props as unknown;

        // Add negative margin to first block so it extends behind the navbar
        // Skip this when blocks follow a hero section
        const isFirstBlock = index === 0 && !hasHero;
        const firstBlockProps = isFirstBlock ? { ...(blockProps as object), isFirstBlock } : blockProps;

        const renderBlock = () => {
          switch (_template) {
            case "textBlock":
              return <TextBlock {...(firstBlockProps as React.ComponentProps<typeof TextBlock>)} />;

            case "heroBanner":
              return <HeroBanner {...(firstBlockProps as React.ComponentProps<typeof HeroBanner>)} />;

            case "imageTextLeft":
              return <ImageTextLeft {...(firstBlockProps as React.ComponentProps<typeof ImageTextLeft>)} />;

            case "imageTextRight":
              return <ImageTextRight {...(firstBlockProps as React.ComponentProps<typeof ImageTextRight>)} />;

            case "cardsGrid":
              return <CardsGrid {...(firstBlockProps as React.ComponentProps<typeof CardsGrid>)} />;

            case "ctaBox":
              return <CtaBox {...(firstBlockProps as React.ComponentProps<typeof CtaBox>)} />;

            case "faq":
              return <Faq {...(firstBlockProps as React.ComponentProps<typeof Faq>)} />;

            case "imageGallery":
              return <ImageGallery {...(firstBlockProps as React.ComponentProps<typeof ImageGallery>)} />;

            case "contactInfo":
              return <ContactInfo {...(firstBlockProps as React.ComponentProps<typeof ContactInfo>)} />;

            case "stats":
              return <Stats {...(firstBlockProps as React.ComponentProps<typeof Stats>)} />;

            case "testimonials":
              return <Testimonials {...(firstBlockProps as React.ComponentProps<typeof Testimonials>)} />;

            case "video":
              return <Video {...(firstBlockProps as React.ComponentProps<typeof Video>)} />;

            case "timeline":
              return <Timeline {...(firstBlockProps as React.ComponentProps<typeof Timeline>)} />;

            case "team":
              return <Team {...(firstBlockProps as React.ComponentProps<typeof Team>)} />;

            case "divider":
              return <Divider {...(firstBlockProps as React.ComponentProps<typeof Divider>)} />;

            case "productGrid":
              return <ProductGrid {...(firstBlockProps as React.ComponentProps<typeof ProductGrid>)} />;

            case "productShowcase":
              return <ProductShowcase {...(firstBlockProps as React.ComponentProps<typeof ProductShowcase>)} />;

            default:
              console.warn(`Unknown block type: ${_template}`);
              return null;
          }
        };

        return (
          <BlockColorWrapper key={index} colorSettings={colorSettings}>
            {renderBlock()}
          </BlockColorWrapper>
        );
      })}
    </>
  );
}
