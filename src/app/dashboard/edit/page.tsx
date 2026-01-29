import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { VisualEditor } from "@/components/admin/VisualEditor";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata = {
  title: "Edit Content - Admin Dashboard",
  description: "Edit your content.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

function getExistingCategories(): string[] {
  const productsDir = path.join(process.cwd(), "content/products");

  if (!fs.existsSync(productsDir)) {
    return [];
  }

  const files = fs.readdirSync(productsDir).filter((f) => f.endsWith(".json"));
  const categories = new Set<string>();

  for (const file of files) {
    try {
      const content = JSON.parse(
        fs.readFileSync(path.join(productsDir, file), "utf-8")
      );
      if (content.category) {
        categories.add(content.category);
      }
    } catch {
      // Skip invalid files
    }
  }

  return Array.from(categories).sort();
}

interface PageProps {
  searchParams: Promise<{ collection?: string; slug?: string }>;
}

export default async function EditPage({ searchParams }: PageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { collection, slug } = await searchParams;

  if (!collection || !slug) {
    redirect("/dashboard");
  }

  // Map collection names to paths
  const collectionPaths: Record<string, string> = {
    pages: "content/pages",
    programs: "content/programs",
    products: "content/products",
    settings: "content/settings",
    home: "content/home",
  };

  const basePath = collectionPaths[collection];
  if (!basePath) {
    notFound();
  }

  const filePath = `${basePath}/${slug}.json`;
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  let content;
  try {
    content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  } catch {
    notFound();
  }

  // Use settings editor for site settings
  if (collection === "settings") {
    return (
      <SettingsEditor
        initialContent={content}
        filePath={filePath}
      />
    );
  }

  // Use product editor for products
  if (collection === "products") {
    const existingCategories = getExistingCategories();
    return (
      <ProductEditor
        initialProduct={content}
        isNew={false}
        existingCategories={existingCategories}
      />
    );
  }

  return (
    <VisualEditor
      collection={collection}
      slug={slug}
      initialContent={content}
      filePath={filePath}
    />
  );
}
