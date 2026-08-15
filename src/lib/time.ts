/**
 * TIME UTILITIES — everything is Asia/Kolkata (IST, UTC+5:30).
 * -----------------------------------------------------------------------------
 * Design decision: bookings are stored as a plain `YYYY-MM-DD` IST date plus
 * "minutes from midnight IST", never as a raw timestamp. This removes an entire
 * class of bugs — a booking at 19:00 IST stays at 19:00 IST regardless of the
 * server's locale, whether the host observes DST, or where the visitor sits.
 *
 * India has no daylight saving, so a fixed +5:30 offset is exact.
 */

export const IST_OFFSET_MINUTES = 330; // UTC+5:30
const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

/** Current wall-clock time in IST, exposed as a UTC-based Date for component reads. */
export function istNow(): Date {
  return new Date(Date.now() + IST_OFFSET_MINUTES * MS_PER_MINUTE);
}

/** Today's IST calendar date as YYYY-MM-DD. */
export function istToday(): string {
  return toDateKey(istNow());
}

/** Reads the UTC fields of a shifted Date as an IST calendar date string. */
export function toDateKey(shifted: Date): string {
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Minutes elapsed since midnight IST right now. */
export function istMinutesNow(): number {
  const n = istNow();
  return n.getUTCHours() * 60 + n.getUTCMinutes();
}

/** Parses YYYY-MM-DD into its numeric parts. Throws on malformed input. */
export function parseDateKey(dateKey: string): {
  year: number;
  month: number;
  day: number;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) throw new Error(`Invalid date key: ${dateKey}`);
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function isValidDateKey(dateKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return false;
  const { year, month, day } = parseDateKey(dateKey);
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

/** 0 = Sunday … 6 = Saturday, for an IST calendar date. */
export function dayOfWeek(dateKey: string): number {
  const { year, month, day } = parseDateKey(dateKey);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Converts an IST date + minutes-from-midnight into a true UTC instant. */
export function istToUtc(dateKey: string, minutes: number): Date {
  const { year, month, day } = parseDateKey(dateKey);
  return new Date(
    Date.UTC(year, month - 1, day) +
      (minutes - IST_OFFSET_MINUTES) * MS_PER_MINUTE,
  );
}

/** Adds days to a YYYY-MM-DD key, staying in the IST calendar. */
export function addDays(dateKey: string, days: number): string {
  const { year, month, day } = parseDateKey(dateKey);
  return toDateKey(new Date(Date.UTC(year, month - 1, day) + days * MS_PER_DAY));
}

/** Whole days between two IST calendar dates (b - a). */
export function daysBetween(a: string, b: string): number {
  const pa = parseDateKey(a);
  const pb = parseDateKey(b);
  return Math.round(
    (Date.UTC(pb.year, pb.month - 1, pb.day) -
      Date.UTC(pa.year, pa.month - 1, pa.day)) /
      MS_PER_DAY,
  );
}

// --- Formatting -------------------------------------------------------------

/** "HH:MM" → minutes from midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** 630 → "10:30 AM" */
export function minutesToLabel(minutes: number): string {
  const total = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** 630 → "10:30" (24-hour, for <input type="time"> and admin forms). */
export function minutesToTimeValue(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

/** "2026-08-20" → "Thursday, 20 August 2026" */
export function formatDateLong(dateKey: string): string {
  const { year, month, day } = parseDateKey(dateKey);
  const weekday = WEEKDAYS[dayOfWeek(dateKey)];
  return `${weekday}, ${day} ${MONTHS[month - 1]} ${year}`;
}

/** "2026-08-20" → "20 Aug 2026" */
export function formatDateShort(dateKey: string): string {
  const { year, month, day } = parseDateKey(dateKey);
  return `${day} ${MONTHS[month - 1].slice(0, 3)} ${year}`;
}

/** Day-of-month and short weekday, for calendar cells. */
export function calendarCellLabels(dateKey: string) {
  const { day } = parseDateKey(dateKey);
  return {
    day,
    weekday: WEEKDAYS[dayOfWeek(dateKey)].slice(0, 3),
  };
}

export function monthLabel(dateKey: string): string {
  const { year, month } = parseDateKey(dateKey);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "10:30 AM – 11:00 AM" */
export function formatRange(startMinutes: number, durationMin: number): string {
  return `${minutesToLabel(startMinutes)} – ${minutesToLabel(
    startMinutes + durationMin,
  )}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}
