import { ArrowRight, Check, Clock, Gift, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { formatDuration } from "@/lib/time";
import type { SessionTypeView } from "@/lib/data";

/**
 * The free-consultation offer. Rendered only when a free session is active,
 * so disabling it in the admin dashboard removes it from the site cleanly.
 */
export function FreeConsultation({ session }: { session: SessionTypeView | null }) {
  if (!session) return null;

  return (
    <section id="free-consultation" className="scroll-mt-24 py-16 md:py-20">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--success)]/25 bg-surface shadow-[var(--shadow-md)]">
            {/* Subtle wash — keeps it distinct from the paid pricing cards. */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--success)]/[0.07] via-transparent to-accent/[0.05]"
              aria-hidden
            />

            <div className="relative grid gap-8 p-7 md:grid-cols-[1.2fr_0.8fr] md:gap-12 md:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="success">
                    <Gift className="h-3 w-3" strokeWidth={2} />
                    One-time free consultation
                  </Badge>
                  <Badge tone="neutral">
                    <Clock className="h-3 w-3" strokeWidth={2} />
                    {formatDuration(session.durationMin)}
                  </Badge>
                </div>

                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-[2.25rem]">
                  Not sure which session is right for you?
                </h2>

                <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
                  {session.description}
                </p>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {session.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2.5 text-sm text-fg-muted"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        strokeWidth={2.2}
                      />
                      <span className="leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* --- Price panel --- */}
              <div className="flex flex-col justify-center rounded-[var(--radius-lg)] border border-line bg-surface-2 p-6 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-fg-subtle">
                  {session.title}
                </p>

                <div className="mt-3 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-fg">
                    ₹0
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-success">
                  Completely free
                </p>

                <ButtonLink
                  href={`/book?session=${session.slug}`}
                  size="lg"
                  className="group mt-6 w-full"
                >
                  Book Free Consultation
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </ButtonLink>

                <ul className="mt-5 space-y-2 border-t border-line pt-4 text-left text-xs text-fg-muted">
                  <li className="flex items-start gap-2">
                    <ShieldCheck
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                      strokeWidth={1.9}
                    />
                    No payment details required
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                      strokeWidth={1.9}
                    />
                    No obligation to book afterwards
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                      strokeWidth={1.9}
                    />
                    Limited to one per person
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
