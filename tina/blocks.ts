import type { Template } from "tinacms";

// Text Block
const textBlock: Template = {
  name: "textBlock",
  label: "Text Block",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "content", label: "Content" },
    {
      type: "string",
      name: "alignment",
      label: "Text Alignment",
      options: ["left", "center", "right"],
    },
  ],
};

// Hero Banner
const heroBanner: Template = {
  name: "heroBanner",
  label: "Hero Banner",
  fields: [
    { type: "string", name: "title", label: "Title" },
    { type: "string", name: "subtitle", label: "Subtitle" },
    { type: "image", name: "backgroundImage", label: "Background Image" },
    { type: "string", name: "buttonText", label: "Button Text" },
    { type: "string", name: "buttonLink", label: "Button Link" },
    {
      type: "string",
      name: "height",
      label: "Height",
      options: [
        { value: "small", label: "Small (40vh)" },
        { value: "medium", label: "Medium (60vh)" },
        { value: "large", label: "Large (80vh)" },
        { value: "full", label: "Full Screen (100vh)" },
      ],
    },
  ],
};

// Image + Text (Left)
const imageTextLeft: Template = {
  name: "imageTextLeft",
  label: "Image + Text (Image Left)",
  fields: [
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt Text" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "content", label: "Content" },
    { type: "string", name: "buttonText", label: "Button Text" },
    { type: "string", name: "buttonLink", label: "Button Link" },
  ],
};

// Image + Text (Right)
const imageTextRight: Template = {
  name: "imageTextRight",
  label: "Image + Text (Image Right)",
  fields: [
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt Text" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "content", label: "Content" },
    { type: "string", name: "buttonText", label: "Button Text" },
    { type: "string", name: "buttonLink", label: "Button Link" },
  ],
};

// Cards Grid
const cardsGrid: Template = {
  name: "cardsGrid",
  label: "Cards Grid",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "subheading", label: "Section Subheading" },
    {
      type: "string",
      name: "columns",
      label: "Columns",
      options: [
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" },
      ],
    },
    {
      type: "object",
      name: "cards",
      label: "Cards",
      list: true,
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "image", name: "image", label: "Image" },
        { type: "string", name: "icon", label: "Icon (Lucide icon name)" },
        { type: "string", name: "link", label: "Link URL" },
      ],
    },
  ],
};

// CTA Box
const ctaBox: Template = {
  name: "ctaBox",
  label: "Call to Action Box",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "text", label: "Text" },
    { type: "string", name: "buttonText", label: "Button Text" },
    { type: "string", name: "buttonLink", label: "Button Link" },
    { type: "image", name: "backgroundImage", label: "Background Image" },
    {
      type: "string",
      name: "style",
      label: "Style",
      options: [
        { value: "primary", label: "Primary Color Background" },
        { value: "secondary", label: "Secondary Color Background" },
        { value: "accent", label: "Accent Color Background" },
        { value: "image", label: "Image Background" },
      ],
    },
  ],
};

// FAQ
const faq: Template = {
  name: "faq",
  label: "FAQ Section",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "items",
      label: "FAQ Items",
      list: true,
      fields: [
        { type: "string", name: "question", label: "Question" },
        { type: "rich-text", name: "answer", label: "Answer" },
      ],
    },
  ],
};

// Image Gallery
const imageGallery: Template = {
  name: "imageGallery",
  label: "Image Gallery",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "string",
      name: "layout",
      label: "Layout",
      options: [
        { value: "grid", label: "Grid" },
        { value: "masonry", label: "Masonry" },
        { value: "carousel", label: "Carousel" },
      ],
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      fields: [
        { type: "image", name: "src", label: "Image" },
        { type: "string", name: "alt", label: "Alt Text" },
        { type: "string", name: "caption", label: "Caption" },
      ],
    },
  ],
};

// Contact Info
const contactInfo: Template = {
  name: "contactInfo",
  label: "Contact Information",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "boolean", name: "showForm", label: "Show Contact Form" },
    { type: "boolean", name: "showMap", label: "Show Map" },
    { type: "string", name: "mapEmbedUrl", label: "Google Maps Embed URL" },
  ],
};

// Stats
const stats: Template = {
  name: "stats",
  label: "Statistics Section",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "stats",
      label: "Statistics",
      list: true,
      fields: [
        { type: "string", name: "number", label: "Number/Value" },
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "icon", label: "Icon (Lucide icon name)" },
      ],
    },
  ],
};

// Testimonials
const testimonials: Template = {
  name: "testimonials",
  label: "Testimonials",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "string",
      name: "layout",
      label: "Layout",
      options: [
        { value: "carousel", label: "Carousel" },
        { value: "grid", label: "Grid" },
      ],
    },
    {
      type: "object",
      name: "items",
      label: "Testimonials",
      list: true,
      fields: [
        { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } },
        { type: "string", name: "author", label: "Author Name" },
        { type: "string", name: "role", label: "Role/Title" },
        { type: "image", name: "avatar", label: "Avatar" },
      ],
    },
  ],
};

// Video
const video: Template = {
  name: "video",
  label: "Video Section",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "videoUrl", label: "Video URL (YouTube/Vimeo)" },
    { type: "image", name: "thumbnail", label: "Custom Thumbnail" },
    { type: "string", name: "caption", label: "Caption" },
  ],
};

// Timeline
const timeline: Template = {
  name: "timeline",
  label: "Timeline",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    {
      type: "object",
      name: "items",
      label: "Timeline Items",
      list: true,
      fields: [
        { type: "string", name: "year", label: "Year/Date" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "image", name: "image", label: "Image" },
      ],
    },
  ],
};

// Team
const team: Template = {
  name: "team",
  label: "Team Section",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "subheading", label: "Subheading" },
    {
      type: "object",
      name: "members",
      label: "Team Members",
      list: true,
      fields: [
        { type: "string", name: "name", label: "Name" },
        { type: "string", name: "role", label: "Role/Title" },
        { type: "image", name: "photo", label: "Photo" },
        { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
        { type: "string", name: "linkedin", label: "LinkedIn URL" },
        { type: "string", name: "twitter", label: "Twitter URL" },
        { type: "string", name: "email", label: "Email" },
      ],
    },
  ],
};

// Divider
const divider: Template = {
  name: "divider",
  label: "Divider",
  fields: [
    {
      type: "string",
      name: "style",
      label: "Style",
      options: [
        { value: "line", label: "Line" },
        { value: "dots", label: "Dots" },
        { value: "space", label: "Space Only" },
        { value: "wave", label: "Wave" },
      ],
    },
    {
      type: "string",
      name: "size",
      label: "Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
  ],
};

// Product Grid (Shop)
const productGrid: Template = {
  name: "productGrid",
  label: "Product Grid",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "subheading", label: "Section Subheading" },
    {
      type: "string",
      name: "displayMode",
      label: "Display Mode",
      options: [
        { value: "all", label: "All Products" },
        { value: "featured", label: "Featured Only" },
        { value: "category", label: "Specific Category" },
      ],
    },
    { type: "string", name: "category", label: "Category (if Display Mode is Category)" },
    { type: "number", name: "maxProducts", label: "Max Products to Show" },
    {
      type: "string",
      name: "columns",
      label: "Grid Columns",
      options: [
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" },
      ],
    },
  ],
};

// Product Showcase (Shop)
const productShowcase: Template = {
  name: "productShowcase",
  label: "Product Showcase",
  fields: [
    { type: "string", name: "heading", label: "Eyebrow Text" },
    { type: "string", name: "productSlug", label: "Product Slug" },
    {
      type: "string",
      name: "layout",
      label: "Layout",
      options: [
        { value: "left", label: "Image Left" },
        { value: "right", label: "Image Right" },
      ],
    },
    {
      type: "string",
      name: "backgroundColor",
      label: "Background Color",
      options: [
        { value: "white", label: "White" },
        { value: "gray", label: "Gray" },
        { value: "primary", label: "Primary Color" },
      ],
    },
  ],
};

export const blockTemplates: Template[] = [
  textBlock,
  heroBanner,
  imageTextLeft,
  imageTextRight,
  cardsGrid,
  ctaBox,
  faq,
  imageGallery,
  contactInfo,
  stats,
  testimonials,
  video,
  timeline,
  team,
  divider,
  productGrid,
  productShowcase,
];
