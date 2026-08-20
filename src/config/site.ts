/**
 * SITE IDENTITY & CONTACT
 * =============================================================================
 * SOURCE OF TRUTH: Chandan Banawade's CV. Every professional claim below is
 * taken from it. Do not add employers, metrics, links or credentials that the
 * CV does not state — use a clearly marked placeholder instead.
 */

export const site = {
  name: "Chandan Banawade",
  shortName: "Chandan",
  initials: "CB",

  /** Primary role, as stated on the CV. */
  role: "Cyber Security Engineer",
  /** Full professional identity line from the CV. */
  identity:
    "Cyber Security Engineer | Security Consultant | Vulnerability Assessment | Penetration Testing | Incident Response",
  currentPosition: "Security Consultant at Pinak Infosec (C9 Lab)",

  location: "Indore, India",
  availabilityNote: "Open to Remote & Relocation",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST (GMT+5:30)",

  /** Set NEXT_PUBLIC_SITE_URL in production for correct canonical/OG tags. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  contact: {
    email: "banawadechandan@gmail.com",
    phone: "+91 88712 11073",
    /** Digits only — used to build wa.me links. */
    whatsapp: "918871211073",
  },

  socials: {
    // From the CV.
    linkedin: "https://www.linkedin.com/in/chandanbanawade/",
    /**
     * LinkedIn activity feed — talks, wins and event photos. This is the part
     * of the record that changes weekly, so the site links to it rather than
     * trying to mirror it.
     */
    linkedinActivity:
      "https://www.linkedin.com/in/chandanbanawade/recent-activity/all/",
    // PLACEHOLDER — not stated on the CV. Add your real URLs here, or leave
    // blank and the link is hidden. Never invent one.
    github: "",
    hackerone: "",
    twitter: "",
  },

  /**
   * Hero statistics. Every figure is CV-supported:
   *   "2+ years"  — CV profile summary
   *   "500+"      — CV profile summary and achievements
   *   "Top 5"     — HackerOne India, Q2 2023
   *   "12+"       — team led at C9Lab
   */
  stats: [
    { value: "2+", label: "Years of offensive security experience" },
    { value: "500+", label: "Vulnerabilities discovered & disclosed" },
    { value: "Top 5", label: "Hacker in India — HackerOne, Q2 2023" },
    { value: "12+", label: "Security professionals led" },
  ],

  trustPoints: [
    "Practical Guidance",
    "Real-World Experience",
    "1-to-1 Sessions",
    "Free First Consultation",
  ],

  /**
   * Profile photography. Both files live in /public and are EXIF-normalised,
   * so no viewer can re-rotate them.
   *   avatar   — 800×800 head-and-shoulders crop, used in the hero card
   *   portrait — 1100×1954 full photo, used in the About section
   * Set either to "" to fall back to the initials placeholder.
   */
  avatar: "/chandan-avatar.jpg",
  portrait: "/chandan-portrait.jpg",
  photoCaption: "GISEC Global — Dubai",

  /** Order matches the page so the nav reads top-to-bottom. */
  nav: [
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Achievements", href: "/#achievements" },
    { label: "Speaking", href: "/#speaking" },
    { label: "Bug Bounty", href: "/#bug-bounty" },
    { label: "Mentorship", href: "/#mentorship" },
    { label: "FAQ", href: "/#faq" },
  ],
} as const;

export const seo = {
  title: `${site.name} — Cybersecurity, AI/ML & Technology Mentor`,
  titleTemplate: `%s · ${site.name}`,
  description:
    "1-to-1 mentorship in cybersecurity, AI/ML, data science, programming, projects, interviews and tech careers — from a practising Security Consultant. Start with a free 15-minute consultation.",
  keywords: [
    "cybersecurity mentor",
    "AI ML mentor",
    "data science mentor",
    "technology mentor",
    "ethical hacking mentor",
    "AI mentor",
    "data science career guidance",
    "cybersecurity career guidance",
    "technical interview mentor",
    "free mentorship consultation",
  ],
} as const;
