// tina/config.ts
import { defineConfig } from "tinacms";

// tina/collections/settings.ts
var siteSettingsCollection = {
  name: "siteSettings",
  label: "Site Settings",
  path: "content/settings",
  format: "json",
  ui: {
    allowedActions: { create: false, delete: false },
    global: true
  },
  fields: [
    // Branding
    {
      type: "string",
      name: "siteName",
      label: "Site Name",
      required: true
    },
    {
      type: "string",
      name: "tagline",
      label: "Tagline"
    },
    {
      type: "object",
      name: "logo",
      label: "Logo",
      fields: [
        { type: "image", name: "main", label: "Main Logo" },
        { type: "image", name: "icon", label: "Favicon/Icon" },
        {
          type: "image",
          name: "light",
          label: "Light Version (for dark backgrounds)"
        }
      ]
    },
    // Theme Colors
    {
      type: "object",
      name: "theme",
      label: "Theme Colors",
      fields: [
        {
          type: "string",
          name: "primaryColor",
          label: "Primary Color",
          ui: { component: "color" }
        },
        {
          type: "string",
          name: "secondaryColor",
          label: "Secondary Color",
          ui: { component: "color" }
        },
        {
          type: "string",
          name: "accentColor",
          label: "Accent Color",
          ui: { component: "color" }
        },
        {
          type: "string",
          name: "backgroundColor",
          label: "Background Color",
          ui: { component: "color" }
        },
        {
          type: "string",
          name: "textColor",
          label: "Text Color",
          ui: { component: "color" }
        }
      ]
    },
    // Typography
    {
      type: "object",
      name: "fonts",
      label: "Typography",
      fields: [
        {
          type: "string",
          name: "pairing",
          label: "Font Pairing",
          options: [
            { value: "modern", label: "Modern (Plus Jakarta Sans + Inter)" },
            {
              value: "classic",
              label: "Classic (Playfair Display + Source Sans Pro)"
            },
            { value: "clean", label: "Clean (Montserrat + Open Sans)" },
            { value: "friendly", label: "Friendly (Nunito + Lato)" },
            { value: "professional", label: "Professional (Raleway + Roboto)" },
            {
              value: "elegant",
              label: "Elegant (Cormorant Garamond + Proza Libre)"
            }
          ]
        }
      ]
    },
    // Layout Options
    {
      type: "object",
      name: "layout",
      label: "Layout Options",
      fields: [
        {
          type: "string",
          name: "homepage",
          label: "Homepage Layout",
          options: [
            { value: "standard", label: "Standard" },
            { value: "hero-full", label: "Full-screen Hero" },
            { value: "minimal", label: "Minimal" }
          ]
        },
        {
          type: "string",
          name: "navbar",
          label: "Navbar Style",
          options: [
            { value: "floating", label: "Floating" },
            { value: "fixed", label: "Fixed" },
            { value: "transparent", label: "Transparent" }
          ]
        },
        {
          type: "string",
          name: "footer",
          label: "Footer Style",
          options: [
            { value: "full", label: "Full" },
            { value: "minimal", label: "Minimal" },
            { value: "centered", label: "Centered" }
          ]
        }
      ]
    },
    // Social Links
    {
      type: "object",
      name: "social",
      label: "Social Media Links",
      fields: [
        { type: "string", name: "facebook", label: "Facebook URL" },
        { type: "string", name: "instagram", label: "Instagram URL" },
        { type: "string", name: "twitter", label: "Twitter/X URL" },
        { type: "string", name: "linkedin", label: "LinkedIn URL" },
        { type: "string", name: "youtube", label: "YouTube URL" },
        { type: "string", name: "tiktok", label: "TikTok URL" }
      ]
    },
    // Contact Info
    {
      type: "object",
      name: "contact",
      label: "Contact Information",
      fields: [
        { type: "string", name: "email", label: "Email" },
        { type: "string", name: "phone", label: "Phone" },
        { type: "string", name: "address", label: "Address", ui: { component: "textarea" } }
      ]
    },
    // Analytics
    {
      type: "object",
      name: "analytics",
      label: "Analytics",
      fields: [
        { type: "string", name: "googleAnalyticsId", label: "Google Analytics ID" },
        { type: "string", name: "facebookPixelId", label: "Facebook Pixel ID" },
        { type: "string", name: "plausibleDomain", label: "Plausible Domain" }
      ]
    },
    // SEO Defaults
    {
      type: "object",
      name: "seo",
      label: "SEO Defaults",
      fields: [
        {
          type: "string",
          name: "titleTemplate",
          label: "Title Template",
          description: 'e.g., "%s | Your Site Name"'
        },
        {
          type: "string",
          name: "defaultDescription",
          label: "Default Description",
          ui: { component: "textarea" }
        },
        { type: "image", name: "defaultOgImage", label: "Default Social Image" }
      ]
    }
  ]
};

// tina/blocks.ts
var textBlock = {
  name: "textBlock",
  label: "Text Block",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "content", label: "Content" },
    {
      type: "string",
      name: "alignment",
      label: "Text Alignment",
      options: ["left", "center", "right"]
    }
  ]
};
var heroBanner = {
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
        { value: "full", label: "Full Screen (100vh)" }
      ]
    }
  ]
};
var imageTextLeft = {
  name: "imageTextLeft",
  label: "Image + Text (Image Left)",
  fields: [
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt Text" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "content", label: "Content" },
    { type: "string", name: "buttonText", label: "Button Text" },
    { type: "string", name: "buttonLink", label: "Button Link" }
  ]
};
var imageTextRight = {
  name: "imageTextRight",
  label: "Image + Text (Image Right)",
  fields: [
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt Text" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "content", label: "Content" },
    { type: "string", name: "buttonText", label: "Button Text" },
    { type: "string", name: "buttonLink", label: "Button Link" }
  ]
};
var cardsGrid = {
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
        { value: "4", label: "4 Columns" }
      ]
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
        { type: "string", name: "link", label: "Link URL" }
      ]
    }
  ]
};
var ctaBox = {
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
        { value: "image", label: "Image Background" }
      ]
    }
  ]
};
var faq = {
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
        { type: "rich-text", name: "answer", label: "Answer" }
      ]
    }
  ]
};
var imageGallery = {
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
        { value: "carousel", label: "Carousel" }
      ]
    },
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      fields: [
        { type: "image", name: "src", label: "Image" },
        { type: "string", name: "alt", label: "Alt Text" },
        { type: "string", name: "caption", label: "Caption" }
      ]
    }
  ]
};
var contactInfo = {
  name: "contactInfo",
  label: "Contact Information",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "boolean", name: "showForm", label: "Show Contact Form" },
    { type: "boolean", name: "showMap", label: "Show Map" },
    { type: "string", name: "mapEmbedUrl", label: "Google Maps Embed URL" }
  ]
};
var stats = {
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
        { type: "string", name: "icon", label: "Icon (Lucide icon name)" }
      ]
    }
  ]
};
var testimonials = {
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
        { value: "grid", label: "Grid" }
      ]
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
        { type: "image", name: "avatar", label: "Avatar" }
      ]
    }
  ]
};
var video = {
  name: "video",
  label: "Video Section",
  fields: [
    { type: "string", name: "heading", label: "Section Heading" },
    { type: "string", name: "videoUrl", label: "Video URL (YouTube/Vimeo)" },
    { type: "image", name: "thumbnail", label: "Custom Thumbnail" },
    { type: "string", name: "caption", label: "Caption" }
  ]
};
var timeline = {
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
        { type: "image", name: "image", label: "Image" }
      ]
    }
  ]
};
var team = {
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
        { type: "string", name: "email", label: "Email" }
      ]
    }
  ]
};
var divider = {
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
        { value: "wave", label: "Wave" }
      ]
    },
    {
      type: "string",
      name: "size",
      label: "Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" }
      ]
    }
  ]
};
var blockTemplates = [
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
  divider
];

// tina/collections/pages.ts
var pagesCollection = {
  name: "pages",
  label: "Pages",
  path: "content/pages",
  format: "mdx",
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
      isTitle: true
    },
    {
      type: "string",
      name: "description",
      label: "SEO Description",
      ui: { component: "textarea" }
    },
    {
      type: "image",
      name: "ogImage",
      label: "Social Share Image"
    },
    {
      type: "object",
      name: "blocks",
      label: "Page Blocks",
      list: true,
      templates: blockTemplates
    }
  ]
};

// tina/collections/home.ts
var homeCollection = {
  name: "home",
  label: "Homepage",
  path: "content/home",
  format: "json",
  ui: {
    allowedActions: { create: false, delete: false }
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Page Title",
      required: true
    },
    {
      type: "string",
      name: "description",
      label: "SEO Description",
      ui: { component: "textarea" }
    },
    // Hero Section
    {
      type: "object",
      name: "hero",
      label: "Hero Section",
      fields: [
        {
          type: "object",
          name: "slides",
          label: "Hero Slides",
          list: true,
          fields: [
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "subtitle", label: "Subtitle" },
            { type: "image", name: "backgroundImage", label: "Background Image" },
            { type: "string", name: "buttonText", label: "Button Text" },
            { type: "string", name: "buttonLink", label: "Button Link" }
          ]
        }
      ]
    },
    // Page Blocks
    {
      type: "object",
      name: "blocks",
      label: "Page Sections",
      list: true,
      templates: blockTemplates
    }
  ]
};

// tina/config.ts
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [siteSettingsCollection, pagesCollection, homeCollection]
  }
});
export {
  config_default as default
};
