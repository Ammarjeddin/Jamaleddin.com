import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { saveFileToGitHub, isGitHubConfigured } from "@/lib/github";
import {
  saveDraft,
  readDraft,
  hasDraft,
  getContentWithDraftPreference,
} from "@/lib/content";

// Helper to verify auth
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET - Read content file (with draft preference option)
export async function GET(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");
  const preferDraft = searchParams.get("preferDraft") === "true";
  const checkDraft = searchParams.get("checkDraft") === "true";

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
    // If preferDraft is true, return draft if it exists, otherwise live
    if (preferDraft) {
      const { content, isDraft } = getContentWithDraftPreference(normalizedPath);
      if (!content) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      return NextResponse.json({
        content,
        isDraft,
        hasDraft: isDraft || hasDraft(normalizedPath),
      });
    }

    // If checkDraft is true, just check if draft exists
    if (checkDraft) {
      const draftExists = hasDraft(normalizedPath);
      const draftContent = draftExists ? readDraft(normalizedPath) : null;
      const fullPath = path.join(process.cwd(), normalizedPath);
      const liveContent = fs.existsSync(fullPath)
        ? JSON.parse(fs.readFileSync(fullPath, "utf-8"))
        : null;

      return NextResponse.json({
        hasDraft: draftExists,
        draftContent,
        liveContent,
      });
    }

    // Default: read live content only
    const fullPath = path.join(process.cwd(), normalizedPath);
    const content = fs.readFileSync(fullPath, "utf-8");
    return NextResponse.json({
      content: JSON.parse(content),
      hasDraft: hasDraft(normalizedPath),
    });
  } catch (error) {
    console.error("Error reading content:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

// PUT - Update content file (with draft support)
export async function PUT(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path: filePath, content, commitMessage, saveAsDraft } = await request.json();

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

    // If saveAsDraft is true, save to drafts folder only
    if (saveAsDraft) {
      saveDraft(normalizedPath, content);
      return NextResponse.json({
        success: true,
        savedAsDraft: true,
        savedToLive: false,
      });
    }

    // Save directly to live (and clear any existing draft)
    const fullPath = path.join(process.cwd(), normalizedPath);

    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, contentString);

    // Clear any existing draft since we're publishing directly
    if (hasDraft(normalizedPath)) {
      const draftPath = path.join(
        process.cwd(),
        "content/.drafts",
        normalizedPath.replace(/^content\//, "")
      );
      if (fs.existsSync(draftPath)) {
        fs.unlinkSync(draftPath);
      }
    }

    // If GitHub is configured, also save to draft branch
    if (isGitHubConfigured()) {
      const message = commitMessage || `Update ${path.basename(normalizedPath)}`;
      const result = await saveFileToGitHub(normalizedPath, contentString, message, "draft");

      if (!result.success) {
        console.warn("GitHub save failed, but local save succeeded:", result.error);
      }

      return NextResponse.json({
        success: true,
        savedAsDraft: false,
        savedToLive: true,
        savedToGitHub: result.success,
        gitHubError: result.error,
      });
    }

    return NextResponse.json({
      success: true,
      savedAsDraft: false,
      savedToLive: true,
      savedToGitHub: false,
    });
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

    // Don't allow creating files in admin directory
    if (normalizedPath.includes("content/admin/")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
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
