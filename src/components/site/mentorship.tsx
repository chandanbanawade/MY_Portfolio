import { Check, Clock, Gift } from "lucide-react";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { formatInr } from "@/lib/format";
import { formatDuration } from "@/lib/time";
import { meetingLabels } from "@/config/meetings";
import type { SessionTypeView } from "@/lib/data";

export function Mentorship({
  sessions,
  freeSession,
}: {
  /** Paid sessions only — the free consultation has its own section. */
  sessions: SessionTypeView[];
  freeSession: SessionTypeView | null;
}) {
  return (
    <Section id="mentorship" tone="subtle">
      <SectionHeader
        eyebrow="Sessions & pricing"
        title="Pick the session that fits your question"
        description="Every session is 1-to-1 on your choice of Google Meet, Zoom or a direct call — and ends with concrete next steps, not a reading list."
      />

      {/* Free consultation shortcut, so the ladder starts at ₹0. */}
      {freeSession && (
        <Reveal>
          <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--success)]/25 bg-success-soft px-5 py-4 sm:flex-row">
            <p className="flex items-center gap-2.5 text-center text-sm text-fg sm:text-left">
              <Gift className="h-4 w-4 shrink-0 text-success" strokeWidth={2} />
              <span>
                <strong className="font-semibold">New here?</strong> Start with
                the free {formatDuration(freeSession.durationMin)} consultation —
                no payment, no obligation.
              </span>
            </p>
            <ButtonLink
              href={`/book?session=${freeSession.slug}`}
              size="sm"
              className="shrink-0"
            >
              Book free
            </ButtonLink>
          </div>
        </Reveal>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sessions.map((session, index) => (
          <Reveal key={session.slug} variant="pop" delay={index * 60}>
            <Card
              interactive
              className={`relative flex h-full flex-col p-6 ${
                session.popular
                  ? "border-accent shadow-[var(--shadow-md)] ring-1 ring-accent/20"
                  : ""
              }`}
            >
              {session.popular && (
                <span className="absolute -top-3 left-6">
                  <Badge tone="accent" className="shadow-[var(--shadow-sm)]">
                    Most booked
                  </Badge>
                </span>
              )}

              <div className="flex items-center gap-2 text-fg-muted">
                <Clock className="h-4 w-4" strokeWidth={1.8} />
                <span className="text-sm font-medium">
                  {formatDuration(session.durationMin)}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-fg">
                {session.title}
              </h3>
              <p className="mt-1 text-sm text-fg-subtle">{session.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-[2rem] font-semibold tracking-tight text-fg">
                  {formatInr(session.priceInr)}
                </span>
                <span className="text-sm text-fg-subtle">/ session</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                {session.description}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {session.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 text-sm text-fg-muted">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      strokeWidth={2.2}
                    />
                    <span className="leading-snug">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-3">
                <ButtonLink
                  href={`/book?session=${session.slug}`}
                  variant={session.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  Book {formatDuration(session.durationMin)} Session
                </ButtonLink>

                <p className="text-center text-[0.6875rem] leading-relaxed text-fg-subtle">
                  {session.allowedProviders
                    .map((p) => meetingLabels[p])
                    .join(" · ")}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-fg-subtle">
        All prices in INR. Free reschedule up to 12 hours before your session ·
        full refund if you cancel at least 24 hours ahead.
      </p>
    </Section>
  );
}
