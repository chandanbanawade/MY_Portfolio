import { Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, Badge, EmptyState } from "@/components/ui/primitives";
import { PageHeader } from "../shared";
import { formatInr } from "@/lib/format";
import { formatDateShort } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      bookings: {
        include: { sessionType: true, payment: true },
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <>
      <PageHeader
        title="Customers"
        description="Everyone who has booked, with their full session history."
      />

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="People appear here automatically once they book a session."
        />
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => {
            const paid = customer.bookings
              .filter((b) => b.payment?.status === "paid")
              .reduce((sum, b) => sum + b.priceInr, 0);
            const active = customer.bookings.filter(
              (b) => b.status !== "cancelled",
            );

            return (
              <Card key={customer.id} className="overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface-2 px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-fg">
                      {customer.name}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <a
                        href={`mailto:${customer.email}`}
                        className="flex items-center gap-1.5 text-xs text-fg-muted hover:text-accent"
                      >
                        <Mail className="h-3 w-3" strokeWidth={1.8} />
                        {customer.email}
                      </a>
                      {customer.phone && (
                        <a
                          href={`tel:${customer.phone}`}
                          className="flex items-center gap-1.5 text-xs text-fg-muted hover:text-accent"
                        >
                          <Phone className="h-3 w-3" strokeWidth={1.8} />
                          {customer.phone}
                        </a>
                      )}
                    </div>
                    {customer.linkedin && (
                      <p className="mt-1 truncate text-xs text-fg-subtle">
                        {customer.linkedin}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge tone="neutral">
                      {active.length} session{active.length === 1 ? "" : "s"}
                    </Badge>
                    <Badge tone="success">{formatInr(paid)} paid</Badge>
                  </div>
                </div>

                <ul className="divide-y divide-[var(--border)]">
                  {customer.bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm"
                    >
                      <span className="min-w-0 truncate text-fg-muted">
                        <span className="font-mono text-xs text-fg-subtle">
                          {booking.reference}
                        </span>{" "}
                        · {booking.sessionType.title} ·{" "}
                        {formatDateShort(booking.date)}
                      </span>
                      <span className="shrink-0 text-xs text-fg-subtle">
                        {booking.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
