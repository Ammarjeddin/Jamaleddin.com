import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/content";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { DotPattern } from "@/components/ui/dot-pattern";
import { OrganizationSchema } from "@/components/seo/JsonLd";

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

  // Inline script to set dark mode - this site uses dark mode only
  const darkModeScript = `
    (function() {
      document.documentElement.classList.add('dark');
    })();
  `;

  // Build sameAs array from social links
  const sameAsLinks: string[] = [];
  if (settings.social?.linkedin) sameAsLinks.push(settings.social.linkedin);
  if (settings.social?.facebook) sameAsLinks.push(settings.social.facebook);
  if (settings.social?.instagram) sameAsLinks.push(settings.social.instagram);
  if (settings.social?.twitter) sameAsLinks.push(settings.social.twitter);
  if (settings.social?.youtube) sameAsLinks.push(settings.social.youtube);

  // Format phone number
  const formattedPhone = settings.contact?.phone
    ? `+1-${settings.contact.phone.slice(0, 3)}-${settings.contact.phone.slice(3, 6)}-${settings.contact.phone.slice(6)}`
    : undefined;

  // Parse address for schema
  const addressParts = settings.contact?.address?.split(",").map((s: string) => s.trim()) || [];
  const addressLocality = addressParts[0] || undefined;
  const addressRegion = addressParts[1] || undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jamaleddin.com";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        <DarkModeProvider>
          <ThemeProvider settings={settings}>
            <DotPattern
              baseColor="#B8A04A"
              glowColor="#E8B54D"
              gap={48}
              dotSize={3}
            />
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
        <OrganizationSchema
          name={settings.siteName || "Jamaleddin"}
          url={siteUrl}
          logo={settings.logo?.main || "/images/LogoTrans.png"}
          description={settings.seo?.defaultDescription || settings.tagline || ""}
          address={{
            addressLocality,
            addressRegion,
            addressCountry: "US",
          }}
          email={settings.contact?.email}
          telephone={formattedPhone}
          sameAs={sameAsLinks.length > 0 ? sameAsLinks : undefined}
        />
      </body>
    </html>
  );
}
