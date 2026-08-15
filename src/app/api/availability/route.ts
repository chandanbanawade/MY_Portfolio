import { NextResponse } from "next/server";
import { z } from "zod";
import { getDateAvailabilitySummary } from "@/lib/bookings";
import { isValidDateKey } from "@/lib/time";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  start: z.string().refine(isValidDateKey, "Invalid start date"),
  days: z.coerce.number().int().min(1).max(62),
  duration: z.coerce.number().int().min(5).max(480),
});

/**
 * Which dates in a range have at least one free slot for a given duration.
 * Powers the calendar's enabled/disabled day states.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    start: searchParams.get("start"),
    days: searchParams.get("days"),
    duration: searchParams.get("duration"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters." },
      { status: 400 },
    );
  }

  try {
    const days = await getDateAvailabilitySummary(
      parsed.data.start,
      parsed.data.days,
      parsed.data.duration,
    );
    return NextResponse.json({ days });
  } catch (error) {
    console.error("[api/availability]", error);
    return NextResponse.json(
      { error: "Could not load availability." },
      { status: 500 },
    );
  }
}
