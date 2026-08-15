import { NextResponse } from "next/server";
import { createBooking, BookingError } from "@/lib/bookings";
import { createBookingSchema, fieldErrors } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * Creates a PENDING booking and a payment order.
 * The slot is held for the customer while they pay; the booking is only
 * confirmed once /api/payments/confirm succeeds.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fields: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  try {
    const result = await createBooking(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof BookingError) {
      // 409 for a slot that went while the form was open — the client uses this
      // to send the user back to the time picker with a refreshed list.
      const status = error.code === "SLOT_TAKEN" ? 409 : 400;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status },
      );
    }

    console.error("[api/bookings]", error);
    return NextResponse.json(
      { error: "Something went wrong creating your booking. Please try again." },
      { status: 500 },
    );
  }
}
