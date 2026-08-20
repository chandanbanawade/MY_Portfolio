import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";
import { profile } from "@/content/profile";
import { freeSession, paidSessions } from "@/content/sessions";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const description =
  "1-to-1 mentorship in cybersecurity, AI/ML and data science from an offensive security consultant in Indore, India. 500+ vulnerabilities disclosed across 500+ programs; Top 5 in India and #13 globally for highest critical reputation on HackerOne, Q2 2023. Free 15-minute consultation, sessions from ₹199.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} — Security & AI/ML Mentorship`,
    template: `%s — ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} — security research`,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    "cybersecurity mentorship",
    "bug bounty mentor",
    "AI ML mentorship",
    "data science mentor",
    "penetration testing",
    "offensive security",
    "application security",
    "security consultant India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: `${profile.name} — Security & AI/ML Mentorship`,
    description,
    url: profile.siteUrl,
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Security & AI/ML Mentorship`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#12110f",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description,
  url: profile.siteUrl,
  worksFor: {
    "@type": "Organization",
    name: `${profile.employer} (${profile.employerParent})`,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Oriental University, Indore",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Penetration testing",
    "Web application security",
    "API security",
    "Cloud security",
    "Red teaming",
    "Vulnerability research",
    "Machine learning career mentorship",
    "Data science mentorship",
  ],
  sameAs: [profile.linkedin, profile.hackerone],
  makesOffer: [freeSession, ...paidSessions].map((session) => ({
    "@type": "Offer",
    name: session.title,
    description: session.tagline,
    price: session.priceInr,
    priceCurrency: "INR",
    category: "Mentorship session",
    itemOffered: {
      "@type": "Service",
      name: `${session.title} — ${session.durationMin} minute 1-to-1 mentorship`,
      serviceType: "Mentorship",
      provider: { "@type": "Person", name: profile.name },
    },
  })),
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The nonce is minted per request in middleware.ts; the JSON-LD script is the
  // only inline script this page ships, and it carries that nonce.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${instrument.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-meta focus:text-signal-ink"
        >
          Skip to content
        </a>
        <div className="scanline" aria-hidden="true" />
        {children}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
