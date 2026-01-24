"use client";

import Link from "next/link";

export default function AdminPage() {
  // TinaCMS admin is served from /admin/index.html
  // This page is a fallback for Next.js routing
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4">
      <h1 className="text-2xl font-bold">TinaCMS Admin</h1>
      <p className="text-gray-600">
        Please access the admin panel at{" "}
        <Link href="/admin/index.html" className="text-blue-600 underline">
          /admin/index.html
        </Link>
      </p>
      <p className="text-sm text-gray-500">
        Make sure to run <code className="bg-gray-100 px-2 py-1 rounded">npm run dev:tina</code> for TinaCMS features.
      </p>
    </div>
  );
}
