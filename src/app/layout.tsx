import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site, seo } from "@/config/site";
import { themeInitScript } from "@/components/site/theme-toggle";
import { JsonLd } from "@/components/ui/json-ld";
import { personSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: site.name, url: site.socials.linkedin }],
  creator: site.name,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Dark is the default theme, so the browser chrome should match.
  themeColor: "#04060c",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Per-request CSP nonce, minted in src/middleware.ts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint to prevent a flash. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} antialiased`}>
        {children}
        <JsonLd data={personSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
