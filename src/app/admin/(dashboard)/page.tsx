import Link from "next/link";
import {
  CalendarDays,
  CircleDollarSign,
  Clock,
  TriangleAlert,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, Alert, EmptyState } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader, StatCard, StatusBadge } from "./shared";
import { formatInr } from "@/lib/format";
import { formatDateShort, formatRange, istToday } from "@/lib/time";
import { isMockPayments } from "@/lib/payments";
import { SLOT_HOLDING_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const today = istToday();

  const [
    totalBookings,
    upcomingCount,
    customerCount,
    paidAggregate,
    upcoming,
    recent,
    pendingCount,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({
      where: { date: { gte: today }, status: { in: SLOT_HOLDING_STATUSES } },
    }),
    prisma.customer.count(),
    prisma.payment.aggregate({
      _sum: { amountInr: true },
      where: { status: "paid" },
    }),
    prisma.booking.findMany({
      where: { date: { gte: today }, status: { in: ["pending", "confirmed"] } },
      include: { sessionType: true, customer: true },
      orderBy: [{ date: "asc" }, { startMinutes: "asc" }],
      take: 6,
    }),
    prisma.booking.findMany({
      include: { sessionType: true, customer: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.booking.count({ where: { status: "pending" } }),
  ]);

  const revenue = paidAggregate._sum.amountInr ?? 0;

  return (
    <>
      <PageHeader
        title="Overview"
        description="Your bookings, revenue and what's coming up next."
        action={
          <ButtonLink href="/book" target="_blank" variant="secondary" size="sm">
            Open booking page
          </ButtonLink>
        }
      />

      {isMockPayments() && (
        <Alert tone="warning" title="Payments are in test mode" className="mb-6">
          <span className="flex items-start gap-2">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span>
              No Razorpay keys are configured, so checkout is simulated and no
              money is collected. Add{" "}
              <code className="font-mono text-[0.6875rem]">RAZORPAY_KEY_ID</code>{" "}
              and{" "}
              <code className="font-mono text-[0.6875rem]">RAZORPAY_KEY_SECRET</code>{" "}
              to <code className="font-mono text-[0.6875rem]">.env</code> before
              you launch.
            </span>
          </span>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={String(totalBookings)}
          sublabel={`${pendingCount} awaiting payment`}
          icon={<CalendarDays className="h-4 w-4" strokeWidth={1.8} />}
        />
        <StatCard
          label="Upcoming"
          value={String(upcomingCount)}
          sublabel="Today and later"
          icon={<Clock className="h-4 w-4" strokeWidth={1.8} />}
        />
        <StatCard
          label="Revenue collected"
          value={formatInr(revenue)}
          sublabel="Paid payments only"
          icon={<CircleDollarSign className="h-4 w-4" strokeWidth={1.8} />}
        />
        <StatCard
          label="Customers"
          value={String(customerCount)}
          sublabel="Unique people"
          icon={<Users className="h-4 w-4" strokeWidth={1.8} />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg">Next up</h2>
          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming sessions"
              description="New bookings will appear here as they come in."
            />
          ) : (
            <Card className="divide-y divide-[var(--border)]">
              {upcoming.map((booking) => (
                <Link
                  key={booking.id}
                  href="/admin/bookings"
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">
                      {booking.customer.name}
                    </p>
                    <p className="truncate text-xs text-fg-subtle">
                      {booking.sessionType.title} ·{" "}
                      {formatDateShort(booking.date)} ·{" "}
                      {formatRange(booking.startMinutes, booking.durationMin)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </Link>
              ))}
            </Card>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg">Recent activity</h2>
          {recent.length === 0 ? (
            <EmptyState
              title="Nothing booked yet"
              description="Share your booking link to get started."
            />
          ) : (
            <Card className="divide-y divide-[var(--border)]">
              {recent.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">
                      {booking.reference}
                    </p>
                    <p className="truncate text-xs text-fg-subtle">
                      {booking.customer.email} · {formatInr(booking.priceInr)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
