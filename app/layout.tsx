import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";
import { getAllSettings } from "@/lib/settings";
import { digitalCertificateCopy } from "@/lib/certificate-copy";

const DEFAULT_SOCIAL_IMAGE = "/images/hero-video-poster-7edc6c51.webp";

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
  const siteUrl = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
  const description = digitalCertificateCopy(settings.seo_default_description);
  const socialImage = settings.og_image_url || DEFAULT_SOCIAL_IMAGE;
  const socialImageAlt = `${settings.site_name} — authentic soil from Transylvania`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo_default_title,
      template: `%s | ${settings.site_name}`,
    },
    description,
    creator: settings.site_name,
    publisher: settings.site_name,
    verification: settings.google_site_verification
      ? { google: settings.google_site_verification }
      : undefined,
    openGraph: {
      title: settings.seo_default_title,
      description,
      siteName: settings.site_name,
      type: "website",
      locale: "en_US",
      images: settings.og_image_url
        ? [{ url: socialImage, alt: socialImageAlt }]
        : [{ url: socialImage, width: 1600, height: 900, alt: socialImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo_default_title,
      description,
      images: [socialImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getAllSettings();
  const siteUrl = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
  const description = digitalCertificateCopy(settings.seo_default_description);
  const organizationId = `${siteUrl}/#organization`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: settings.site_name,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/images/logo.png`,
        description,
        sameAs: [
          "https://www.facebook.com/draculasoil",
          "https://www.instagram.com/draculasoil/",
          "https://twitter.com/draculasoil/",
        ],
        ...(settings.contact_email && { email: settings.contact_email }),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: settings.site_name,
        description,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${cinzel.variable} ${garamond.variable} antialiased bg-void text-bone`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
