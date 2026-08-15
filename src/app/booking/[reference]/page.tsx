import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Gift,
  Hash,
  Mail,
  Tag,
  User,
  Video,
  Wallet,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Card, Badge, Alert } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { getBookingByReference } from "@/lib/bookings";
import { site } from "@/config/site";
import { formatInr } from "@/lib/format";
import { formatDateLong, formatRange, formatDuration } from "@/lib/time";
import { meetingProviderLabels, type MeetingProvider } from "@/lib/types";
import { AddToCalendar } from "./add-to-calendar";

export const dynamic = "force-dynamic";

// Confirmation pages contain personal details — keep them out of search results.
export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await getBookingByReference(reference.toUpperCase());

  if (!booking) notFound();

  const isCancelled = booking.status === "cancelled";
  const provider = (booking.meeting?.provider ??
    booking.meetingProvider) as MeetingProvider;
  const isFree = booking.isFree || booking.priceInr === 0;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container-page max-w-3xl">
          {isCancelled ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft">
                <Hash className="h-6 w-6 text-danger" strokeWidth={2} />
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight">
                This booking was cancelled
              </h1>
              <p className="mt-3 text-fg-muted">
                Booking {booking.reference} is no longer active and the time slot
                has been released.
              </p>
              <ButtonLink href="/book" size="lg" className="mt-7">
                Book a new session
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                    isFree ? "bg-success-soft" : "bg-success-soft"
                  }`}
                >
                  {isFree ? (
                    <Gift className="h-7 w-7 text-success" strokeWidth={2} />
                  ) : (
                    <CheckCircle2 className="h-7 w-7 text-success" strokeWidth={2} />
                  )}
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                  {isFree
                    ? "Your free consultation is confirmed."
                    : "Your mentorship session is booked!"}
                </h1>

                <p className="mt-3 text-[1.0625rem] leading-relaxed text-fg-muted">
                  A confirmation has been sent to{" "}
                  <span className="font-medium text-fg">
                    {booking.customer.email}
                  </span>
                  . Save the booking ID below — you&apos;ll need it to reschedule.
                </p>
              </div>

              <Card className="mt-10 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-fg-subtle" strokeWidth={2} />
                    <span className="font-mono text-lg font-semibold tracking-tight text-fg">
                      {booking.reference}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isFree && (
                      <Badge tone="success">
                        <Gift className="h-3 w-3" strokeWidth={2} />
                        Free consultation
                      </Badge>
                    )}
                    <Badge
                      tone={booking.status === "confirmed" ? "success" : "warning"}
                    >
                      {booking.status === "confirmed"
                        ? "Confirmed"
                        : "Awaiting payment"}
                    </Badge>
                  </div>
                </div>

                <dl className="divide-y divide-[var(--border)]">
                  <DetailRow
                    icon={<User className="h-4 w-4" strokeWidth={1.8} />}
                    label="Mentor"
                    value={`${site.name} · ${site.role}`}
                  />
                  <DetailRow
                    icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />}
                    label="Session"
                    value={booking.sessionType.title}
                  />
                  {booking.category && (
                    <DetailRow
                      icon={<Tag className="h-4 w-4" strokeWidth={1.8} />}
                      label="Mentorship area"
                      value={booking.category.title}
                    />
                  )}
                  <DetailRow
                    icon={<CalendarDays className="h-4 w-4" strokeWidth={1.8} />}
                    label="Date"
                    value={formatDateLong(booking.date)}
                  />
                  <DetailRow
                    icon={<Clock className="h-4 w-4" strokeWidth={1.8} />}
                    label="Time"
                    value={`${formatRange(booking.startMinutes, booking.durationMin)} ${site.timezoneLabel}`}
                  />
                  <DetailRow
                    icon={<Clock className="h-4 w-4" strokeWidth={1.8} />}
                    label="Duration"
                    value={formatDuration(booking.durationMin)}
                  />
                  <DetailRow
                    icon={<Video className="h-4 w-4" strokeWidth={1.8} />}
                    label="Meeting method"
                    value={meetingProviderLabels[provider] ?? provider}
                  />
                  <DetailRow
                    icon={<Wallet className="h-4 w-4" strokeWidth={1.8} />}
                    label="Payment"
                    value={
                      isFree
                        ? "Free — nothing to pay"
                        : booking.payment?.status === "paid"
                          ? `${formatInr(booking.priceInr)} · Paid`
                          : `${formatInr(booking.priceInr)} · Pending`
                    }
                  />
                </dl>

                <div className="border-t border-line bg-surface-2 px-6 py-5">
                  {booking.meeting?.joinUrl ? (
                    <>
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
                        Meeting link
                      </p>
                      <a
                        href={booking.meeting.joinUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-2 inline-block break-all text-sm font-medium text-accent hover:underline"
                      >
                        {booking.meeting.joinUrl}
                      </a>
                      {booking.meeting.notes && (
                        <p className="mt-2 text-xs text-fg-muted">
                          {booking.meeting.notes}
                        </p>
                      )}
                    </>
                  ) : (
                    <Alert tone="accent">
                      {booking.meeting?.notes ??
                        "Your meeting link will be emailed to you before the session."}
                    </Alert>
                  )}
                </div>
              </Card>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <AddToCalendar
                  title={`${booking.sessionType.title} with ${site.name}`}
                  date={booking.date}
                  startMinutes={booking.startMinutes}
                  durationMin={booking.durationMin}
                  description={`Mentorship session. Booking ID ${booking.reference}.${
                    booking.meeting?.joinUrl ? ` Join: ${booking.meeting.joinUrl}` : ""
                  }`}
                  location={booking.meeting?.joinUrl ?? "Online"}
                />
                <ButtonLink
                  href={`mailto:${site.contact.email}?subject=Booking ${booking.reference}`}
                  variant="secondary"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                  Contact me about this booking
                </ButtonLink>
              </div>

              <div className="mt-10 rounded-[var(--radius-lg)] border border-line bg-surface-2 p-6">
                <h2 className="text-sm font-semibold text-fg">What happens next</h2>
                <ol className="mt-3 space-y-2.5 text-sm text-fg-muted">
                  <li className="flex gap-2.5">
                    <span className="font-mono text-xs text-fg-subtle">01</span>
                    You&apos;ll get a confirmation email with these details.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-mono text-xs text-fg-subtle">02</span>
                    I read what you&apos;ve sent and prepare before the call.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-mono text-xs text-fg-subtle">03</span>
                    Reminders go out 24 hours and 1 hour before the session.
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-mono text-xs text-fg-subtle">04</span>
                    We meet, and you leave with concrete next steps.
                  </li>
                  {isFree && (
                    <li className="flex gap-2.5">
                      <span className="font-mono text-xs text-fg-subtle">05</span>
                      If a longer session would help, I&apos;ll tell you which one
                      — and if it wouldn&apos;t, I&apos;ll tell you that too.
                    </li>
                  )}
                </ol>

                <p className="mt-5 text-xs leading-relaxed text-fg-subtle">
                  Need to reschedule? Email{" "}
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="text-accent hover:underline"
                  >
                    {site.contact.email}
                  </a>{" "}
                  with booking ID {booking.reference} at least 12 hours before.
                </p>
              </div>

              <p className="mt-8 text-center text-sm">
                <Link href="/" className="text-fg-muted hover:text-accent">
                  Back to portfolio
                </Link>
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-3.5">
      <dt className="flex items-center gap-2 text-sm text-fg-muted">
        <span className="text-fg-subtle">{icon}</span>
        {label}
      </dt>
      <dd className="text-right text-sm font-medium text-fg">{value}</dd>
    </div>
  );
}
