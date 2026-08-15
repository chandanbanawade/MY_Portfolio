/**
 * PRICING & SESSION CATALOGUE
 * =============================================================================
 * THE single place to change prices, durations and session copy.
 * Nothing else in the app hard-codes a price.
 *
 * These values seed the database (`npm run db:seed`). After seeding, the admin
 * dashboard at /admin/sessions is the live source of truth, so prices can change
 * without a deploy. Re-running the seed re-syncs from this file.
 */

export type MeetingProvider = "google_meet" | "zoom" | "voice_call" | "whatsapp";

export type SessionTypeConfig = {
  slug: string;
  title: string;
  tagline: string;
  durationMin: number;
  priceInr: number;
  description: string;
  bullets: string[];
  /** Meeting options the visitor may pick for this session. */
  allowedProviders: MeetingProvider[];
  /**
   * Free sessions skip payment entirely and are limited to one per email
   * address. See `freeConsultation` below and src/lib/bookings.ts.
   */
  isFree?: boolean;
  popular?: boolean;
  active?: boolean;
};

export const sessionTypes: SessionTypeConfig[] = [
  {
    slug: "free-consultation-15",
    title: "Free Consultation",
    tagline: "Start here if you're not sure what you need",
    durationMin: 15,
    priceInr: 0,
    isFree: true,
    description:
      "A no-cost conversation to understand where you are, what's actually blocking you, and which session would genuinely help. If none would, I'll tell you that.",
    bullets: [
      "Understand your goal or problem",
      "Identify what you actually need help with",
      "Get a recommended learning direction",
      "Find out which session suits you",
      "No payment, no obligation",
    ],
    allowedProviders: ["google_meet", "zoom", "voice_call", "whatsapp"],
  },
  {
    slug: "quick-guidance-15",
    title: "Quick Guidance",
    tagline: "One question, answered properly",
    durationMin: 15,
    priceInr: 199,
    description:
      "A focused 15 minutes for a single question you're stuck on. Best when you already know exactly what to ask.",
    bullets: [
      "One specific question",
      "Career direction",
      "Technology selection",
      "Quick project discussion",
      "A resume question",
    ],
    allowedProviders: ["google_meet", "zoom", "voice_call", "whatsapp"],
  },
  {
    slug: "focused-mentorship-30",
    title: "Focused Mentorship",
    tagline: "Go a level deeper",
    durationMin: 30,
    priceInr: 399,
    description:
      "Enough time to look at your actual situation — your resume, your project or your roadmap — and leave with concrete next steps.",
    bullets: [
      "Career guidance",
      "Technical questions",
      "Project discussion",
      "Resume review",
      "Learning roadmap",
    ],
    allowedProviders: ["google_meet", "zoom", "voice_call"],
    popular: true,
  },
  {
    slug: "deep-mentorship-60",
    title: "Deep Mentorship",
    tagline: "The session most people need",
    durationMin: 60,
    priceInr: 699,
    description:
      "A full hour to work through your career plan, your project architecture and your interview readiness together.",
    bullets: [
      "Detailed career guidance",
      "Project architecture",
      "Interview preparation",
      "Portfolio review",
      "Technical mentoring",
      "Learning roadmap",
    ],
    allowedProviders: ["google_meet", "zoom", "voice_call"],
  },
  {
    slug: "intensive-mentorship-90",
    title: "Intensive Mentorship",
    tagline: "Everything, in one sitting",
    durationMin: 90,
    priceInr: 999,
    description:
      "For when there's a lot on the table — a project to ship, interviews coming up and a career decision to make.",
    bullets: [
      "Complex project discussion",
      "Career strategy",
      "Detailed technical guidance",
      "Interview preparation",
      "Portfolio + resume review",
      "Architecture and implementation guidance",
    ],
    allowedProviders: ["google_meet", "zoom", "voice_call"],
  },

  // ---------------------------------------------------------------------------
  // TO ADD A SESSION: copy an entry, change the slug, run `npm run db:seed`.
  // The pricing grid, booking wizard and admin all pick it up automatically.
  // ---------------------------------------------------------------------------
];

/**
 * FREE CONSULTATION POLICY
 * Enforced server-side in src/lib/bookings.ts and editable from
 * /admin/settings once seeded.
 */
export const freeConsultation = {
  enabled: true,
  sessionSlug: "free-consultation-15",
  /** One free consultation per email address, ever. */
  oncePerEmail: true,
  /** Shown when someone has already used theirs. */
  alreadyUsedMessage:
    "You have already used your free consultation. Explore the paid mentorship sessions below — they pick up exactly where the consultation leaves off.",
} as const;

export const currency = {
  code: "INR",
  symbol: "₹",
  locale: "en-IN",
} as const;

/** How far ahead people can book and how much notice is required. */
export const bookingRules = {
  minNoticeHours: 4,
  bookingWindowDays: 45,
  /** Gap kept between two sessions, in minutes. */
  bufferMinutes: 10,
  /** Slot start times align to this grid. */
  slotGranularityMinutes: 15,
} as const;

/** Cheapest PAID session — used for "from ₹199" copy, ignoring the free one. */
export function lowestPaidPrice(
  sessions: { priceInr: number }[] = sessionTypes,
): number {
  const paid = sessions.filter((s) => s.priceInr > 0);
  return paid.length ? Math.min(...paid.map((s) => s.priceInr)) : 0;
}
