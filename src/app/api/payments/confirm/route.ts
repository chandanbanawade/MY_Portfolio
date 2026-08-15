import { NextResponse } from "next/server";
import { z } from "zod";
import {
  confirmBooking,
  attachRazorpayPayment,
  BookingError,
} from "@/lib/bookings";
import { isMockPayments, verifyRazorpaySignature } from "@/lib/payments";

export const dynamic = "force-dynamic";

const confirmSchema = z.object({
  reference: z.string().trim().min(3).max(20),
  /** Present only when Razorpay checkout is live. */
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

/**
 * Marks a booking paid and provisions the meeting.
 *
 * SECURITY: in Razorpay mode the callback signature is verified server-side
 * before anything is confirmed — a client cannot mark its own booking as paid.
 * In mock mode there is no signature to check, which is exactly why mock mode
 * only activates when no Razorpay keys are present.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { reference, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    parsed.data;

  try {
    if (!isMockPayments()) {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json(
          { error: "Missing payment verification details." },
          { status: 400 },
        );
      }

      const valid = await verifyRazorpaySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });

      if (!valid) {
        console.warn(`[payments] signature verification failed for ${reference}`);
        return NextResponse.json(
          { error: "Payment could not be verified." },
          { status: 400 },
        );
      }

      await attachRazorpayPayment(reference, razorpayPaymentId);
    }

    await confirmBooking(reference);
    return NextResponse.json({ reference, status: "confirmed" });
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[api/payments/confirm]", error);
    return NextResponse.json(
      { error: "Could not confirm your payment. Please contact me directly." },
      { status: 500 },
    );
  }
}
