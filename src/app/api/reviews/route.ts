import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSubmissionSchema, fieldErrors } from "@/lib/validation";
import { feedbackSettings } from "@/config/testimonials";

export const dynamic = "force-dynamic";

/**
 * Accepts a genuine session rating.
 *
 * Ratings are stored UNPUBLISHED and appear on the site only after approval in
 * /admin/reviews, so nothing reaches the public page unvetted. If the submitter
 * supplies a booking ID we link the rating to that booking, which lets the
 * admin see at a glance that the rating came from a real attendee.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = reviewSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fields: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const { rating, name, role, email, comment, reference } = parsed.data;

  try {
    // Link to a booking when the reference matches one and isn't already rated.
    let bookingId: string | undefined;
    if (reference) {
      const booking = await prisma.booking.findUnique({
        where: { reference: reference.toUpperCase() },
        include: { review: true },
      });
      if (booking && !booking.review) bookingId = booking.id;
    }

    await prisma.review.create({
      data: {
        rating,
        name,
        role: role ?? "",
        email,
        quote: comment ?? "",
        reference: reference ? reference.toUpperCase() : null,
        bookingId,
        published: !feedbackSettings.requireApproval,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        pendingApproval: feedbackSettings.requireApproval,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/reviews]", error);
    return NextResponse.json(
      { error: "Could not save your rating. Please try again." },
      { status: 500 },
    );
  }
}
