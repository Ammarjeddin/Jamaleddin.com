import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { publishContentToMain, isGitHubConfigured } from "@/lib/github";

// Helper to verify auth
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// POST - Publish draft branch to main
export async function POST() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can publish
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required to publish" },
      { status: 403 }
    );
  }

  if (!isGitHubConfigured()) {
    return NextResponse.json(
      { error: "GitHub not configured. Changes are saved locally only." },
      { status: 400 }
    );
  }

  try {
    const result = await publishContentToMain();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to publish" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Changes published to main branch",
      sha: result.sha,
    });
  } catch (error) {
    console.error("Error publishing:", error);
    return NextResponse.json(
      { error: "Failed to publish changes" },
      { status: 500 }
    );
  }
}
