"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { EmptyState, Alert } from "@/components/ui/primitives";
import { formatDateLong } from "@/lib/time";
import { cn } from "@/lib/format";

export type SlotOption = {
  startMinutes: number;
  endMinutes: number;
  label: string;
  endLabel: string;
};

function periodOf(startMinutes: number) {
  if (startMinutes < 12 * 60) return "Morning";
  if (startMinutes < 17 * 60) return "Afternoon";
  return "Evening";
}

export function TimePicker({
  date,
  durationMin,
  selected,
  onSelect,
  /** Bumping this forces a refetch — used after a "slot just went" error. */
  refreshToken = 0,
}: {
  date?: string;
  durationMin: number;
  selected?: number;
  onSelect: (startMinutes: number) => void;
  refreshToken?: number;
}) {
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      date,
      duration: String(durationMin),
    });

    fetch(`/api/slots?${params}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { slots: SlotOption[] }) => {
        if (!cancelled) setSlots(data.slots);
      })
      .catch(() => {
        if (!cancelled) {
          setSlots([]);
          setError("Couldn't load times. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date, durationMin, refreshToken]);

  if (!date) {
    return (
      <EmptyState
        icon={<CalendarClock className="h-6 w-6" strokeWidth={1.5} />}
        title="Pick a date first"
        description="Choose a day on the calendar and the available times will appear here."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-11 rounded-[var(--radius)]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert tone="danger">{error}</Alert>;
  }

  if (slots.length === 0) {
    return (
      <EmptyState
        icon={<CalendarClock className="h-6 w-6" strokeWidth={1.5} />}
        title="No times left on this date"
        description={`${formatDateLong(date)} is fully booked or outside my available hours for a ${durationMin}-minute session. Try another day.`}
      />
    );
  }

  // Group into Morning / Afternoon / Evening, preserving order.
  const groups = slots.reduce<Record<string, SlotOption[]>>((acc, slot) => {
    const key = periodOf(slot.startMinutes);
    (acc[key] ??= []).push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <p className="text-sm text-fg-muted">
        <span className="font-medium text-fg">{formatDateLong(date)}</span>
        <span className="text-fg-subtle">
          {" "}
          · {slots.length} slot{slots.length === 1 ? "" : "s"} available
        </span>
      </p>

      {Object.entries(groups).map(([period, periodSlots]) => (
        <div key={period}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-fg-subtle">
            {period}
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {periodSlots.map((slot) => {
              const isSelected = selected === slot.startMinutes;
              return (
                <button
                  key={slot.startMinutes}
                  type="button"
                  onClick={() => onSelect(slot.startMinutes)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex h-11 flex-col items-center justify-center rounded-[var(--radius)] border text-sm font-medium transition-all",
                    isSelected
                      ? "border-transparent bg-fg text-fg-inverse shadow-[var(--shadow-sm)]"
                      : "border-line bg-surface text-fg hover:border-accent hover:bg-accent-soft",
                  )}
                >
                  <span>{slot.label}</span>
                  <span
                    className={cn(
                      "text-[0.625rem] leading-none",
                      isSelected ? "text-fg-inverse/70" : "text-fg-subtle",
                    )}
                  >
                    to {slot.endLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
