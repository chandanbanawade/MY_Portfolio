/**
 * BOOKING SERVICE
 * =============================================================================
 * All booking writes go through here so the availability and free-consultation
 * rules live in exactly one place.
 *
 * DOUBLE BOOKING — prevented in three layers:
 *   1. The client only ever sees slots computed server-side.
 *   2. On submit, availability is RECOMPUTED from the database inside the
 *      request. The client's claim about what is free is never trusted.
 *   3. A unique index on `slotKey` ("<date>#<startMinutes>") is the final
 *      backstop. If two requests pass step 2 simultaneously the database
 *      rejects the loser (P2002) and we return a clean "slot just went" error.
 *      Cancelling sets slotKey to NULL, freeing the slot for rebooking.
 *
 * FREE CONSULTATION — one per email address, ever. Enforced by an atomic
 * conditional update on Customer.freeConsultationUsedAt, so two simultaneous
 * requests from the same email cannot both succeed.
 */

import { randomInt } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { computeSlots, windowsForDate } from "./slots";
import {
  getAvailabilityRules,
  getBlockedDates,
  getFreeConsultationEnabled,
} from "./data";
import { SLOT_HOLDING_STATUSES } from "./types";
import type { MeetingProvider } from "./types";
import { createMeeting } from "./meeting";
import { createPaymentOrder, settleMockPayment, isMockPayments } from "./payments";
import { notifyBookingConfirmed, notifyCancelled } from "./notify";
import { freeConsultation } from "@/config/sessions";
import type { BookingDetails } from "./validation";

/** How long an unpaid booking keeps its slot. */
export const PENDING_HOLD_MINUTES = 30;

/** Unambiguous alphabet — no O/0 or I/1 confusion when read aloud. */
const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateReference(): string {
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }
  return `CB-${out}`;
}

export type BookingErrorCode =
  | "SLOT_TAKEN"
  | "SLOT_INVALID"
  | "SESSION_NOT_FOUND"
  | "NOT_FOUND"
  | "ALREADY_PAID"
  | "PAYMENT_FAILED"
  | "FREE_ALREADY_USED"
  | "FREE_DISABLED"
  | "PROVIDER_NOT_ALLOWED";

export class BookingError extends Error {
  constructor(
    message: string,
    public code: BookingErrorCode,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

/* -------------------------------------------------------------------------- */
/* Availability                                                               */
/* -------------------------------------------------------------------------- */

/** Releases slots held by unpaid bookings that have gone stale. */
export async function releaseStalePendingBookings(): Promise<number> {
  const cutoff = new Date(Date.now() - PENDING_HOLD_MINUTES * 60_000);
  const stale = await prisma.booking.findMany({
    where: { status: "pending", createdAt: { lt: cutoff } },
    select: { id: true },
  });
  if (stale.length === 0) return 0;

  await prisma.booking.updateMany({
    where: { id: { in: stale.map((s) => s.id) } },
    data: { status: "cancelled", slotKey: null },
  });
  return stale.length;
}

async function busyIntervalsForDate(dateKey: string) {
  const rows = await prisma.booking.findMany({
    where: { date: dateKey, status: { in: SLOT_HOLDING_STATUSES } },
    select: { startMinutes: true, endMinutes: true },
  });
  return rows.map((r) => ({
    startMinutes: r.startMinutes,
    endMinutes: r.endMinutes,
  }));
}

export async function getAvailableSlots(dateKey: string, durationMin: number) {
  await releaseStalePendingBookings();

  const [rules, blocked, busy] = await Promise.all([
    getAvailabilityRules(),
    getBlockedDates(),
    busyIntervalsForDate(dateKey),
  ]);

  return computeSlots({
    dateKey,
    durationMin,
    windows: windowsForDate(dateKey, rules),
    busy,
    blocked: blocked.has(dateKey),
  });
}

/** Which of the next N days have at least one free slot — powers the calendar. */
export async function getDateAvailabilitySummary(
  startDateKey: string,
  days: number,
  durationMin: number,
) {
  await releaseStalePendingBookings();

  const { addDays } = await import("./time");
  const dateKeys = Array.from({ length: days }, (_, i) => addDays(startDateKey, i));

  const [rules, blocked, bookings] = await Promise.all([
    getAvailabilityRules(),
    getBlockedDates(),
    prisma.booking.findMany({
      where: { date: { in: dateKeys }, status: { in: SLOT_HOLDING_STATUSES } },
      select: { date: true, startMinutes: true, endMinutes: true },
    }),
  ]);

  const busyByDate = new Map<string, { startMinutes: number; endMinutes: number }[]>();
  for (const b of bookings) {
    const list = busyByDate.get(b.date) ?? [];
    list.push({ startMinutes: b.startMinutes, endMinutes: b.endMinutes });
    busyByDate.set(b.date, list);
  }

  return dateKeys.map((dateKey) => {
    const slots = computeSlots({
      dateKey,
      durationMin,
      windows: windowsForDate(dateKey, rules),
      busy: busyByDate.get(dateKey) ?? [],
      blocked: blocked.has(dateKey),
    });
    return { date: dateKey, slotCount: slots.length, available: slots.length > 0 };
  });
}

/* -------------------------------------------------------------------------- */
/* Free consultation eligibility                                              */
/* -------------------------------------------------------------------------- */

export type FreeEligibility = {
  eligible: boolean;
  reason?: "used" | "disabled";
  message?: string;
};

/**
 * Non-mutating check, used by the wizard to warn before the visitor fills in a
 * whole form. The authoritative check happens atomically at booking time.
 */
export async function checkFreeEligibility(
  email: string,
): Promise<FreeEligibility> {
  if (!(await getFreeConsultationEnabled())) {
    return {
      eligible: false,
      reason: "disabled",
      message:
        "Free consultations are paused at the moment. The paid sessions below are all available.",
    };
  }

  if (!freeConsultation.oncePerEmail) return { eligible: true };

  const customer = await prisma.customer.findUnique({
    where: { email: email.toLowerCase() },
    select: { freeConsultationUsedAt: true },
  });

  if (customer?.freeConsultationUsedAt) {
    return {
      eligible: false,
      reason: "used",
      message: freeConsultation.alreadyUsedMessage,
    };
  }

  return { eligible: true };
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export type CreateBookingResult = {
  reference: string;
  bookingId: string;
  amountInr: number;
  isFree: boolean;
  /** "free" when no payment is required. */
  provider: "mock" | "razorpay" | "free";
  orderId: string | null;
  publicKey: string | null;
};

export async function createBooking(input: {
  sessionSlug: string;
  categorySlug?: string;
  meetingProvider: MeetingProvider;
  date: string;
  startMinutes: number;
  details: BookingDetails;
}): Promise<CreateBookingResult> {
  const sessionType = await prisma.sessionType.findUnique({
    where: { slug: input.sessionSlug },
  });
  if (!sessionType || !sessionType.active) {
    throw new BookingError(
      "That session is no longer available.",
      "SESSION_NOT_FOUND",
    );
  }

  // The chosen meeting method must be one this session actually offers.
  const allowed = JSON.parse(sessionType.allowedProviders || "[]") as string[];
  if (allowed.length > 0 && !allowed.includes(input.meetingProvider)) {
    throw new BookingError(
      "That meeting method isn't available for this session.",
      "PROVIDER_NOT_ALLOWED",
    );
  }

  if (sessionType.isFree && !(await getFreeConsultationEnabled())) {
    throw new BookingError(
      "Free consultations are currently unavailable.",
      "FREE_DISABLED",
    );
  }

  const category = input.categorySlug
    ? await prisma.mentorshipCategory.findUnique({
        where: { slug: input.categorySlug },
      })
    : null;

  // Layer 2 — never trust the client's view of availability.
  const slots = await getAvailableSlots(input.date, sessionType.durationMin);
  const requested = slots.find((s) => s.startMinutes === input.startMinutes);
  if (!requested) {
    throw new BookingError(
      "That time is no longer available. Please pick another slot.",
      "SLOT_TAKEN",
    );
  }

  const customer = await prisma.customer.upsert({
    where: { email: input.details.email },
    create: {
      email: input.details.email,
      name: input.details.fullName,
      phone: input.details.phone,
      linkedin: input.details.linkedin,
      github: input.details.github,
    },
    update: {
      name: input.details.fullName,
      phone: input.details.phone ?? undefined,
      linkedin: input.details.linkedin ?? undefined,
      github: input.details.github ?? undefined,
    },
  });

  // --- Free consultation claim: atomic, so a double submit can't slip through.
  if (sessionType.isFree && freeConsultation.oncePerEmail) {
    const claimed = await prisma.customer.updateMany({
      where: { id: customer.id, freeConsultationUsedAt: null },
      data: { freeConsultationUsedAt: new Date() },
    });

    if (claimed.count === 0) {
      throw new BookingError(
        freeConsultation.alreadyUsedMessage,
        "FREE_ALREADY_USED",
      );
    }
  }

  const slotKey = `${input.date}#${input.startMinutes}`;

  // Layer 3 — the unique index settles any remaining race.
  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        reference: generateReference(),
        date: input.date,
        startMinutes: requested.startMinutes,
        endMinutes: requested.endMinutes,
        durationMin: sessionType.durationMin,
        priceInr: sessionType.priceInr,
        slotKey,
        // Free sessions are confirmed immediately — there is no payment step.
        status: sessionType.isFree ? "confirmed" : "pending",
        isFree: sessionType.isFree,
        meetingProvider: input.meetingProvider,
        topic: input.details.topic,
        helpWith: input.details.helpWith,
        message: input.details.notes,
        sessionTypeId: sessionType.id,
        categoryId: category?.id,
        customerId: customer.id,
      },
    });
  } catch (error) {
    // Release the free claim we just made, otherwise a lost race would burn it.
    if (sessionType.isFree && freeConsultation.oncePerEmail) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { freeConsultationUsedAt: null },
      });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new BookingError(
        "Someone just booked that slot. Please choose another time.",
        "SLOT_TAKEN",
      );
    }
    throw error;
  }

  // --- Free path: provision the meeting and confirm right away. --------------
  if (sessionType.isFree) {
    await provisionMeetingAndNotify(booking.id);
    return {
      reference: booking.reference,
      bookingId: booking.id,
      amountInr: 0,
      isFree: true,
      provider: "free",
      orderId: null,
      publicKey: null,
    };
  }

  // --- Paid path: create a payment order and hold the slot. ------------------
  const order = await createPaymentOrder({
    amountInr: sessionType.priceInr,
    reference: booking.reference,
    customerName: customer.name,
    customerEmail: customer.email,
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: order.provider,
      amountInr: order.amountInr,
      currency: order.currency,
      status: "created",
      orderId: order.orderId,
    },
  });

  return {
    reference: booking.reference,
    bookingId: booking.id,
    amountInr: sessionType.priceInr,
    isFree: false,
    provider: order.provider,
    orderId: order.orderId,
    publicKey: order.publicKey,
  };
}

/* -------------------------------------------------------------------------- */
/* Meeting provisioning + confirmation                                        */
/* -------------------------------------------------------------------------- */

/** Creates the meeting record and sends the confirmation emails. */
async function provisionMeetingAndNotify(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { sessionType: true, customer: true },
  });
  if (!booking) return;

  const meeting = await createMeeting({
    provider: booking.meetingProvider as MeetingProvider,
    reference: booking.reference,
    dateKey: booking.date,
    startMinutes: booking.startMinutes,
    durationMin: booking.durationMin,
    customerName: booking.customer.name,
    customerEmail: booking.customer.email,
    customerPhone: booking.customer.phone,
    sessionTitle: booking.sessionType.title,
  });

  await prisma.meeting.upsert({
    where: { bookingId: booking.id },
    create: {
      bookingId: booking.id,
      provider: meeting.provider,
      joinUrl: meeting.joinUrl,
      status: "scheduled",
      notes: meeting.instructions,
    },
    update: {
      provider: meeting.provider,
      joinUrl: meeting.joinUrl,
      notes: meeting.instructions,
    },
  });

  await notifyBookingConfirmed(
    {
      reference: booking.reference,
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      sessionTitle: booking.sessionType.title,
      dateKey: booking.date,
      startMinutes: booking.startMinutes,
      durationMin: booking.durationMin,
      priceInr: booking.priceInr,
      isFree: booking.isFree,
      meetingProvider: meeting.provider,
      joinUrl: meeting.joinUrl,
      helpWith: booking.helpWith,
    },
    booking.id,
  );
}

/** Marks a paid booking as paid, provisions the meeting and notifies. */
export async function confirmBooking(reference: string): Promise<string> {
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { payment: true, sessionType: true, customer: true },
  });
  if (!booking) throw new BookingError("Booking not found.", "NOT_FOUND");

  // Idempotent — a duplicate payment callback is harmless.
  if (booking.status === "confirmed" || booking.status === "completed") {
    return booking.reference;
  }

  const transaction = isMockPayments()
    ? settleMockPayment(booking.payment?.orderId ?? "")
    : null;

  if (booking.payment) {
    await prisma.payment.update({
      where: { bookingId: booking.id },
      data: {
        status: "paid",
        paidAt: new Date(),
        transactionId:
          transaction?.transactionId ?? booking.payment.transactionId,
      },
    });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "confirmed" },
  });

  await provisionMeetingAndNotify(booking.id);
  return booking.reference;
}

export async function attachRazorpayPayment(
  reference: string,
  paymentId: string,
) {
  const booking = await prisma.booking.findUnique({ where: { reference } });
  if (!booking) throw new BookingError("Booking not found.", "NOT_FOUND");
  await prisma.payment.update({
    where: { bookingId: booking.id },
    data: { transactionId: paymentId },
  });
}

/* -------------------------------------------------------------------------- */
/* Cancel                                                                     */
/* -------------------------------------------------------------------------- */

export async function cancelBooking(reference: string) {
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { sessionType: true, customer: true, meeting: true },
  });
  if (!booking) throw new BookingError("Booking not found.", "NOT_FOUND");

  // Setting slotKey to NULL is what actually frees the time for rebooking.
  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "cancelled", slotKey: null },
  });

  // A cancelled free consultation gives the person their free claim back.
  if (booking.isFree) {
    await prisma.customer.update({
      where: { id: booking.customerId },
      data: { freeConsultationUsedAt: null },
    });
  }

  if (booking.meeting) {
    await prisma.meeting.update({
      where: { bookingId: booking.id },
      data: { status: "cancelled" },
    });
  }

  await notifyCancelled(
    {
      reference: booking.reference,
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      sessionTitle: booking.sessionType.title,
      dateKey: booking.date,
      startMinutes: booking.startMinutes,
      durationMin: booking.durationMin,
      priceInr: booking.priceInr,
      isFree: booking.isFree,
      meetingProvider: booking.meetingProvider,
      joinUrl: null,
    },
    booking.id,
  );
}

export async function getBookingByReference(reference: string) {
  return prisma.booking.findUnique({
    where: { reference },
    include: {
      sessionType: true,
      category: true,
      customer: true,
      payment: true,
      meeting: true,
    },
  });
}
