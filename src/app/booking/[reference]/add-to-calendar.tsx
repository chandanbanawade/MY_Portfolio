"use client";

import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { istToUtc } from "@/lib/time";

/**
 * Opens a prefilled Google Calendar event.
 * Times are converted from IST to UTC so the event lands correctly whatever
 * timezone the visitor's calendar is in.
 */
export function AddToCalendar({
  title,
  date,
  startMinutes,
  durationMin,
  description,
  location,
}: {
  title: string;
  date: string;
  startMinutes: number;
  durationMin: number;
  description: string;
  location: string;
}) {
  function open() {
    const start = istToUtc(date, startMinutes);
    const end = istToUtc(date, startMinutes + durationMin);

    // Google expects basic-format UTC: 20260820T133000Z
    const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${stamp(start)}/${stamp(end)}`,
      details: description,
      location,
    });

    window.open(
      `https://calendar.google.com/calendar/render?${params}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <Button onClick={open} variant="secondary">
      <CalendarPlus className="h-4 w-4" strokeWidth={1.8} />
      Add to Google Calendar
    </Button>
  );
}
