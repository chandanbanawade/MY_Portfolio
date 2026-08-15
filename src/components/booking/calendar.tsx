"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  dayOfWeek,
  daysBetween,
  istToday,
  monthLabel,
  parseDateKey,
  toDateKey,
} from "@/lib/time";
import { bookingRules } from "@/config/sessions";
import { cn } from "@/lib/format";

type DayAvailability = { date: string; slotCount: number; available: boolean };

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function firstOfMonth(dateKey: string): string {
  const { year, month } = parseDateKey(dateKey);
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function daysInMonth(dateKey: string): number {
  const { year, month } = parseDateKey(dateKey);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function addMonths(dateKey: string, delta: number): string {
  const { year, month } = parseDateKey(dateKey);
  const shifted = new Date(Date.UTC(year, month - 1 + delta, 1));
  return toDateKey(shifted);
}

export function Calendar({
  durationMin,
  selected,
  onSelect,
}: {
  durationMin: number;
  selected?: string;
  onSelect: (date: string) => void;
}) {
  const today = useMemo(() => istToday(), []);
  const lastBookable = useMemo(
    () => addDays(today, bookingRules.bookingWindowDays),
    [today],
  );

  const [cursor, setCursor] = useState(() => firstOfMonth(selected ?? today));
  const [availability, setAvailability] = useState<Map<string, DayAvailability>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);

  const monthStart = firstOfMonth(cursor);
  const totalDays = daysInMonth(cursor);

  // Fetch availability for the visible month whenever it (or the duration) changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({
      start: monthStart,
      days: String(totalDays),
      duration: String(durationMin),
    });

    fetch(`/api/availability?${params}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { days: DayAvailability[] }) => {
        if (cancelled) return;
        setAvailability(new Map(data.days.map((d) => [d.date, d])));
      })
      .catch(() => {
        // Leave the map empty — days render as unavailable rather than
        // letting someone pick a date we can't confirm.
        if (!cancelled) setAvailability(new Map());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [monthStart, totalDays, durationMin]);

  const canGoBack = daysBetween(today, monthStart) > 0;
  const canGoForward = daysBetween(addMonths(monthStart, 1), lastBookable) >= 0;

  const leadingBlanks = dayOfWeek(monthStart);
  const cells = Array.from({ length: totalDays }, (_, i) => addDays(monthStart, i));

  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoBack && setCursor(addMonths(cursor, -1))}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-fg-muted transition-colors hover:text-fg disabled:opacity-35 disabled:hover:text-fg-muted"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-fg" aria-live="polite">
            {monthLabel(monthStart)}
          </p>
          <p className="text-[0.6875rem] text-fg-subtle">All times IST</p>
        </div>

        <button
          type="button"
          onClick={() => canGoForward && setCursor(addMonths(cursor, 1))}
          disabled={!canGoForward}
          aria-label="Next month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-fg-muted transition-colors hover:text-fg disabled:opacity-35 disabled:hover:text-fg-muted"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mb-1.5 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={i}
            className="py-1 text-center text-[0.6875rem] font-medium text-fg-subtle"
            aria-hidden
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} aria-hidden />
        ))}

        {cells.map((dateKey) => {
          const info = availability.get(dateKey);
          const isPast = daysBetween(today, dateKey) < 0;
          const beyondWindow = daysBetween(dateKey, lastBookable) < 0;
          const isSelected = selected === dateKey;
          const isToday = dateKey === today;
          const disabled = loading || isPast || beyondWindow || !info?.available;
          const { day } = parseDateKey(dateKey);

          return (
            <button
              key={dateKey}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateKey)}
              aria-label={`${dateKey}${
                info?.available ? `, ${info.slotCount} slots available` : ", unavailable"
              }`}
              aria-pressed={isSelected}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-[var(--radius-sm)] text-sm font-medium transition-all",
                loading && "skeleton text-transparent",
                !loading &&
                  disabled &&
                  "cursor-not-allowed text-fg-subtle/45 line-through decoration-1",
                !loading &&
                  !disabled &&
                  !isSelected &&
                  "border border-line bg-surface-2 text-fg hover:border-accent hover:bg-accent-soft",
                isSelected &&
                  !loading &&
                  "bg-fg text-fg-inverse shadow-[var(--shadow-sm)]",
                isToday && !isSelected && !loading && "ring-1 ring-accent/40",
              )}
            >
              {day}
              {/* Availability dot */}
              {!loading && info?.available && !isSelected && (
                <span
                  className="absolute bottom-1.5 h-1 w-1 rounded-full bg-success"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-[0.6875rem] text-fg-subtle">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-fg" aria-hidden />
          Selected
        </span>
        <span className="line-through decoration-1">Unavailable</span>
      </div>
    </div>
  );
}
