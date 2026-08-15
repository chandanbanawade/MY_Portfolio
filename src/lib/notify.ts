/**
 * NOTIFICATIONS
 * -----------------------------------------------------------------------------
 * Every outbound message goes through `dispatch()`, which writes a row to
 * NotificationLog and then hands off to a transport.
 *
 * With no email provider configured, the transport is the console + database —
 * so the full notification flow is observable and testable today, and you can
 * see exactly what would have been sent from /admin/notifications.
 *
 * To go live, implement `sendEmail` with Resend, SendGrid or SMTP. Nothing else
 * in the app needs to change.
 */

import { prisma } from "./prisma";
import { site } from "@/config/site";
import { formatDateLong, formatRange, formatDuration } from "./time";
import { formatInr } from "./format";
import { meetingProviderLabels, type MeetingProvider } from "./types";

export type NotificationTemplate =
  | "booking_confirmed"
  | "mentor_alert"
  | "reminder_24h"
  | "reminder_1h"
  | "thank_you"
  | "cancelled";

export type BookingNotificationData = {
  reference: string;
  customerName: string;
  customerEmail: string;
  sessionTitle: string;
  dateKey: string;
  startMinutes: number;
  durationMin: number;
  priceInr: number;
  isFree?: boolean;
  meetingProvider: string;
  joinUrl: string | null;
  helpWith?: string | null;
};

function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.SMTP_URL);
}

async function sendEmail(to: string, subject: string, body: string) {
  if (!emailConfigured()) {
    // Placeholder transport — logged, not silently dropped.
    console.log(
      `\n[notification] → ${to}\n  subject: ${subject}\n${body
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n")}\n`,
    );
    return { status: "logged" as const };
  }

  // PRODUCTION PATH — example with Resend:
  //
  // const res = await fetch("https://api.resend.com/emails", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     from: process.env.MAIL_FROM,
  //     to, subject, text: body,
  //   }),
  // });
  // return { status: res.ok ? ("sent" as const) : ("failed" as const) };

  return { status: "logged" as const };
}

async function dispatch(params: {
  channel: "email" | "whatsapp" | "console";
  template: NotificationTemplate;
  recipient: string;
  subject: string;
  body: string;
  bookingId?: string;
}) {
  const result = await sendEmail(params.recipient, params.subject, params.body);

  try {
    await prisma.notificationLog.create({
      data: {
        channel: params.channel,
        template: params.template,
        recipient: params.recipient,
        subject: params.subject,
        body: params.body,
        status: result.status,
        bookingId: params.bookingId,
      },
    });
  } catch (error) {
    // A logging failure must never break a confirmed booking.
    console.error("[notification] failed to persist log", error);
  }
}

function sessionSummary(data: BookingNotificationData): string {
  return [
    `Session:    ${data.sessionTitle}`,
    `Duration:   ${formatDuration(data.durationMin)}`,
    `Date:       ${formatDateLong(data.dateKey)}`,
    `Time:       ${formatRange(data.startMinutes, data.durationMin)} ${site.timezoneLabel}`,
    `Meeting:    ${meetingProviderLabels[data.meetingProvider as MeetingProvider] ?? data.meetingProvider}`,
    `Amount:     ${data.isFree || data.priceInr === 0 ? "Free" : formatInr(data.priceInr)}`,
    `Booking ID: ${data.reference}`,
    data.joinUrl ? `Join:       ${data.joinUrl}` : `Join:       link to follow by email`,
  ].join("\n");
}

export async function notifyBookingConfirmed(
  data: BookingNotificationData,
  bookingId: string,
) {
  const isFree = Boolean(data.isFree) || data.priceInr === 0;

  await dispatch({
    channel: "email",
    template: "booking_confirmed",
    recipient: data.customerEmail,
    subject: isFree
      ? `Your free consultation is confirmed — ${data.reference}`
      : `Your mentorship session is booked — ${data.reference}`,
    body: [
      `Hi ${data.customerName},`,
      ``,
      isFree
        ? `Your free consultation with ${site.name} is confirmed. There's nothing to pay.`
        : `Your session with ${site.name} is confirmed.`,
      ``,
      sessionSummary(data),
      ``,
      `Come with your specific questions ready — the more concrete they are, the more we get through.`,
      ``,
      `Need to reschedule? Reply to this email with your booking ID at least 12 hours before.`,
      ``,
      `— ${site.name}`,
    ].join("\n"),
    bookingId,
  });

  await dispatch({
    channel: "email",
    template: "mentor_alert",
    recipient: site.contact.email,
    subject: `${isFree ? "New FREE consultation" : "New booking"}: ${data.sessionTitle} — ${formatDateLong(data.dateKey)}`,
    body: [
      isFree ? `New free consultation booked.` : `New mentorship booking.`,
      ``,
      `Name:  ${data.customerName}`,
      `Email: ${data.customerEmail}`,
      data.helpWith ? `Topic: ${data.helpWith}` : ``,
      ``,
      sessionSummary(data),
    ]
      .filter(Boolean)
      .join("\n"),
    bookingId,
  });
}

export async function notifyReminder(
  data: BookingNotificationData,
  bookingId: string,
  which: "reminder_24h" | "reminder_1h",
) {
  const when = which === "reminder_24h" ? "tomorrow" : "in one hour";
  await dispatch({
    channel: "email",
    template: which,
    recipient: data.customerEmail,
    subject: `Reminder: your session is ${when} — ${data.reference}`,
    body: [
      `Hi ${data.customerName},`,
      ``,
      `A quick reminder that your mentorship session is ${when}.`,
      ``,
      sessionSummary(data),
      ``,
      `— ${site.name}`,
    ].join("\n"),
    bookingId,
  });
}

export async function notifyCancelled(
  data: BookingNotificationData,
  bookingId: string,
) {
  await dispatch({
    channel: "email",
    template: "cancelled",
    recipient: data.customerEmail,
    subject: `Session cancelled — ${data.reference}`,
    body: [
      `Hi ${data.customerName},`,
      ``,
      `Your session on ${formatDateLong(data.dateKey)} has been cancelled and the slot released.`,
      `If a refund applies it will be processed to your original payment method.`,
      ``,
      `— ${site.name}`,
    ].join("\n"),
    bookingId,
  });
}

export async function notifyThankYou(
  data: BookingNotificationData,
  bookingId: string,
) {
  await dispatch({
    channel: "email",
    template: "thank_you",
    recipient: data.customerEmail,
    subject: `Thanks for the session — ${data.reference}`,
    body: [
      `Hi ${data.customerName},`,
      ``,
      `Thanks for your time today. If the session was useful, a short testimonial would help a lot.`,
      `And if anything from our conversation needs clarifying, just reply here.`,
      ``,
      `— ${site.name}`,
    ].join("\n"),
    bookingId,
  });
}
