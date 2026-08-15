import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/bookings";
import { slotsQuerySchema } from "@/lib/validation";
import { minutesToLabel } from "@/lib/time";

export const dynamic = "force-dynamic";

/** Free start times on a specific date for a specific session duration. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = slotsQuerySchema.safeParse({
    date: searchParams.get("date"),
    duration: searchParams.get("duration"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid date or duration." }, { status: 400 });
  }

  try {
    const slots = await getAvailableSlots(parsed.data.date, parsed.data.duration);

    return NextResponse.json({
      date: parsed.data.date,
      slots: slots.map((slot) => ({
        startMinutes: slot.startMinutes,
        endMinutes: slot.endMinutes,
        label: minutesToLabel(slot.startMinutes),
        endLabel: minutesToLabel(slot.endMinutes),
      })),
    });
  } catch (error) {
    console.error("[api/slots]", error);
    return NextResponse.json({ error: "Could not load times." }, { status: 500 });
  }
}
