import { freeSession, paidSessions, sessionTerms } from "@/content/sessions";
import { formatDuration, formatInr, sessionHref } from "@/lib/booking";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Sessions() {
  return (
    <Section
      id="sessions"
      index="04"
      title="Pick the session that fits your question"
      note="Every session is 1-to-1 on your choice of Google Meet, Zoom or a direct call. Start free if you are not sure what you need."
    >
      {/* The ladder starts at ₹0, so the free consultation leads. */}
      <Reveal>
        <div className="flex flex-col gap-5 border border-hairline bg-surface px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h3 className="font-display text-xl text-text sm:text-2xl">
                {freeSession.title}
              </h3>
              <span className="font-mono text-meta text-muted">
                {formatDuration(freeSession.durationMin)} · no payment, no obligation
              </span>
            </div>
            <p className="max-w-[62ch] text-sm text-muted">{freeSession.description}</p>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-meta text-muted">
              {freeSession.bullets.map((bullet, i) => (
                <li key={bullet} className="flex items-center gap-4">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-hairline-strong">
                      ·
                    </span>
                  ) : null}
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={sessionHref(freeSession)}
            className="shrink-0 border border-hairline-strong px-6 py-3 text-center font-mono text-meta uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:border-text"
          >
            Book the free consultation
          </a>
        </div>
      </Reveal>

      <ul className="mt-12 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {paidSessions.map((session, i) => (
          <Reveal key={session.slug} as="li" delay={i * 60} className="bg-ground">
            <article className="flex h-full flex-col px-1 py-8 sm:px-6 sm:py-9">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-meta uppercase tracking-[0.1em] text-muted">
                  {formatDuration(session.durationMin)}
                </span>
                {session.popular ? (
                  <span className="inline-flex shrink-0 items-center bg-signal px-2.5 py-1 font-mono text-meta uppercase tracking-[0.1em] text-signal-ink">
                    Most booked
                  </span>
                ) : null}
              </div>

              <h3 className="mt-4 font-display text-lg text-text sm:text-xl">
                {session.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{session.tagline}</p>

              <p className="mt-6 font-display text-3xl leading-none text-text tabular-nums">
                {formatInr(session.priceInr)}
              </p>

              <p className="mt-5 text-sm text-muted">{session.description}</p>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {session.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-px w-3 shrink-0 bg-hairline-strong"
                    />
                    <span className="leading-snug">{bullet}</span>
                  </li>
                ))}
              </ul>

              <a
                href={sessionHref(session)}
                className={`mt-7 block px-4 py-3 text-center font-mono text-meta uppercase tracking-[0.12em] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 ${
                  session.popular
                    ? "bg-signal text-signal-ink"
                    : "border border-hairline-strong text-text hover:border-text"
                }`}
              >
                Book {formatDuration(session.durationMin)}
              </a>

              <p className="mt-3 text-center font-mono text-meta leading-relaxed text-hairline-strong">
                {session.providers.join(" · ")}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>

      <p className="mt-8 font-mono text-meta text-muted">{sessionTerms}</p>
    </Section>
  );
}
