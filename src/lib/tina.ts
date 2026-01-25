import fs from "fs";
import path from "path";

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

export async function getSiteSettings(): Promise<{ data: { siteSettings: SiteSettings } }> {
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
}

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
