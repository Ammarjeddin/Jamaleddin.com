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

export interface Block {
  _template: BlockType;
  [key: string]: unknown;
}

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const { _template, ...props } = block;

        // Cast props to unknown first to satisfy TypeScript strict mode
        const blockProps = props as unknown;

        switch (_template) {
          case "textBlock":
            return <TextBlock key={index} {...(blockProps as React.ComponentProps<typeof TextBlock>)} />;

          case "heroBanner":
            return <HeroBanner key={index} {...(blockProps as React.ComponentProps<typeof HeroBanner>)} />;

          case "imageTextLeft":
            return <ImageTextLeft key={index} {...(blockProps as React.ComponentProps<typeof ImageTextLeft>)} />;

          case "imageTextRight":
            return <ImageTextRight key={index} {...(blockProps as React.ComponentProps<typeof ImageTextRight>)} />;

          case "cardsGrid":
            return <CardsGrid key={index} {...(blockProps as React.ComponentProps<typeof CardsGrid>)} />;

          case "ctaBox":
            return <CtaBox key={index} {...(blockProps as React.ComponentProps<typeof CtaBox>)} />;

          case "faq":
            return <Faq key={index} {...(blockProps as React.ComponentProps<typeof Faq>)} />;

          case "imageGallery":
            return <ImageGallery key={index} {...(blockProps as React.ComponentProps<typeof ImageGallery>)} />;

          case "contactInfo":
            return <ContactInfo key={index} {...(blockProps as React.ComponentProps<typeof ContactInfo>)} />;

          case "stats":
            return <Stats key={index} {...(blockProps as React.ComponentProps<typeof Stats>)} />;

          case "testimonials":
            return <Testimonials key={index} {...(blockProps as React.ComponentProps<typeof Testimonials>)} />;

          case "video":
            return <Video key={index} {...(blockProps as React.ComponentProps<typeof Video>)} />;

          case "timeline":
            return <Timeline key={index} {...(blockProps as React.ComponentProps<typeof Timeline>)} />;

          case "team":
            return <Team key={index} {...(blockProps as React.ComponentProps<typeof Team>)} />;

          case "divider":
            return <Divider key={index} {...(blockProps as React.ComponentProps<typeof Divider>)} />;

          case "productGrid":
            return <ProductGrid key={index} {...(blockProps as React.ComponentProps<typeof ProductGrid>)} />;

          case "productShowcase":
            return <ProductShowcase key={index} {...(blockProps as React.ComponentProps<typeof ProductShowcase>)} />;

          default:
            console.warn(`Unknown block type: ${_template}`);
            return null;
        }
      })}
    </>
  );
}
