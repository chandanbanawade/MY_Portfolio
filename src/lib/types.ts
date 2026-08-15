/**
 * Status unions. The database stores these as plain strings so the schema stays
 * portable between SQLite and PostgreSQL; these types are the contract everything
 * in the app codes against.
 */

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "created",
  "paid",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const MEETING_PROVIDERS = [
  "google_meet",
  "zoom",
  "voice_call",
  "whatsapp",
] as const;
export type MeetingProvider = (typeof MEETING_PROVIDERS)[number];

export const MEETING_STATUSES = ["scheduled", "completed", "cancelled"] as const;
export type MeetingStatus = (typeof MEETING_STATUSES)[number];

/** A booking still occupies its slot unless it has been cancelled. */
export const SLOT_HOLDING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
];

export const statusLabels: Record<BookingStatus, string> = {
  pending: "Awaiting payment",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const meetingProviderLabels: Record<MeetingProvider, string> = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  voice_call: "Voice Call",
  whatsapp: "Phone / WhatsApp Call",
};
