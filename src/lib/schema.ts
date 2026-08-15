/**
 * Structured data (JSON-LD). Helps search engines understand who you are, what
 * you sell and what your FAQ answers — without stuffing keywords into the copy.
 */

import { site } from "@/config/site";
import { faqs } from "@/config/faq";
import { certifications, education } from "@/config/experience";
import type { SessionTypeView } from "./data";

export function personSchema() {
  const sameAs = [
    site.socials.linkedin,
    site.socials.github,
    site.socials.hackerone,
    site.socials.twitter,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.identity,
    email: `mailto:${site.contact.email}`,
    telephone: site.contact.phone,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    worksFor: {
      "@type": "Organization",
      name: "C9Lab (Pinak Infosec Pvt. Ltd.)",
    },
    alumniOf: education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.org,
    })),
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
    knowsAbout: [
      "Penetration Testing",
      "Vulnerability Assessment",
      "Bug Bounty Hunting",
      "Application Security",
      "Incident Response",
      "Security Automation",
      "Artificial Intelligence",
      "Machine Learning",
    ],
    sameAs,
  };
}

export function serviceSchema(sessions: SessionTypeView[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${site.name} — Cyber Security & AI Mentorship`,
    description:
      "1-to-1 mentorship sessions in cyber security, bug bounty, penetration testing, AI/ML and technology career guidance.",
    url: site.url,
    provider: { "@type": "Person", name: site.name },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mentorship Sessions",
      itemListElement: sessions.map((s) => ({
        "@type": "Offer",
        name: `${s.title} — ${s.durationMin} minutes`,
        description: s.description,
        price: String(s.priceInr),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${site.url}/book?session=${s.slug}`,
      })),
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };
}
