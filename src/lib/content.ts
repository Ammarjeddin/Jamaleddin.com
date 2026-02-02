import fs from "fs";
import path from "path";
import { cache } from "react";

// Draft system constants
const DRAFTS_DIR = ".drafts";
const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ShopFeatureSettings {
  enabled?: boolean;
  currency?: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  productsPerPage?: number;
  gridColumns?: "2" | "3" | "4";
}

export interface TemplateFeatures {
  shop?: ShopFeatureSettings;
  programs?: { enabled?: boolean };
  events?: { enabled?: boolean };
}

export interface TemplateSettings {
  type?: "organization" | "company";
  features?: TemplateFeatures;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SiteSettings {
  template?: TemplateSettings;
  siteName: string;
  tagline?: string;
  logo?: {
    main?: string;
    dark?: string;
    icon?: string;
    light?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  fonts?: {
    pairing?: string;
  };
  layout?: {
    homepage?: string;
    navbar?: string;
    footer?: string;
    navbarButton?: {
      enabled?: boolean;
      text?: string;
      href?: string;
    };
  };
  navigation?: NavigationItem[];
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    plausibleDomain?: string;
  };
  seo?: {
    titleTemplate?: string;
    defaultDescription?: string;
    defaultOgImage?: string;
  };
}

const defaultSettings: SiteSettings = {
  template: {
    type: "organization",
    features: {
      shop: { enabled: false, currency: "USD", productsPerPage: 12, gridColumns: "3" },
      programs: { enabled: true },
      events: { enabled: true },
    },
  },
  siteName: "Site Template",
  tagline: "Your tagline here",
  theme: {
    primaryColor: "#476A7D",
    secondaryColor: "#A4C685",
    accentColor: "#E8B54D",
    backgroundColor: "#F8FAF9",
    textColor: "#1a1a1a",
  },
  fonts: {
    pairing: "modern",
  },
  layout: {
    homepage: "standard",
    navbar: "floating",
    footer: "full",
  },
};

export const getSiteSettings = cache(async (): Promise<{ data: { siteSettings: SiteSettings } }> => {
  try {
    const settingsPath = path.join(process.cwd(), "content/settings/site.json");
    const fileContent = fs.readFileSync(settingsPath, "utf-8");
    const settings = JSON.parse(fileContent) as SiteSettings;

    return {
      data: {
        siteSettings: settings,
      },
    };
  } catch (error) {
    console.error("Error reading site settings:", error);
    return {
      data: {
        siteSettings: defaultSettings,
      },
    };
  }
});

export async function getHomeContent() {
  try {
    const homePath = path.join(process.cwd(), "content/home/index.json");
    const fileContent = fs.readFileSync(homePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading home content:", error);
    return null;
  }
}

export interface PageContent {
  title: string;
  description?: string;
  blocks?: Array<{ _template: string; [key: string]: unknown }>;
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  try {
    const pagePath = path.join(process.cwd(), `content/pages/${slug}.json`);
    const fileContent = fs.readFileSync(pagePath, "utf-8");
    return JSON.parse(fileContent) as PageContent;
  } catch (error) {
    console.error(`Error reading page content for ${slug}:`, error);
    return null;
  }
}

export interface ProgramContent extends PageContent {
  icon?: string;
  featured?: boolean;
}

export async function getProgramContent(slug: string): Promise<ProgramContent | null> {
  try {
    const programPath = path.join(process.cwd(), `content/programs/${slug}.json`);
    const fileContent = fs.readFileSync(programPath, "utf-8");
    return JSON.parse(fileContent) as ProgramContent;
  } catch (error) {
    console.error(`Error reading program content for ${slug}:`, error);
    return null;
  }
}

export async function getAllPrograms(): Promise<Array<{ slug: string; content: ProgramContent }>> {
  try {
    const programsDir = path.join(process.cwd(), "content/programs");
    const files = fs.readdirSync(programsDir).filter((f) => f.endsWith(".json"));

    return files.map((file) => {
      const slug = file.replace(".json", "");
      const content = JSON.parse(
        fs.readFileSync(path.join(programsDir, file), "utf-8")
      ) as ProgramContent;
      return { slug, content };
    });
  } catch (error) {
    console.error("Error reading programs:", error);
    return [];
  }
}

// ============================================================================
// DRAFT SYSTEM FUNCTIONS
// ============================================================================

export interface DraftInfo {
  filePath: string;
  collection: string;
  slug: string;
  title?: string;
  draftModified: string;
  liveModified?: string;
  hasDraft: boolean;
  hasLive: boolean;
}

/**
 * Get the draft path for a content file
 */
export function getDraftPath(contentPath: string): string {
  // contentPath is like "content/pages/about.json"
  // draftPath should be "content/.drafts/pages/about.json"
  const relativePath = contentPath.replace(/^content\//, "");
  return path.join(CONTENT_DIR, DRAFTS_DIR, relativePath);
}

/**
 * Get the live path from a draft path
 */
export function getLivePathFromDraft(draftPath: string): string {
  // Convert draft path back to live path
  return draftPath.replace(`/${DRAFTS_DIR}/`, "/");
}

/**
 * Check if a draft exists for a content file
 */
export function hasDraft(contentPath: string): boolean {
  const draftPath = getDraftPath(contentPath);
  return fs.existsSync(draftPath);
}

/**
 * Read draft content if it exists, otherwise return null
 */
export function readDraft(contentPath: string): Record<string, unknown> | null {
  const draftPath = getDraftPath(contentPath);
  if (!fs.existsSync(draftPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(draftPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Read live content if it exists, otherwise return null
 */
export function readLive(contentPath: string): Record<string, unknown> | null {
  const fullPath = path.join(process.cwd(), contentPath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Save content as draft (does not affect live content)
 */
export function saveDraft(contentPath: string, content: Record<string, unknown>): void {
  const draftPath = getDraftPath(contentPath);
  const draftDir = path.dirname(draftPath);

  // Ensure draft directory exists
  if (!fs.existsSync(draftDir)) {
    fs.mkdirSync(draftDir, { recursive: true });
  }

  fs.writeFileSync(draftPath, JSON.stringify(content, null, 2));
}

/**
 * Publish a draft (copy draft to live, then delete draft)
 */
export function publishDraft(contentPath: string): boolean {
  const draftPath = getDraftPath(contentPath);
  const livePath = path.join(process.cwd(), contentPath);

  if (!fs.existsSync(draftPath)) {
    return false;
  }

  try {
    const content = fs.readFileSync(draftPath, "utf-8");

    // Ensure live directory exists
    const liveDir = path.dirname(livePath);
    if (!fs.existsSync(liveDir)) {
      fs.mkdirSync(liveDir, { recursive: true });
    }

    // Write to live
    fs.writeFileSync(livePath, content);

    // Delete draft
    fs.unlinkSync(draftPath);

    // Clean up empty draft directories
    cleanEmptyDraftDirs(path.dirname(draftPath));

    return true;
  } catch (error) {
    console.error("Error publishing draft:", error);
    return false;
  }
}

/**
 * Discard a draft (delete without publishing)
 */
export function discardDraft(contentPath: string): boolean {
  const draftPath = getDraftPath(contentPath);

  if (!fs.existsSync(draftPath)) {
    return false;
  }

  try {
    fs.unlinkSync(draftPath);
    cleanEmptyDraftDirs(path.dirname(draftPath));
    return true;
  } catch (error) {
    console.error("Error discarding draft:", error);
    return false;
  }
}

/**
 * Clean up empty draft directories
 */
function cleanEmptyDraftDirs(dirPath: string): void {
  const draftsRoot = path.join(CONTENT_DIR, DRAFTS_DIR);

  // Don't go above the drafts root
  if (!dirPath.startsWith(draftsRoot) || dirPath === draftsRoot) {
    return;
  }

  try {
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) {
      fs.rmdirSync(dirPath);
      // Recursively clean parent
      cleanEmptyDraftDirs(path.dirname(dirPath));
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Get all pending drafts
 */
export function getAllDrafts(): DraftInfo[] {
  const drafts: DraftInfo[] = [];
  const draftsRoot = path.join(CONTENT_DIR, DRAFTS_DIR);

  if (!fs.existsSync(draftsRoot)) {
    return drafts;
  }

  function scanDir(dir: string, relativePath: string = "") {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const itemRelative = relativePath ? `${relativePath}/${item}` : item;
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanDir(itemPath, itemRelative);
      } else if (item.endsWith(".json")) {
        // This is a draft file
        const contentPath = `content/${itemRelative}`;
        const livePath = path.join(CONTENT_DIR, itemRelative);

        // Parse to get title
        let title: string | undefined;
        try {
          const content = JSON.parse(fs.readFileSync(itemPath, "utf-8"));
          title = content.title || content.siteName || content.name;
        } catch {
          // Ignore parse errors
        }

        // Get collection from path
        const parts = itemRelative.split("/");
        const collection = parts[0];
        const slug = parts[parts.length - 1].replace(".json", "");

        drafts.push({
          filePath: contentPath,
          collection,
          slug,
          title,
          draftModified: stat.mtime.toISOString(),
          liveModified: fs.existsSync(livePath)
            ? fs.statSync(livePath).mtime.toISOString()
            : undefined,
          hasDraft: true,
          hasLive: fs.existsSync(livePath),
        });
      }
    }
  }

  scanDir(draftsRoot);

  // Sort by modification date (newest first)
  drafts.sort((a, b) =>
    new Date(b.draftModified).getTime() - new Date(a.draftModified).getTime()
  );

  return drafts;
}

/**
 * Publish all pending drafts
 */
export function publishAllDrafts(): { published: string[]; failed: string[] } {
  const drafts = getAllDrafts();
  const published: string[] = [];
  const failed: string[] = [];

  for (const draft of drafts) {
    if (publishDraft(draft.filePath)) {
      published.push(draft.filePath);
    } else {
      failed.push(draft.filePath);
    }
  }

  return { published, failed };
}

/**
 * Get content with draft preference (returns draft if exists, otherwise live)
 */
export function getContentWithDraftPreference(contentPath: string): {
  content: Record<string, unknown> | null;
  isDraft: boolean;
} {
  const draft = readDraft(contentPath);
  if (draft) {
    return { content: draft, isDraft: true };
  }

  const live = readLive(contentPath);
  return { content: live, isDraft: false };
}
