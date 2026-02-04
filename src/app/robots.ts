import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jamaleddin.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/about", "/contact"],
        disallow: ["/dashboard", "/dashboard/*", "/admin", "/api/*", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
