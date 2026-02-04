import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));

  // Clear the auth cookie
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // SECURITY: Changed from "lax" to "strict" for better CSRF protection
    maxAge: 0,
    path: "/",
  });

  return response;
}

// SECURITY: Removed GET handler to prevent CSRF logout attacks
// Logout should only happen via POST request with proper form submission
