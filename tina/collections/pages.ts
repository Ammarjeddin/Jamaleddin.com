import type { Collection } from "tinacms";
import { blockTemplates } from "../blocks";

export const pagesCollection: Collection = {
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
      isTitle: true,
    },
    {
      type: "string",
      name: "description",
      label: "SEO Description",
      ui: { component: "textarea" },
    },
    {
      type: "image",
      name: "ogImage",
      label: "Social Share Image",
    },
    {
      type: "object",
      name: "blocks",
      label: "Page Blocks",
      list: true,
      templates: blockTemplates,
    },
  ],
};
