import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";

// Helper to verify auth
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export interface ContentItem {
  name: string;
  slug: string;
  path: string;
  type: "file" | "directory";
  title?: string;
  description?: string;
  updatedAt?: string;
}

// GET - List content in a directory
export async function GET(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");

  if (!collection) {
    // Return available collections
    const collections = [
      { name: "Pages", path: "content/pages", icon: "file-text" },
      { name: "Programs", path: "content/programs", icon: "layout" },
      { name: "Products", path: "content/products", icon: "shopping-bag" },
      { name: "Settings", path: "content/settings", icon: "settings" },
      { name: "Homepage", path: "content/home", icon: "home" },
    ];
    return NextResponse.json({ collections });
  }

  // Map collection names to paths
  const collectionPaths: Record<string, string> = {
    pages: "content/pages",
    programs: "content/programs",
    products: "content/products",
    settings: "content/settings",
    home: "content/home",
  };

  const dirPath = collectionPaths[collection];
  if (!dirPath) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const fullPath = path.join(process.cwd(), dirPath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ items: [] });
    }

    const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".json"));

    const items: ContentItem[] = files.map((file) => {
      const filePath = path.join(fullPath, file);
      const stats = fs.statSync(filePath);
      const slug = file.replace(".json", "");

      // Try to read title from the file
      let title = slug;
      let description = "";
      try {
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        title = content.title || content.name || content.siteName || slug;
        description = content.description || content.tagline || "";
      } catch {
        // Ignore parsing errors
      }

      return {
        name: file,
        slug,
        path: `${dirPath}/${file}`,
        type: "file" as const,
        title,
        description,
        updatedAt: stats.mtime.toISOString(),
      };
    });

    // Sort by title
    items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error listing content:", error);
    return NextResponse.json(
      { error: "Failed to list content" },
      { status: 500 }
    );
  }
}
