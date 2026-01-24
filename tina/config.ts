import { defineConfig } from "tinacms";
import { siteSettingsCollection } from "./collections/settings";
import { pagesCollection } from "./collections/pages";
import { homeCollection } from "./collections/home";
import { productsCollection } from "./collections/products";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [siteSettingsCollection, pagesCollection, homeCollection, productsCollection],
  },
});
