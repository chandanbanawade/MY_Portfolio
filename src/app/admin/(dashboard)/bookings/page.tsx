import Link from "next/link";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, Badge, EmptyState } from "@/components/ui/primitives";
import { PageHeader, StatusBadge } from "../shared";
import { updateBookingStatusAction } from "../../actions";
import { formatInr, cn } from "@/lib/format";
import { formatDateLong, formatRange, formatDuration } from "@/lib/time";
import { meetingProviderLabels, type MeetingProvider } from "@/lib/types";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "all", label: "All" },
  { key: "pending", label: "Awaiting payment" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "upcoming" } = await searchParams;
  const { istToday } = await import("@/lib/time");
  const today = istToday();

  const where =
    filter === "upcoming"
      ? { date: { gte: today }, status: { in: ["pending", "confirmed"] } }
      : filter === "all"
        ? {}
        : { status: filter };

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      sessionType: true,
      category: true,
      customer: true,
      payment: true,
      meeting: true,
    },
    orderBy: [{ date: filter === "upcoming" ? "asc" : "desc" }, { startMinutes: "asc" }],
    take: 100,
  });

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Every session booked through the site. Cancelling releases the time slot and emails the customer."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/bookings?filter=${f.key}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "border-transparent bg-fg text-fg-inverse"
                : "border-line bg-surface text-fg-muted hover:text-fg",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings in this view"
          description="Try a different filter, or share your booking link to get your first session."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface-2 px-5 py-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-sm font-semibold text-fg">
                    {booking.reference}
                  </span>
                  <StatusBadge status={booking.status} />
                  {booking.isFree ? (
                    <Badge tone="success">Free consultation</Badge>
                  ) : (
                    booking.payment && (
                      <Badge
                        tone={
                          booking.payment.status === "paid" ? "success" : "neutral"
                        }
                      >
                        {booking.payment.status === "paid" ? "Paid" : "Unpaid"} ·{" "}
                        {booking.payment.provider}
                      </Badge>
                    )
                  )}
                </div>

                <span className="text-sm font-semibold text-fg">
                  {booking.isFree ? "Free" : formatInr(booking.priceInr)}
                </span>
              </div>

              <div className="grid gap-5 px-5 py-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
                    When
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-fg">
                    {formatDateLong(booking.date)}
                  </p>
                  <p className="text-sm text-fg-muted">
                    {formatRange(booking.startMinutes, booking.durationMin)} IST
                  </p>
                  <p className="mt-1 text-xs text-fg-subtle">
                    {booking.sessionType.title} ·{" "}
                    {formatDuration(booking.durationMin)}
                  </p>
                  {booking.category && (
                    <p className="mt-1 text-xs text-fg-subtle">
                      Focus: {booking.category.title}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
                    Who
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-fg">
                    {booking.customer.name}
                  </p>
                  <a
                    href={`mailto:${booking.customer.email}`}
                    className="mt-1 flex items-center gap-1.5 text-xs text-fg-muted hover:text-accent"
                  >
                    <Mail className="h-3 w-3" strokeWidth={1.8} />
                    {booking.customer.email}
                  </a>
                  {booking.customer.phone && (
                    <a
                      href={`tel:${booking.customer.phone}`}
                      className="mt-1 flex items-center gap-1.5 text-xs text-fg-muted hover:text-accent"
                    >
                      <Phone className="h-3 w-3" strokeWidth={1.8} />
                      {booking.customer.phone}
                    </a>
                  )}
                  {booking.customer.linkedin && (
                    <p className="mt-1 truncate text-xs text-fg-subtle">
                      {booking.customer.linkedin}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
                    Meeting
                  </p>
                  <p className="mt-1.5 text-sm text-fg">
                    {meetingProviderLabels[
                      (booking.meeting?.provider ??
                        booking.meetingProvider) as MeetingProvider
                    ] ?? booking.meetingProvider}
                  </p>
                  {booking.meeting?.joinUrl ? (
                    <a
                      href={booking.meeting.joinUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-1 flex items-center gap-1.5 break-all text-xs text-accent hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={1.8} />
                      Join link
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-fg-subtle">No link yet</p>
                  )}
                  <Link
                    href={`/booking/${booking.reference}`}
                    target="_blank"
                    className="mt-1 block text-xs text-fg-muted hover:text-accent"
                  >
                    View customer page →
                  </Link>
                </div>
              </div>

              {booking.helpWith && (
                <div className="border-t border-line px-5 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
                    Needs help with
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                    {booking.helpWith}
                  </p>
                  {booking.message && (
                    <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
                      {booking.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 border-t border-line bg-surface-2 px-5 py-3">
                {booking.status !== "confirmed" && booking.status !== "cancelled" && (
                  <StatusButton id={booking.id} status="confirmed" label="Mark confirmed" />
                )}
                {booking.status !== "completed" && booking.status !== "cancelled" && (
                  <StatusButton id={booking.id} status="completed" label="Mark completed" />
                )}
                {booking.status !== "cancelled" && (
                  <StatusButton
                    id={booking.id}
                    status="cancelled"
                    label="Cancel & release slot"
                    danger
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function StatusButton({
  id,
  status,
  label,
  danger,
}: {
  id: string;
  status: string;
  label: string;
  danger?: boolean;
}) {
  return (
    <form action={updateBookingStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={cn(
          "rounded-[var(--radius-sm)] border px-3 py-1.5 text-xs font-medium transition-colors",
          danger
            ? "border-[var(--danger)]/30 text-danger hover:bg-danger-soft"
            : "border-line bg-surface text-fg-muted hover:text-fg hover:border-line-strong",
        )}
      >
        {label}
      </button>
    </form>
  );
}
