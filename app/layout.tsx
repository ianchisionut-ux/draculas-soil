import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";
import { getAllSettings } from "@/lib/settings";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const siteUrl = process.env.SITE_URL || "https://example.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo_default_title,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.seo_default_description,
    verification: settings.google_site_verification
      ? { google: settings.google_site_verification }
      : undefined,
    openGraph: {
      title: settings.seo_default_title,
      description: settings.seo_default_description,
      siteName: settings.site_name,
      type: "website",
      images: settings.og_image_url ? [settings.og_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo_default_title,
      description: settings.seo_default_description,
      images: settings.og_image_url ? [settings.og_image_url] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getAllSettings();
  const siteUrl = process.env.SITE_URL || "https://example.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: siteUrl,
    description: settings.seo_default_description,
    ...(settings.contact_email && { email: settings.contact_email }),
  };

  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${cinzel.variable} ${garamond.variable} antialiased bg-void text-bone`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
