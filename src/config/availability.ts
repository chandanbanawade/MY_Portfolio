/**
 * WEEKLY AVAILABILITY (Asia/Kolkata)
 * -----------------------------------------------------------------------------
 * Times are "HH:MM" in IST. Seeded into the AvailabilityRule table, after which
 * /admin/availability is the live source of truth.
 *
 * The slot engine (src/lib/slots.ts) intersects these windows with:
 *   · the chosen session duration
 *   · existing non-cancelled bookings (+ buffer)
 *   · blocked dates
 *   · minimum notice
 * so a visitor can only ever pick a slot that is genuinely free.
 */

export type WindowConfig = { start: string; end: string };

/** 0 = Sunday … 6 = Saturday */
export const weeklyAvailability: Record<number, WindowConfig[]> = {
  0: [{ start: "10:00", end: "14:00" }], // Sunday
  1: [
    { start: "19:00", end: "22:00" },
  ], // Monday — evenings only (working day)
  2: [{ start: "19:00", end: "22:00" }], // Tuesday
  3: [{ start: "19:00", end: "22:00" }], // Wednesday
  4: [{ start: "19:00", end: "22:00" }], // Thursday
  5: [{ start: "19:00", end: "22:00" }], // Friday
  6: [
    { start: "10:00", end: "13:00" },
    { start: "16:00", end: "20:00" },
  ], // Saturday
};

/** Dates you are unavailable, as YYYY-MM-DD. Also manageable from /admin. */
export const blockedDates: { date: string; reason?: string }[] = [
  // { date: "2026-10-02", reason: "Public holiday" },
];

export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
