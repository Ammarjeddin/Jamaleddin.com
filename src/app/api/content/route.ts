import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { saveFileToGitHub, isGitHubConfigured } from "@/lib/github";

// Helper to verify auth
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET - Read content file
export async function GET(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "Path required" }, { status: 400 });
  }

  // Validate path is within content directory
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith("content/") || normalizedPath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // Don't allow access to admin users file
  if (normalizedPath.includes("content/admin/")) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const fullPath = path.join(process.cwd(), normalizedPath);
    const content = fs.readFileSync(fullPath, "utf-8");
    return NextResponse.json({ content: JSON.parse(content) });
  } catch (error) {
    console.error("Error reading content:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

// PUT - Update content file
export async function PUT(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path: filePath, content, commitMessage } = await request.json();

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: "Path and content required" },
        { status: 400 }
      );
    }

    // Validate path
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith("content/") || normalizedPath.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    // Don't allow editing admin users file through this endpoint
    if (normalizedPath.includes("content/admin/")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const contentString = JSON.stringify(content, null, 2);
    const fullPath = path.join(process.cwd(), normalizedPath);

    // Always save locally first
    fs.writeFileSync(fullPath, contentString);

    // If GitHub is configured, also save to draft branch
    if (isGitHubConfigured()) {
      const message = commitMessage || `Update ${path.basename(normalizedPath)}`;
      const result = await saveFileToGitHub(normalizedPath, contentString, message, "draft");

      if (!result.success) {
        console.warn("GitHub save failed, but local save succeeded:", result.error);
      }

      return NextResponse.json({
        success: true,
        savedToGitHub: result.success,
        gitHubError: result.error,
      });
    }

    return NextResponse.json({ success: true, savedToGitHub: false });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}

// POST - Create new content file
export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path: filePath, content, commitMessage } = await request.json();

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: "Path and content required" },
        { status: 400 }
      );
    }

    // Validate path
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith("content/") || normalizedPath.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), normalizedPath);

    // Check if file already exists
    if (fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File already exists" }, { status: 409 });
    }

    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const contentString = JSON.stringify(content, null, 2);
    fs.writeFileSync(fullPath, contentString);

    // Save to GitHub draft branch if configured
    if (isGitHubConfigured()) {
      const message = commitMessage || `Create ${path.basename(normalizedPath)}`;
      const result = await saveFileToGitHub(normalizedPath, contentString, message, "draft");

      return NextResponse.json({
        success: true,
        savedToGitHub: result.success,
        gitHubError: result.error,
      });
    }

    return NextResponse.json({ success: true, savedToGitHub: false });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}

// DELETE - Delete content file
export async function DELETE(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can delete
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "Path required" }, { status: 400 });
  }

  // Validate path
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith("content/") || normalizedPath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // Protect certain files
  const protectedPaths = ["content/settings/site.json", "content/home/index.json"];
  if (protectedPaths.includes(normalizedPath)) {
    return NextResponse.json({ error: "Cannot delete protected files" }, { status: 403 });
  }

  try {
    const fullPath = path.join(process.cwd(), normalizedPath);
    fs.unlinkSync(fullPath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
