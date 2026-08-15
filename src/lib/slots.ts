/**
 * SLOT ENGINE
 * -----------------------------------------------------------------------------
 * Computes which start times are genuinely bookable on a given IST date, by
 * intersecting:
 *
 *   1. the mentor's weekly availability windows
 *   2. the requested session duration (a 90-min session needs a 90-min gap)
 *   3. existing non-cancelled bookings, expanded by a buffer on both sides
 *   4. blocked-out dates
 *   5. minimum notice (you can't book a session starting in ten minutes)
 *   6. the forward booking window
 *
 * Pure functions — no database access — so the rules are trivially testable and
 * are reused by both the public API and the admin dashboard.
 */

import { bookingRules } from "@/config/sessions";
import {
  dayOfWeek,
  istToUtc,
  istToday,
  daysBetween,
  isValidDateKey,
} from "./time";

export type Window = { startMinutes: number; endMinutes: number };
export type BusyInterval = { startMinutes: number; endMinutes: number };

export type SlotComputationInput = {
  dateKey: string;
  durationMin: number;
  /** Availability windows that apply to this date's weekday. */
  windows: Window[];
  /** Existing bookings on this date that still hold their slot. */
  busy: BusyInterval[];
  blocked: boolean;
  now?: Date;
};

export type Slot = {
  startMinutes: number;
  endMinutes: number;
};

/** Two half-open intervals [aStart, aEnd) and [bStart, bEnd) overlap? */
export function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

/**
 * Does a candidate session collide with anything already booked?
 * The buffer is applied to the EXISTING booking on both sides, so back-to-back
 * sessions always have breathing room between them.
 */
export function collidesWithBusy(
  startMinutes: number,
  endMinutes: number,
  busy: BusyInterval[],
  bufferMinutes: number = bookingRules.bufferMinutes,
): boolean {
  return busy.some((b) =>
    overlaps(
      startMinutes,
      endMinutes,
      b.startMinutes - bufferMinutes,
      b.endMinutes + bufferMinutes,
    ),
  );
}

/** Is this date inside the bookable window at all (ignoring time of day)? */
export function isDateBookable(dateKey: string, now: Date = new Date()): boolean {
  if (!isValidDateKey(dateKey)) return false;
  const today = istToday();
  const delta = daysBetween(today, dateKey);
  if (delta < 0) return false;
  if (delta > bookingRules.bookingWindowDays) return false;
  void now;
  return true;
}

export function computeSlots(input: SlotComputationInput): Slot[] {
  const { dateKey, durationMin, windows, busy, blocked } = input;
  const now = input.now ?? new Date();

  if (blocked) return [];
  if (!isValidDateKey(dateKey)) return [];
  if (durationMin <= 0) return [];

  const today = istToday();
  const dayDelta = daysBetween(today, dateKey);
  if (dayDelta < 0 || dayDelta > bookingRules.bookingWindowDays) return [];

  const earliestUtcMs =
    now.getTime() + bookingRules.minNoticeHours * 60 * 60_000;
  const step = bookingRules.slotGranularityMinutes;

  const slots: Slot[] = [];
  const seen = new Set<number>();

  for (const window of windows) {
    // Align the first candidate to the slot grid without starting before the window.
    const first = Math.ceil(window.startMinutes / step) * step;

    for (let start = first; start + durationMin <= window.endMinutes; start += step) {
      const end = start + durationMin;
      if (seen.has(start)) continue;
      if (collidesWithBusy(start, end, busy)) continue;
      if (istToUtc(dateKey, start).getTime() < earliestUtcMs) continue;

      seen.add(start);
      slots.push({ startMinutes: start, endMinutes: end });
    }
  }

  return slots.sort((a, b) => a.startMinutes - b.startMinutes);
}

/** Splits slots into parts of the day, so the time picker reads well. */
export function groupSlotsByPeriod(slots: Slot[]) {
  const groups: { label: string; slots: Slot[] }[] = [
    { label: "Morning", slots: [] },
    { label: "Afternoon", slots: [] },
    { label: "Evening", slots: [] },
  ];

  for (const slot of slots) {
    if (slot.startMinutes < 12 * 60) groups[0].slots.push(slot);
    else if (slot.startMinutes < 17 * 60) groups[1].slots.push(slot);
    else groups[2].slots.push(slot);
  }

  return groups.filter((g) => g.slots.length > 0);
}

/** Weekday windows for a date, from a flat list of recurring rules. */
export function windowsForDate(
  dateKey: string,
  rules: { dayOfWeek: number; startMinutes: number; endMinutes: number; active: boolean }[],
): Window[] {
  const dow = dayOfWeek(dateKey);
  return rules
    .filter((r) => r.active && r.dayOfWeek === dow)
    .map((r) => ({ startMinutes: r.startMinutes, endMinutes: r.endMinutes }))
    .sort((a, b) => a.startMinutes - b.startMinutes);
}
