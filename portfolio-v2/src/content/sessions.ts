/**
 * SESSIONS & PRICING — the single place prices and session copy are set.
 * Ported from the booking platform's src/config/sessions.ts.
 *
 * This site has no booking backend. Each session's call to action resolves
 * through `sessionHref()` in src/lib/booking.ts: it points at
 * `profile.bookingBaseUrl` when that is set, and falls back to a pre-filled
 * email otherwise. See README.
 */

export type MeetingProvider = "Google Meet" | "Zoom" | "Voice call" | "WhatsApp";

export type Session = {
  slug: string;
  title: string;
  tagline: string;
  durationMin: number;
  priceInr: number;
  description: string;
  bullets: string[];
  providers: MeetingProvider[];
  isFree?: boolean;
  popular?: boolean;
};

export const freeSession: Session = {
  slug: "free-consultation-15",
  title: "Free consultation",
  tagline: "Start here if you're not sure what you need",
  durationMin: 15,
  priceInr: 0,
  isFree: true,
  description:
    "A no-cost conversation to work out where you are, what is actually blocking you, and which session would genuinely help. If none would, I will tell you that.",
  bullets: [
    "Understand your goal or problem",
    "Identify what you actually need help with",
    "Get a recommended direction",
    "No payment, no obligation",
  ],
  providers: ["Google Meet", "Zoom", "Voice call", "WhatsApp"],
};

export const paidSessions: Session[] = [
  {
    slug: "quick-guidance-15",
    title: "Quick guidance",
    tagline: "One question, answered properly",
    durationMin: 15,
    priceInr: 199,
    description:
      "A focused 15 minutes for a single question you are stuck on. Best when you already know exactly what to ask.",
    bullets: [
      "One specific question",
      "Career direction",
      "Technology selection",
      "A resume question",
    ],
    providers: ["Google Meet", "Zoom", "Voice call", "WhatsApp"],
  },
  {
    slug: "focused-mentorship-30",
    title: "Focused mentorship",
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
    providers: ["Google Meet", "Zoom", "Voice call"],
    popular: true,
  },
  {
    slug: "deep-mentorship-60",
    title: "Deep mentorship",
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
      "Learning roadmap",
    ],
    providers: ["Google Meet", "Zoom", "Voice call"],
  },
  {
    slug: "intensive-mentorship-90",
    title: "Intensive mentorship",
    tagline: "Everything, in one sitting",
    durationMin: 90,
    priceInr: 999,
    description:
      "For when there is a lot on the table — a project to ship, interviews coming up and a career decision to make.",
    bullets: [
      "Complex project discussion",
      "Career strategy",
      "Detailed technical guidance",
      "Interview preparation",
      "Portfolio + resume review",
    ],
    providers: ["Google Meet", "Zoom", "Voice call"],
  },
];

/** Terms shown under the grid. Kept here so they are not buried in JSX. */
export const sessionTerms =
  "All prices in INR. Free reschedule up to 12 hours before your session · full refund if you cancel at least 24 hours ahead.";

export const lowestPaidPriceInr = Math.min(...paidSessions.map((s) => s.priceInr));
