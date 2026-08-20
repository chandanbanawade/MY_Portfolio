import { metrics } from "@/content/metrics";
import { CountUp } from "./interactive";
import { Reveal, Rule } from "./reveal";
import { Shell } from "./section";

/**
 * The 20-second skim payload. Four numbers, each carrying where it came from,
 * because a floating "Top 5" is worth nothing to this audience.
 *
 * Dividers come from a 1px grid gap over a hairline ground — no nth-child
 * border juggling, and it re-flows correctly at every breakpoint.
 */
export function ProofStrip() {
  return (
    <section aria-label="Record at a glance" className="relative z-10">
      <Shell>
        <Rule />
        <dl className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => {
            // The single strongest figure carries the accent. Exactly one.
            const isHeadline = metric.prefix === "#";
            return (
              <Reveal key={metric.label} delay={i * 70} className="bg-ground">
                <div className="px-1 py-9 sm:px-7 sm:py-11">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <p
                      className={`font-display text-4xl leading-none tracking-[-0.02em] sm:text-5xl ${
                        isHeadline ? "text-signal" : "text-text"
                      }`}
                    >
                      {metric.prefix}
                      <CountUp value={metric.value} />
                      {metric.suffix}
                    </p>
                    <p className="mt-5 max-w-[22ch] text-sm text-text">{metric.label}</p>
                    <p className="mt-2 max-w-[26ch] font-mono text-meta leading-snug text-muted">
                      {metric.provenance}
                    </p>
                  </dd>
                </div>
              </Reveal>
            );
          })}
        </dl>
        <Rule />
      </Shell>
    </section>
  );
}
