import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from the public folder and common external domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    // Disable image optimization in dev for faster builds
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
