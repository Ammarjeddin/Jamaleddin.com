import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata = {
  title: "New Product - Admin Dashboard",
  description: "Create a new product.",
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

export default async function NewProductPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/products/new");
  }

  const existingCategories = getExistingCategories();

  return (
    <ProductEditor
      isNew={true}
      existingCategories={existingCategories}
    />
  );
}
