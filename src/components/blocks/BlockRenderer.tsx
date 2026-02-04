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
import { ClientBlockWrapper } from "./ClientBlockWrapper";
// Note: ProductGrid and ProductShowcase are excluded - they use fs and must be rendered
// separately in page components that need them, not through this dynamic block renderer

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

function renderBlock(block: Block, index: number, hasHero: boolean) {
  const { _template, colorSettings, ...props } = block;

  // Cast props to unknown first to satisfy TypeScript strict mode
  const blockProps = props as unknown;

  // Add negative margin to first block so it extends behind the navbar
  // Skip this when blocks follow a hero section
  const isFirstBlock = index === 0 && !hasHero;
  const firstBlockProps = isFirstBlock ? { ...(blockProps as object), isFirstBlock } : blockProps;

  let content: React.ReactNode = null;

  switch (_template) {
    case "textBlock":
      content = <TextBlock {...(firstBlockProps as React.ComponentProps<typeof TextBlock>)} />;
      break;

    case "heroBanner":
      content = <HeroBanner {...(firstBlockProps as React.ComponentProps<typeof HeroBanner>)} />;
      break;

    case "imageTextLeft":
      content = <ImageTextLeft {...(firstBlockProps as React.ComponentProps<typeof ImageTextLeft>)} />;
      break;

    case "imageTextRight":
      content = <ImageTextRight {...(firstBlockProps as React.ComponentProps<typeof ImageTextRight>)} />;
      break;

    case "cardsGrid":
      content = <CardsGrid {...(firstBlockProps as React.ComponentProps<typeof CardsGrid>)} />;
      break;

    case "ctaBox":
      content = <CtaBox {...(firstBlockProps as React.ComponentProps<typeof CtaBox>)} />;
      break;

    case "faq":
      content = <Faq {...(firstBlockProps as React.ComponentProps<typeof Faq>)} />;
      break;

    case "imageGallery":
      content = <ImageGallery {...(firstBlockProps as React.ComponentProps<typeof ImageGallery>)} />;
      break;

    case "contactInfo":
      content = <ContactInfo {...(firstBlockProps as React.ComponentProps<typeof ContactInfo>)} />;
      break;

    case "stats":
      content = <Stats {...(firstBlockProps as React.ComponentProps<typeof Stats>)} />;
      break;

    case "testimonials":
      content = <Testimonials {...(firstBlockProps as React.ComponentProps<typeof Testimonials>)} />;
      break;

    case "video":
      content = <Video {...(firstBlockProps as React.ComponentProps<typeof Video>)} />;
      break;

    case "timeline":
      content = <Timeline {...(firstBlockProps as React.ComponentProps<typeof Timeline>)} />;
      break;

    case "team":
      content = <Team {...(firstBlockProps as React.ComponentProps<typeof Team>)} />;
      break;

    case "divider":
      content = <Divider {...(firstBlockProps as React.ComponentProps<typeof Divider>)} />;
      break;

    case "productGrid":
    case "productShowcase":
      // These blocks use fs module and cannot be rendered through BlockRenderer
      // They should be rendered directly in page components that need them
      console.warn(`Block type "${_template}" requires server-side fs access and cannot be rendered through BlockRenderer`);
      return null;

    default:
      console.warn(`Unknown block type: ${_template}`);
      return null;
  }

  return (
    <ClientBlockWrapper key={index} blockType={_template} index={index}>
      <BlockColorWrapper colorSettings={colorSettings}>
        {content}
      </BlockColorWrapper>
    </ClientBlockWrapper>
  );
}

export function BlockRenderer({ blocks, hasHero = false }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => renderBlock(block, index, hasHero))}
    </>
  );
}
