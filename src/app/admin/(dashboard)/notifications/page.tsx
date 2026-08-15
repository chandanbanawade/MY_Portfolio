import { prisma } from "@/lib/prisma";
import { Card, Badge, Alert, EmptyState } from "@/components/ui/primitives";
import { PageHeader } from "../shared";

export const dynamic = "force-dynamic";

const templateLabels: Record<string, string> = {
  booking_confirmed: "Booking confirmed (to customer)",
  mentor_alert: "New booking alert (to you)",
  reminder_24h: "24-hour reminder",
  reminder_1h: "1-hour reminder",
  thank_you: "Thank you / feedback request",
  cancelled: "Cancellation notice",
};

export default async function NotificationsPage() {
  const logs = await prisma.notificationLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY || process.env.SMTP_URL,
  );

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Every message the system has generated, newest first."
      />

      {!emailConfigured && (
        <Alert tone="warning" title="Email delivery is not configured" className="mb-6">
          No email provider is set, so messages are recorded here and printed to
          the server console instead of being sent. Add{" "}
          <code className="font-mono text-[0.6875rem]">RESEND_API_KEY</code> and{" "}
          <code className="font-mono text-[0.6875rem]">MAIL_FROM</code> to{" "}
          <code className="font-mono text-[0.6875rem]">.env</code>, then implement
          the marked block in{" "}
          <code className="font-mono text-[0.6875rem]">src/lib/notify.ts</code> to
          go live. Bookings still work perfectly in the meantime.
        </Alert>
      )}

      {logs.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Messages appear here as soon as someone books a session."
        />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="accent">
                    {templateLabels[log.template] ?? log.template}
                  </Badge>
                  <Badge tone={log.status === "sent" ? "success" : "neutral"}>
                    {log.status}
                  </Badge>
                  <span className="text-xs text-fg-subtle">→ {log.recipient}</span>
                </div>
                <span className="text-xs text-fg-subtle">
                  {log.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC
                </span>
              </div>

              {log.subject && (
                <p className="mt-2 text-sm font-medium text-fg">{log.subject}</p>
              )}

              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-[var(--radius-sm)] bg-surface-2 p-3 font-mono text-[0.6875rem] leading-relaxed text-fg-muted">
                {log.body}
              </pre>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
