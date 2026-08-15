import { skillGroups } from "@/config/expertise";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";

export function Expertise() {
  return (
    <Section id="expertise">
      <SectionHeader
        eyebrow="Expertise"
        title="What I work with every day"
        description="The tools, techniques and standards behind the engagements I run and the research I publish."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.title} variant="pop" delay={index * 50}>
            <Card interactive className="h-full p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent-soft text-accent">
                  <Icon name={group.icon} className="h-5 w-5" />
                </span>
                {group.verified === false && (
                  /* Honest labelling — this group isn't evidenced on the CV yet. */
                  <Badge tone="warning">Expanding</Badge>
                )}
              </div>

              <h3 className="mt-4 text-base font-semibold text-fg">
                {group.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                {group.blurb}
              </p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-[var(--radius-sm)] border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
