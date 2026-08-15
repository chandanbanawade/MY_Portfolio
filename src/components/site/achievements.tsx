import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { achievements, hallOfFame } from "@/config/achievements";
import { certifications } from "@/config/experience";

export function Achievements() {
  return (
    <Section id="achievements" tone="subtle">
      <SectionHeader
        eyebrow="Recognition"
        title="Achievements"
        description="Verified recognition from platforms, organisations and government bodies for disclosed security research."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item, index) => (
          <Reveal key={item.title} variant="pop" delay={index * 45}>
            <Card interactive className="flex h-full flex-col p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent-soft text-accent">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>

              {item.metric && (
                <p className="mt-4 text-2xl font-semibold tracking-tight text-fg">
                  {item.metric}
                </p>
              )}

              <h3
                className={`text-[0.9375rem] font-semibold leading-snug text-fg ${item.metric ? "mt-1" : "mt-4"}`}
              >
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {item.detail}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* --- Hall of fame --- */}
      <Reveal>
        <Card className="mt-8 p-6">
          <h3 className="text-sm font-semibold text-fg">
            Hall of Fame recognition
          </h3>
          <p className="mt-1.5 text-sm text-fg-muted">
            Organisations that have publicly acknowledged vulnerabilities
            responsibly disclosed by Chandan.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {hallOfFame.map((org) => (
              <li key={org}>
                <Badge tone="neutral">{org}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>

      {/* --- Certifications --- */}
      <Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {certifications.map((cert) => (
            <Card key={cert.name} className="p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] bg-success-soft text-success">
                <Icon name="ShieldCheck" className="h-4.5 w-4.5" />
              </span>
              <h4 className="mt-3.5 text-sm font-semibold leading-snug text-fg">
                {cert.name}
              </h4>
              <p className="mt-1 text-xs text-fg-muted">{cert.issuer}</p>
              {cert.credentialId && (
                <p className="mt-1 font-mono text-[0.6875rem] text-fg-subtle">
                  ID: {cert.credentialId}
                </p>
              )}
            </Card>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
