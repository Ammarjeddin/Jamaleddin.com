import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { VisualEditor } from "@/components/admin/VisualEditor";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

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

  return (
    <VisualEditor
      collection={collection}
      slug={slug}
      initialContent={content}
      filePath={filePath}
    />
  );
}
