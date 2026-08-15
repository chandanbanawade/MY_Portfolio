/**
 * MULTI-SESSION PACKAGES
 * -----------------------------------------------------------------------------
 * Same pattern as sessions.ts — edit here, re-seed, or manage from /admin.
 * Packages currently route to an enquiry flow rather than instant checkout,
 * because scheduling several sessions is better agreed over a first call.
 */

export type PackageConfig = {
  slug: string;
  title: string;
  description: string;
  sessionCount: number;
  durationMin: number;
  priceInr: number;
  savingsNote?: string;
  popular?: boolean;
  active?: boolean;
};

export const packages: PackageConfig[] = [
  {
    slug: "starter",
    title: "Starter",
    description:
      "Two focused sessions — one to set direction, one to check progress a few weeks later.",
    sessionCount: 2,
    durationMin: 30,
    priceInr: 699,
    savingsNote: "Save ₹99",
  },
  {
    slug: "career-accelerator",
    title: "Career Accelerator",
    description:
      "Four hours across a month or two: roadmap, resume, projects and interview readiness, in sequence.",
    sessionCount: 4,
    durationMin: 60,
    priceInr: 2499,
    savingsNote: "Save ₹297",
    popular: true,
  },
  {
    slug: "project-mentorship",
    title: "Project Mentorship",
    description:
      "Ship one real project end to end — architecture, implementation reviews, and a final walkthrough you can defend in an interview.",
    sessionCount: 4,
    durationMin: 60,
    priceInr: 2999,
  },
  {
    slug: "monthly-mentorship",
    title: "Monthly Mentorship",
    description:
      "Ongoing support: four sessions a month plus async follow-up between calls. Best for people actively job hunting.",
    sessionCount: 4,
    durationMin: 60,
    priceInr: 3499,
  },
];
