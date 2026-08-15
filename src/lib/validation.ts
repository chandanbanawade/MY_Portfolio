import { z } from "zod";
import { isValidDateKey } from "./time";
import { MEETING_PROVIDERS } from "./types";
import { feedbackSettings } from "@/config/testimonials";

/** Optional free-text field: "" becomes undefined rather than an empty string. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

export const bookingDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "That name looks too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(120),
  phone: optionalText(20).refine(
    (v) => v === undefined || /^[+\d][\d\s()-]{6,19}$/.test(v),
    "Enter a valid phone number",
  ),
  linkedin: optionalText(200),
  github: optionalText(200),
  topic: optionalText(120),
  helpWith: z
    .string()
    .trim()
    .min(10, "Tell me a little about what you need — at least a sentence")
    .max(500),
  notes: optionalText(1000),
});

export type BookingDetails = z.infer<typeof bookingDetailsSchema>;

export const createBookingSchema = z.object({
  sessionSlug: z.string().trim().min(1, "Choose a session"),
  categorySlug: z.string().trim().optional(),
  meetingProvider: z.enum(MEETING_PROVIDERS, {
    errorMap: () => ({ message: "Choose how you'd like to meet" }),
  }),
  date: z.string().trim().refine(isValidDateKey, "Choose a valid date"),
  startMinutes: z
    .number()
    .int()
    .min(0)
    .max(24 * 60 - 1),
  details: bookingDetailsSchema,
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const slotsQuerySchema = z.object({
  date: z.string().refine(isValidDateKey, "Invalid date"),
  duration: z.coerce.number().int().min(5).max(480),
});

/** Checks whether an email has already claimed the free consultation. */
export const freeEligibilityQuerySchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

// --- Ratings ----------------------------------------------------------------

export const reviewSubmissionSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, "Choose a rating")
    .max(5, "Choose a rating"),
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "That name looks too long"),
  role: optionalText(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(120),
  /** Optional written feedback. */
  comment: z
    .string()
    .trim()
    .max(
      feedbackSettings.maxCommentLength,
      `Please keep this under ${feedbackSettings.maxCommentLength} characters`,
    )
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined))
    .refine(
      (v) => v === undefined || v.length >= feedbackSettings.minCommentLength,
      `If you leave a comment, please write at least ${feedbackSettings.minCommentLength} characters`,
    ),
  /** Booking ID, so a rating can be tied to a real session. */
  reference: optionalText(20),
});

export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;

// --- Admin ------------------------------------------------------------------

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  start: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
});

export const sessionTypeUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2).max(80),
  tagline: z.string().trim().max(120),
  durationMin: z.coerce.number().int().min(5).max(480),
  priceInr: z.coerce.number().int().min(0).max(1_000_000),
  description: z.string().trim().max(600),
  active: z.coerce.boolean(),
});

export const categoryUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2).max(90),
  description: z.string().trim().max(400),
  active: z.coerce.boolean(),
});

export const packageUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().max(400),
  sessionCount: z.coerce.number().int().min(1).max(52),
  durationMin: z.coerce.number().int().min(5).max(480),
  priceInr: z.coerce.number().int().min(0).max(1_000_000),
  active: z.coerce.boolean(),
});

/** Flattens a ZodError into { field: message } for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
