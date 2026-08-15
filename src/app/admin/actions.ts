"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  authenticate,
  createSession,
  destroySession,
  requireAdmin,
} from "@/lib/auth";
import {
  adminLoginSchema,
  availabilityRuleSchema,
  sessionTypeUpdateSchema,
  categoryUpdateSchema,
  packageUpdateSchema,
} from "@/lib/validation";
import { cancelBooking } from "@/lib/bookings";
import { setFreeConsultationEnabled } from "@/lib/data";
import { timeToMinutes, isValidDateKey } from "@/lib/time";
import type { BookingStatus } from "@/lib/types";

export type ActionState = { error?: string; success?: string };

/* --- Auth ----------------------------------------------------------------- */

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: "Enter a valid email and password." };

  const admin = await authenticate(parsed.data.email, parsed.data.password);
  // Deliberately vague — don't reveal whether the email exists.
  if (!admin) return { error: "Incorrect email or password." };

  await createSession(admin);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* --- Bookings ------------------------------------------------------------- */

export async function updateBookingStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as BookingStatus;

  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) return;

  if (status === "cancelled") {
    // Routed through the service so the slot is released, the free-consultation
    // claim is returned, and the customer is notified.
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (booking) await cancelBooking(booking.reference);
  } else {
    await prisma.booking.update({ where: { id }, data: { status } });
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

/* --- Session types -------------------------------------------------------- */

export async function updateSessionTypeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = sessionTypeUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    tagline: formData.get("tagline"),
    durationMin: formData.get("durationMin"),
    priceInr: formData.get("priceInr"),
    description: formData.get("description"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values." };
  }

  const { id, ...data } = parsed.data;

  // Meeting methods offered for this session.
  const providers = formData.getAll("providers").map(String);

  const existing = await prisma.sessionType.findUnique({ where: { id } });
  if (!existing) return { error: "Session not found." };

  // A free session must stay ₹0 — otherwise the free-consultation logic and the
  // pricing UI would disagree with each other.
  if (existing.isFree && data.priceInr !== 0) {
    return {
      error:
        "The free consultation must stay at ₹0. Create a separate paid session instead.",
    };
  }

  await prisma.sessionType.update({
    where: { id },
    data: {
      ...data,
      ...(providers.length > 0
        ? { allowedProviders: JSON.stringify(providers) }
        : {}),
    },
  });

  revalidatePath("/admin/sessions");
  revalidatePath("/");
  revalidatePath("/book");
  return { success: "Saved." };
}

/* --- Free consultation ---------------------------------------------------- */

export async function toggleFreeConsultationAction(formData: FormData) {
  await requireAdmin();
  await setFreeConsultationEnabled(formData.get("enabled") === "true");

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/book");
}

/** Returns a customer's free consultation, so it can be granted again. */
export async function resetFreeConsultationAction(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return;

  await prisma.customer.updateMany({
    where: { email },
    data: { freeConsultationUsedAt: null },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin/customers");
}

/* --- Categories ----------------------------------------------------------- */

export async function updateCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = categoryUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values." };
  }

  const { id, ...data } = parsed.data;
  await prisma.mentorshipCategory.update({ where: { id }, data });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/book");
  return { success: "Saved." };
}

export async function toggleCategoryActiveAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const category = await prisma.mentorshipCategory.findUnique({ where: { id } });
  if (!category) return;

  await prisma.mentorshipCategory.update({
    where: { id },
    data: { active: !category.active },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

/* --- Packages ------------------------------------------------------------- */

export async function updatePackageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = packageUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    sessionCount: formData.get("sessionCount"),
    durationMin: formData.get("durationMin"),
    priceInr: formData.get("priceInr"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the values." };
  }

  const { id, ...data } = parsed.data;
  await prisma.mentorshipPackage.update({ where: { id }, data });

  revalidatePath("/admin/packages");
  revalidatePath("/");
  return { success: "Saved." };
}

/* --- Availability --------------------------------------------------------- */

export async function addAvailabilityRuleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = availabilityRuleSchema.safeParse({
    dayOfWeek: formData.get("dayOfWeek"),
    start: formData.get("start"),
    end: formData.get("end"),
  });

  if (!parsed.success) return { error: "Enter a valid day and time range." };

  const startMinutes = timeToMinutes(parsed.data.start);
  const endMinutes = timeToMinutes(parsed.data.end);

  if (endMinutes <= startMinutes) {
    return { error: "The end time must be after the start time." };
  }

  await prisma.availabilityRule.create({
    data: {
      dayOfWeek: parsed.data.dayOfWeek,
      startMinutes,
      endMinutes,
      active: true,
    },
  });

  revalidatePath("/admin/availability");
  return { success: "Window added." };
}

export async function deleteAvailabilityRuleAction(formData: FormData) {
  await requireAdmin();
  await prisma.availabilityRule.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidatePath("/admin/availability");
}

export async function addBlockedDateAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const date = String(formData.get("date"));
  const reason = String(formData.get("reason") ?? "").trim();

  if (!isValidDateKey(date)) return { error: "Choose a valid date." };

  await prisma.blockedDate.upsert({
    where: { date },
    create: { date, reason: reason || null },
    update: { reason: reason || null },
  });

  revalidatePath("/admin/availability");
  return { success: "Date blocked." };
}

export async function deleteBlockedDateAction(formData: FormData) {
  await requireAdmin();
  await prisma.blockedDate.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/availability");
}

/* --- Ratings -------------------------------------------------------------- */

/**
 * Ratings arrive unpublished. Approving one is the only way it reaches the
 * public page — nothing is ever auto-published or fabricated.
 */
export async function toggleReviewPublishedAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return;

  await prisma.review.update({
    where: { id },
    data: { published: !review.published },
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
