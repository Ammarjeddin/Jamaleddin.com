import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/content";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { DarkModeProvider } from "@/contexts/DarkModeContext";

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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

  // Inline script to prevent dark mode flash - runs before React hydrates
  const darkModeScript = `
    (function() {
      try {
        var stored = localStorage.getItem('site-template-dark-mode');
        var isDark = stored !== null
          ? stored === 'true'
          : window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        <DarkModeProvider>
          <ThemeProvider settings={settings}>
            {shopEnabled ? (
              <CartProvider currency={currency}>
                {children}
                <CartDrawer currency={currency} />
              </CartProvider>
            ) : (
              children
            )}
          </ThemeProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
