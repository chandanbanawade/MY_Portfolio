import { Gift, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, Badge, Alert, EmptyState } from "@/components/ui/primitives";
import { PageHeader, StatCard } from "../shared";
import {
  toggleFreeConsultationAction,
  resetFreeConsultationAction,
} from "../../actions";
import { getFreeConsultationEnabled } from "@/lib/data";
import { freeConsultation } from "@/config/sessions";
import { formatDuration } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [enabled, freeSession, claimed, freeBookings] = await Promise.all([
    getFreeConsultationEnabled(),
    prisma.sessionType.findFirst({ where: { isFree: true } }),
    prisma.customer.findMany({
      where: { freeConsultationUsedAt: { not: null } },
      orderBy: { freeConsultationUsedAt: "desc" },
      take: 50,
    }),
    prisma.booking.count({ where: { isFree: true, status: { not: "cancelled" } } }),
  ]);

  return (
    <>
      <PageHeader
        title="Free consultation"
        description="Control the free trial session, and see who has already claimed theirs."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Status"
          value={enabled ? "Enabled" : "Disabled"}
          sublabel={enabled ? "Visible on the site" : "Hidden everywhere"}
          icon={<Gift className="h-4 w-4" strokeWidth={1.8} />}
        />
        <StatCard
          label="Consultations booked"
          value={String(freeBookings)}
          sublabel="Excluding cancellations"
        />
        <StatCard
          label="Emails that claimed"
          value={String(claimed.length)}
          sublabel="One free session each"
        />
      </div>

      {/* --- Toggle --- */}
      <Card className="mt-8 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-lg">
            <h2 className="text-sm font-semibold text-fg">
              Free consultation offer
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
              When enabled, the free session appears in the hero, the navbar, the
              pricing ladder and the booking wizard. Disabling it removes every
              reference across the site immediately — existing bookings are not
              affected.
            </p>

            {freeSession ? (
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-fg-subtle">Session</dt>
                  <dd className="mt-0.5 font-medium text-fg">
                    {freeSession.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-fg-subtle">Duration</dt>
                  <dd className="mt-0.5 font-medium text-fg">
                    {formatDuration(freeSession.durationMin)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-fg-subtle">Eligibility</dt>
                  <dd className="mt-0.5 font-medium text-fg">
                    {freeConsultation.oncePerEmail
                      ? "One per email address"
                      : "Unlimited"}
                  </dd>
                </div>
              </dl>
            ) : (
              <Alert tone="warning" className="mt-4">
                No free session exists in the database. Add one to{" "}
                <code className="font-mono text-[0.6875rem]">
                  src/config/sessions.ts
                </code>{" "}
                with <code className="font-mono text-[0.6875rem]">isFree: true</code>{" "}
                and run <code className="font-mono text-[0.6875rem]">npm run db:seed</code>.
              </Alert>
            )}
          </div>

          <form action={toggleFreeConsultationAction} className="shrink-0">
            <input type="hidden" name="enabled" value={String(!enabled)} />
            <button
              type="submit"
              className={`rounded-[var(--radius)] border px-4 py-2.5 text-sm font-medium transition-colors ${
                enabled
                  ? "border-[var(--danger)]/30 text-danger hover:bg-danger-soft"
                  : "border-transparent bg-fg text-fg-inverse hover:bg-accent hover:text-white"
              }`}
            >
              {enabled ? "Disable free consultation" : "Enable free consultation"}
            </button>
          </form>
        </div>

        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-fg-subtle">
          Duration, description and meeting methods for the free session are
          edited on the{" "}
          <a href="/admin/sessions" className="text-accent hover:underline">
            Sessions &amp; Pricing
          </a>{" "}
          page. Its price is locked at ₹0.
        </p>
      </Card>

      {/* --- Who has claimed --- */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-fg">
          Free consultation claimed by
        </h2>

        {claimed.length === 0 ? (
          <EmptyState
            title="Nobody has claimed one yet"
            description="Emails appear here once they book the free consultation."
          />
        ) : (
          <Card className="divide-y divide-[var(--border)]">
            {claimed.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">
                    {customer.name}
                  </p>
                  <p className="truncate text-xs text-fg-subtle">
                    {customer.email}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge tone="neutral">
                    {customer.freeConsultationUsedAt
                      ?.toISOString()
                      .slice(0, 10)}
                  </Badge>
                  {/* Lets you grant an exception without touching the database. */}
                  <form action={resetFreeConsultationAction}>
                    <input type="hidden" name="email" value={customer.email} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-line px-2.5 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      <RotateCcw className="h-3 w-3" strokeWidth={1.8} />
                      Grant again
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>
    </>
  );
}
