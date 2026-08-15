import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, Badge, EmptyState } from "@/components/ui/primitives";
import { PageHeader } from "../shared";
import {
  deleteAvailabilityRuleAction,
  deleteBlockedDateAction,
} from "../../actions";
import { AvailabilityForms } from "./forms";
import { dayNames } from "@/config/availability";
import { minutesToLabel, formatDateLong, istToday } from "@/lib/time";
import { bookingRules } from "@/config/sessions";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const today = istToday();

  const [rules, blocked] = await Promise.all([
    prisma.availabilityRule.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { startMinutes: "asc" }],
    }),
    prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
  ]);

  const byDay = dayNames.map((name, index) => ({
    name,
    index,
    windows: rules.filter((r) => r.dayOfWeek === index),
  }));

  return (
    <>
      <PageHeader
        title="Availability"
        description="Weekly windows when you take sessions, plus specific dates you're unavailable. All times are IST."
      />

      <Card className="mb-6 p-5">
        <h2 className="text-sm font-semibold text-fg">Current booking rules</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-fg-subtle">Minimum notice</dt>
            <dd className="mt-0.5 font-medium text-fg">
              {bookingRules.minNoticeHours} hours
            </dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Booking window</dt>
            <dd className="mt-0.5 font-medium text-fg">
              {bookingRules.bookingWindowDays} days ahead
            </dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Buffer between sessions</dt>
            <dd className="mt-0.5 font-medium text-fg">
              {bookingRules.bufferMinutes} minutes
            </dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Slot grid</dt>
            <dd className="mt-0.5 font-medium text-fg">
              Every {bookingRules.slotGranularityMinutes} minutes
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-fg-subtle">
          These are set in{" "}
          <code className="font-mono">src/config/sessions.ts</code> →{" "}
          <code className="font-mono">bookingRules</code>.
        </p>
      </Card>

      <AvailabilityForms />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg">Weekly schedule</h2>
          <Card className="divide-y divide-[var(--border)]">
            {byDay.map((day) => (
              <div key={day.index} className="flex items-start gap-4 px-4 py-3">
                <span className="w-24 shrink-0 text-sm font-medium text-fg">
                  {day.name}
                </span>
                <div className="flex flex-1 flex-wrap gap-2">
                  {day.windows.length === 0 ? (
                    <span className="text-sm text-fg-subtle">Unavailable</span>
                  ) : (
                    day.windows.map((window) => (
                      <form
                        key={window.id}
                        action={deleteAvailabilityRuleAction}
                        className="inline-flex"
                      >
                        <input type="hidden" name="id" value={window.id} />
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-1 pl-2.5 pr-1 text-xs font-medium text-fg-muted">
                          {minutesToLabel(window.startMinutes)} –{" "}
                          {minutesToLabel(window.endMinutes)}
                          <button
                            type="submit"
                            aria-label="Remove this window"
                            className="rounded-full p-0.5 text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger"
                          >
                            <Trash2 className="h-3 w-3" strokeWidth={1.8} />
                          </button>
                        </span>
                      </form>
                    ))
                  )}
                </div>
              </div>
            ))}
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg">Blocked dates</h2>
          {blocked.length === 0 ? (
            <EmptyState
              title="No blocked dates"
              description="Block a date above when you're travelling or unavailable."
            />
          ) : (
            <Card className="divide-y divide-[var(--border)]">
              {blocked.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg">
                      {formatDateLong(item.date)}
                    </p>
                    {item.reason && (
                      <p className="text-xs text-fg-subtle">{item.reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.date < today && <Badge tone="neutral">Past</Badge>}
                    <form action={deleteBlockedDateAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        aria-label="Unblock this date"
                        className="rounded-[var(--radius-sm)] p-1.5 text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
