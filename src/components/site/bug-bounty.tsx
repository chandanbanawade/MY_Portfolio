import { ShieldAlert, Sparkles, Target as TargetIcon } from "lucide-react";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import {
  bugBountyStats,
  bugBountyCopy,
  platforms,
  rankings,
  targets,
  targetKindLabels,
  vulnerabilityClasses,
} from "@/config/bugbounty";

export function BugBounty() {
  // Duplicated once so the marquee track loops seamlessly.
  const marqueeTargets = [...targets, ...targets];

  return (
    <Section id="bug-bounty" tone="subtle" className="relative overflow-hidden">
      {/* Ambient neon wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 bloom"
        aria-hidden
      />

      <SectionHeader
        eyebrow={bugBountyCopy.eyebrow}
        title={
          <>
            <span className="text-gradient">500+ vulnerabilities.</span>
            <br />
            Disclosed responsibly.
          </>
        }
        description={bugBountyCopy.description}
      />

      {/* --- Headline counters --- */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bugBountyStats.map((stat, index) => (
          <Reveal key={stat.label} variant="pop" delay={index * 80}>
            <Card className="relative overflow-hidden p-5 text-center transition-shadow duration-300 hover:shadow-[var(--glow-accent)]">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                aria-hidden
              />
              <p className="text-3xl font-semibold tracking-tight text-gradient">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm font-medium text-fg">{stat.label}</p>
              <p className="mt-0.5 text-xs text-fg-subtle">{stat.sub}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* --- Rankings --- */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
            Rankings &amp; recognition
          </h3>

          <div className="space-y-3">
            {rankings.map((ranking, index) => (
              <Reveal key={ranking.title} variant="pop" delay={index * 70}>
                <Card
                  interactive
                  className="group flex items-center gap-4 p-4 transition-shadow duration-300 hover:shadow-[var(--glow-accent)]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon name={ranking.icon} className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-semibold tracking-tight text-gradient">
                        {ranking.rank}
                      </span>
                      <span className="text-sm font-medium text-fg">
                        {ranking.title}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-fg-muted">{ranking.detail}</p>
                  </div>

                  <Badge tone="neutral" className="chip-mono shrink-0">
                    {ranking.period}
                  </Badge>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        {/* --- Platforms --- */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            <TargetIcon className="h-3.5 w-3.5 text-accent-2" strokeWidth={2} />
            Platforms
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {platforms.map((platform, index) => (
              <Reveal key={platform.name} variant="pop" delay={index * 70}>
                <Card
                  interactive
                  className="h-full p-4 transition-shadow duration-300 hover:shadow-[var(--glow-violet)]"
                >
                  <p className="text-[0.9375rem] font-semibold text-fg">
                    {platform.name}
                  </p>
                  <p className="mt-1 text-xs text-fg-muted">{platform.note}</p>
                  {platform.highlight && (
                    <p className="mt-2.5 border-t border-line pt-2.5 text-xs font-medium text-accent">
                      {platform.highlight}
                    </p>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>

          {/* --- Vulnerability classes --- */}
          <h3 className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            <ShieldAlert className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
            Vulnerability classes reported
          </h3>

          <Reveal variant="pop">
            <Card className="p-4">
              <ul className="flex flex-wrap gap-2">
                {vulnerabilityClasses.map((vuln) => (
                  <li
                    key={vuln.name}
                    className="group flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1.5 pl-3 pr-2 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    {vuln.name}
                    <span
                      className={`chip-mono rounded-full px-1.5 py-0.5 ${
                        vuln.severity === "Critical"
                          ? "bg-danger-soft text-danger"
                          : "bg-warning-soft text-warning"
                      }`}
                    >
                      {vuln.severity}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* --- Who acknowledged the findings — scrolling marquee --- */}
      <div className="mt-12">
        <h3 className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-fg-subtle">
          Organisations that acknowledged my reports
        </h3>

        <div className="marquee-mask overflow-hidden py-1">
          <ul className="marquee gap-3" aria-label="Organisations that acknowledged disclosed vulnerabilities">
            {marqueeTargets.map((target, index) => (
              <li
                key={`${target.name}-${index}`}
                // The duplicated half is decorative only.
                aria-hidden={index >= targets.length}
                className="shrink-0"
              >
                <div className="flex items-center gap-3 rounded-[var(--radius)] border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      target.kind === "bounty"
                        ? "bg-warning"
                        : target.kind === "government"
                          ? "bg-accent-2"
                          : "bg-accent"
                    }`}
                    aria-hidden
                  />
                  <div>
                    <p className="whitespace-nowrap text-sm font-medium text-fg">
                      {target.name}
                    </p>
                    <p className="whitespace-nowrap text-[0.6875rem] text-fg-subtle">
                      {targetKindLabels[target.kind]} · {target.category}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-fg-subtle">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            Hall of Fame
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" aria-hidden />
            Paid bounty
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-2" aria-hidden />
            Government
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-fg-subtle">
          All findings were disclosed responsibly through official bug bounty and
          vulnerability disclosure programs. Recognition denotes acknowledgement
          of a report — not employment or a client relationship.
        </p>
      </div>
    </Section>
  );
}
