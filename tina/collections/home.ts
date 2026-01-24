import type { Collection } from "tinacms";
import { blockTemplates } from "../blocks";

export const homeCollection: Collection = {
  name: "home",
  label: "Homepage",
  path: "content/home",
  format: "json",
  ui: {
    allowedActions: { create: false, delete: false },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Page Title",
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "SEO Description",
      ui: { component: "textarea" },
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
            { type: "string", name: "buttonLink", label: "Button Link" },
          ],
        },
      ],
    },
    // Page Blocks
    {
      type: "object",
      name: "blocks",
      label: "Page Sections",
      list: true,
      templates: blockTemplates,
    },
  ],
};
