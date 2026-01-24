import type { Collection } from "tinacms";

export const siteSettingsCollection: Collection = {
  name: "siteSettings",
  label: "Site Settings",
  path: "content/settings",
  format: "json",
  ui: {
    allowedActions: { create: false, delete: false },
    global: true,
  },
  fields: [
    // Template Configuration
    {
      type: "object",
      name: "template",
      label: "Template Configuration",
      fields: [
        {
          type: "string",
          name: "type",
          label: "Template Type",
          options: [
            { value: "organization", label: "Organization / Non-Profit" },
            { value: "company", label: "Company / Business" },
          ],
        },
        {
          type: "object",
          name: "features",
          label: "Features",
          fields: [
            {
              type: "object",
              name: "shop",
              label: "Shop / E-Commerce",
              fields: [
                {
                  type: "boolean",
                  name: "enabled",
                  label: "Enable Shop",
                },
                {
                  type: "string",
                  name: "currency",
                  label: "Currency",
                  options: [
                    { value: "USD", label: "USD ($)" },
                    { value: "EUR", label: "EUR (€)" },
                    { value: "GBP", label: "GBP (£)" },
                    { value: "CAD", label: "CAD ($)" },
                    { value: "AUD", label: "AUD ($)" },
                  ],
                },
                {
                  type: "number",
                  name: "productsPerPage",
                  label: "Products Per Page",
                },
                {
                  type: "string",
                  name: "gridColumns",
                  label: "Grid Columns",
                  options: [
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                    { value: "4", label: "4 Columns" },
                  ],
                },
              ],
            },
            {
              type: "object",
              name: "programs",
              label: "Programs",
              fields: [
                {
                  type: "boolean",
                  name: "enabled",
                  label: "Enable Programs",
                },
              ],
            },
            {
              type: "object",
              name: "events",
              label: "Events",
              fields: [
                {
                  type: "boolean",
                  name: "enabled",
                  label: "Enable Events",
                },
              ],
            },
          ],
        },
      ],
    },

    // Branding
    {
      type: "string",
      name: "siteName",
      label: "Site Name",
      required: true,
    },
    {
      type: "string",
      name: "tagline",
      label: "Tagline",
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
          label: "Light Version (for dark backgrounds)",
        },
      ],
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
          ui: { component: "color" },
        },
        {
          type: "string",
          name: "secondaryColor",
          label: "Secondary Color",
          ui: { component: "color" },
        },
        {
          type: "string",
          name: "accentColor",
          label: "Accent Color",
          ui: { component: "color" },
        },
        {
          type: "string",
          name: "backgroundColor",
          label: "Background Color",
          ui: { component: "color" },
        },
        {
          type: "string",
          name: "textColor",
          label: "Text Color",
          ui: { component: "color" },
        },
      ],
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
              label: "Classic (Playfair Display + Source Sans Pro)",
            },
            { value: "clean", label: "Clean (Montserrat + Open Sans)" },
            { value: "friendly", label: "Friendly (Nunito + Lato)" },
            { value: "professional", label: "Professional (Raleway + Roboto)" },
            {
              value: "elegant",
              label: "Elegant (Cormorant Garamond + Proza Libre)",
            },
          ],
        },
      ],
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
            { value: "minimal", label: "Minimal" },
          ],
        },
        {
          type: "string",
          name: "navbar",
          label: "Navbar Style",
          options: [
            { value: "floating", label: "Floating" },
            { value: "fixed", label: "Fixed" },
            { value: "transparent", label: "Transparent" },
          ],
        },
        {
          type: "string",
          name: "footer",
          label: "Footer Style",
          options: [
            { value: "full", label: "Full" },
            { value: "minimal", label: "Minimal" },
            { value: "centered", label: "Centered" },
          ],
        },
      ],
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
        { type: "string", name: "tiktok", label: "TikTok URL" },
      ],
    },

    // Contact Info
    {
      type: "object",
      name: "contact",
      label: "Contact Information",
      fields: [
        { type: "string", name: "email", label: "Email" },
        { type: "string", name: "phone", label: "Phone" },
        { type: "string", name: "address", label: "Address", ui: { component: "textarea" } },
      ],
    },

    // Analytics
    {
      type: "object",
      name: "analytics",
      label: "Analytics",
      fields: [
        { type: "string", name: "googleAnalyticsId", label: "Google Analytics ID" },
        { type: "string", name: "facebookPixelId", label: "Facebook Pixel ID" },
        { type: "string", name: "plausibleDomain", label: "Plausible Domain" },
      ],
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
          description: 'e.g., "%s | Your Site Name"',
        },
        {
          type: "string",
          name: "defaultDescription",
          label: "Default Description",
          ui: { component: "textarea" },
        },
        { type: "image", name: "defaultOgImage", label: "Default Social Image" },
      ],
    },
  ],
};
