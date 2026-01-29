import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import {
  getAllDrafts,
  publishDraft,
  publishAllDrafts,
  discardDraft,
} from "@/lib/content";

// Helper to verify auth
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET - List all pending drafts
export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drafts = getAllDrafts();
    return NextResponse.json({ drafts });
  } catch (error) {
    console.error("Error listing drafts:", error);
    return NextResponse.json(
      { error: "Failed to list drafts" },
      { status: 500 }
    );
  }
}

// POST - Publish drafts
export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, filePath } = await request.json();

    if (action === "publish-all") {
      // Publish all pending drafts
      const result = publishAllDrafts();
      return NextResponse.json({
        success: true,
        published: result.published,
        failed: result.failed,
      });
    }

    if (action === "publish" && filePath) {
      // Publish a specific draft
      const success = publishDraft(filePath);
      if (!success) {
        return NextResponse.json(
          { error: "Draft not found or failed to publish" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, published: [filePath] });
    }

    if (action === "discard" && filePath) {
      // Discard a specific draft
      const success = discardDraft(filePath);
      if (!success) {
        return NextResponse.json(
          { error: "Draft not found or failed to discard" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, discarded: filePath });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'publish', 'publish-all', or 'discard'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error managing drafts:", error);
    return NextResponse.json(
      { error: "Failed to manage drafts" },
      { status: 500 }
    );
  }
}
