import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/tina";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";

// Default fonts (Modern pairing)
const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getSiteSettings();
  const settings = data.siteSettings;

  return {
    title: {
      default: settings.siteName || "Site Template",
      template: settings.seo?.titleTemplate || "%s | Site Template",
    },
    description: settings.seo?.defaultDescription || settings.tagline || "",
    openGraph: {
      images: settings.seo?.defaultOgImage ? [settings.seo.defaultOgImage] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsResponse = await getSiteSettings();
  const settings = settingsResponse.data.siteSettings;

  const shopEnabled = settings.template?.features?.shop?.enabled === true;
  const currency = settings.template?.features?.shop?.currency || "USD";

  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        <ThemeProvider settings={settings}>
          {shopEnabled ? (
            <CartProvider>
              {children}
              <CartDrawer currency={currency} />
            </CartProvider>
          ) : (
            children
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
