import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import {
  isGitHubConfigured,
  publishContentToMain,
  getPendingChanges,
} from "@/lib/github";

// Helper to verify auth
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET - Get pending changes to deploy
export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can view deploy status
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  if (!isGitHubConfigured()) {
    return NextResponse.json({
      configured: false,
      error: "GitHub integration not configured",
    });
  }

  const result = await getPendingChanges();

  if (!result.success) {
    return NextResponse.json({
      configured: true,
      error: result.error,
    });
  }

  return NextResponse.json({
    configured: true,
    pendingChanges: result.commits || [],
    hasPendingChanges: (result.commits?.length || 0) > 0,
  });
}

// POST - Deploy content to live (merge content branch to main)
export async function POST() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can deploy
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  if (!isGitHubConfigured()) {
    return NextResponse.json(
      { error: "GitHub integration not configured" },
      { status: 400 }
    );
  }

  const result = await publishContentToMain();

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to deploy" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message:
      result.sha === "already-up-to-date"
        ? "Already up to date - no changes to deploy"
        : "Content deployed successfully! Netlify will rebuild the site.",
    sha: result.sha,
  });
}
