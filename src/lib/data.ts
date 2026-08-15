/**
 * PUBLIC DATA ACCESS
 * =============================================================================
 * The catalogue lives in the database so it can be edited from /admin without a
 * deploy — but the site must never show a blank pricing grid because the DB is
 * unseeded or briefly unreachable. Every reader here falls back to the config
 * files, which hold the same values the seed writes.
 */

import { prisma } from "./prisma";
import { sessionTypes as sessionConfig, freeConsultation } from "@/config/sessions";
import { categories as categoryConfig } from "@/config/categories";
import { packages as packageConfig } from "@/config/packages";
import {
  weeklyAvailability,
  blockedDates as blockedConfig,
} from "@/config/availability";
import { parseStringArray } from "./format";
import { timeToMinutes } from "./time";
import type { MeetingProvider } from "./types";

export type SessionTypeView = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  durationMin: number;
  priceInr: number;
  description: string;
  bullets: string[];
  allowedProviders: MeetingProvider[];
  isFree: boolean;
  popular: boolean;
};

export type CategoryView = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  group: string;
  backing: string;
  topics: string[];
};

function sessionsFromConfig(): SessionTypeView[] {
  return sessionConfig
    .filter((s) => s.active !== false)
    .map((s) => ({
      id: s.slug,
      slug: s.slug,
      title: s.title,
      tagline: s.tagline,
      durationMin: s.durationMin,
      priceInr: s.priceInr,
      description: s.description,
      bullets: s.bullets,
      allowedProviders: s.allowedProviders as MeetingProvider[],
      isFree: Boolean(s.isFree),
      popular: Boolean(s.popular),
    }));
}

export async function getSessionTypes(): Promise<SessionTypeView[]> {
  try {
    const rows = await prisma.sessionType.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return sessionsFromConfig();

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      tagline: r.tagline,
      durationMin: r.durationMin,
      priceInr: r.priceInr,
      description: r.description,
      bullets: parseStringArray(r.bullets),
      allowedProviders: parseStringArray(r.allowedProviders) as MeetingProvider[],
      isFree: r.isFree,
      popular: r.popular,
    }));
  } catch {
    return sessionsFromConfig();
  }
}

/** The free consultation session, or null when it's disabled. */
export async function getFreeConsultation(): Promise<SessionTypeView | null> {
  const enabled = await getFreeConsultationEnabled();
  if (!enabled) return null;
  const sessions = await getSessionTypes();
  return sessions.find((s) => s.isFree) ?? null;
}

/** Paid sessions only, for the pricing ladder. */
export async function getPaidSessionTypes(): Promise<SessionTypeView[]> {
  const sessions = await getSessionTypes();
  return sessions.filter((s) => !s.isFree);
}

export async function getCategories(): Promise<CategoryView[]> {
  try {
    const rows = await prisma.mentorshipCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      icon: r.icon,
      group: r.group,
      backing: r.backing,
      topics: parseStringArray(r.topics),
    }));
  } catch {
    return categoryConfig
      .filter((c) => c.active !== false)
      .map((c) => ({
        id: c.slug,
        slug: c.slug,
        title: c.title,
        description: c.description,
        icon: c.icon,
        group: c.group,
        backing: c.backing,
        topics: c.topics,
      }));
  }
}

export async function getPackages() {
  try {
    const rows = await prisma.mentorshipPackage.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    return rows;
  } catch {
    return packageConfig.map((p, i) => ({
      id: p.slug,
      slug: p.slug,
      title: p.title,
      description: p.description,
      sessionCount: p.sessionCount,
      durationMin: p.durationMin,
      priceInr: p.priceInr,
      savingsNote: p.savingsNote ?? null,
      popular: Boolean(p.popular),
      active: true,
      sortOrder: i,
    }));
  }
}

/**
 * Published reviews only. Returns an empty array when there are none —
 * the UI then shows the rating form alone rather than any placeholder content.
 */
export async function getPublishedReviews() {
  try {
    const rows = await prisma.review.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 12,
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      rating: r.rating,
      quote: r.quote,
      createdAt: r.createdAt,
    }));
  } catch {
    return [];
  }
}

// --- Settings ---------------------------------------------------------------

const FREE_CONSULT_KEY = "free_consultation_enabled";

export async function getFreeConsultationEnabled(): Promise<boolean> {
  try {
    const row = await prisma.appSetting.findUnique({
      where: { key: FREE_CONSULT_KEY },
    });
    if (!row) return freeConsultation.enabled;
    return row.value === "true";
  } catch {
    return freeConsultation.enabled;
  }
}

export async function setFreeConsultationEnabled(enabled: boolean) {
  await prisma.appSetting.upsert({
    where: { key: FREE_CONSULT_KEY },
    create: { key: FREE_CONSULT_KEY, value: String(enabled) },
    update: { value: String(enabled) },
  });
}

// --- Availability -----------------------------------------------------------

export type AvailabilityRuleView = {
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
  active: boolean;
};

function rulesFromConfig(): AvailabilityRuleView[] {
  return Object.entries(weeklyAvailability).flatMap(([day, windows]) =>
    windows.map((w) => ({
      dayOfWeek: Number(day),
      startMinutes: timeToMinutes(w.start),
      endMinutes: timeToMinutes(w.end),
      active: true,
    })),
  );
}

export async function getAvailabilityRules(): Promise<AvailabilityRuleView[]> {
  try {
    const rows = await prisma.availabilityRule.findMany({
      where: { active: true },
    });
    if (rows.length === 0) return rulesFromConfig();
    return rows.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startMinutes: r.startMinutes,
      endMinutes: r.endMinutes,
      active: r.active,
    }));
  } catch {
    return rulesFromConfig();
  }
}

export async function getBlockedDates(): Promise<Set<string>> {
  try {
    const rows = await prisma.blockedDate.findMany();
    return new Set(rows.map((r) => r.date));
  } catch {
    return new Set(blockedConfig.map((b) => b.date));
  }
}
