import { ArrowRight, Gift, Mail } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { formatInr } from "@/lib/format";

/**
 * Full-width conversion band. `variant="inline"` gives a lighter version for
 * dropping between sections.
 */
export function CtaBand({
  title = "Need help with your career? Let's talk.",
  description = "One focused conversation usually beats another month of guessing. Start free, then pick a paid session only if it would genuinely help.",
  startingPrice,
  freeAvailable = false,
  variant = "full",
}: {
  title?: string;
  description?: string;
  startingPrice?: number;
  freeAvailable?: boolean;
  variant?: "full" | "inline";
}) {
  const freeHref = "/book?session=free-consultation-15";

  if (variant === "inline") {
    return (
      <div className="container-page py-6">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-line bg-surface-2 px-6 py-5 sm:flex-row">
            <p className="text-center text-[0.9375rem] font-medium text-fg sm:text-left">
              {title}
            </p>
            <ButtonLink
              href={freeAvailable ? freeHref : "/book"}
              size="sm"
              className="shrink-0"
            >
              {freeAvailable ? (
                <>
                  <Gift className="h-3.5 w-3.5" strokeWidth={2} />
                  Book Free Consultation
                </>
              ) : (
                <>
                  Book a 1-to-1 Session
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </>
              )}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <section className="py-20 md:py-24">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface px-6 py-14 text-center shadow-[var(--shadow-md)] md:px-16 md:py-18">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.07] via-transparent to-accent-2/[0.07]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 grid-backdrop opacity-40"
              aria-hidden
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight md:text-[2.5rem]">
                {title}
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-fg-muted">
                {description}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {freeAvailable && (
                  <ButtonLink href={freeHref} size="lg" className="group">
                    <Gift className="h-4 w-4" strokeWidth={2} />
                    Book Free Consultation
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </ButtonLink>
                )}
                <ButtonLink
                  href="/book"
                  variant={freeAvailable ? "secondary" : "primary"}
                  size="lg"
                >
                  Book a Mentorship Session
                </ButtonLink>
                <ButtonLink
                  href={`mailto:${site.contact.email}`}
                  variant="ghost"
                  size="lg"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                  Ask a question
                </ButtonLink>
              </div>

              {startingPrice !== undefined && (
                <p className="mt-5 text-sm text-fg-subtle">
                  {freeAvailable && "First consultation free · "}
                  Paid sessions from {formatInr(startingPrice)} · Free reschedule
                  up to 12 hours before · {site.timezoneLabel}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
