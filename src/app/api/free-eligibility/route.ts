import { NextResponse } from "next/server";
import { checkFreeEligibility } from "@/lib/bookings";
import { freeEligibilityQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * Has this email already claimed its free consultation?
 *
 * This is a courtesy check so the wizard can warn someone before they fill in a
 * whole form. It is NOT the security boundary — the authoritative, atomic check
 * happens inside createBooking(). Deliberately returns the same shape whether
 * or not the address exists, so it can't be used to enumerate customers.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = freeEligibilityQuerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const result = await checkFreeEligibility(parsed.data.email);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/free-eligibility]", error);
    // Fail open — the atomic check at booking time is the real guard.
    return NextResponse.json({ eligible: true });
  }
}
