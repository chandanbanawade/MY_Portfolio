import { GraduationCap } from "lucide-react";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { experience, education } from "@/config/experience";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Career"
        title="Professional experience"
        description="Where the guidance comes from — roles, responsibilities and outcomes, taken from Chandan's CV."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <ol className="relative space-y-9 border-l border-line pl-7">
          {experience.map((item, index) => (
            <Reveal as="li" key={`${item.org}-${item.period}`} delay={index * 60}>
              <span
                className={`absolute -left-[6.5px] mt-1.5 flex h-3 w-3 rounded-full border-2 ${
                  item.current
                    ? "border-accent bg-accent"
                    : "border-line-strong bg-surface"
                }`}
                aria-hidden
              />

              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-fg">{item.role}</h3>
                {item.current && (
                  <Badge tone="success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Current
                  </Badge>
                )}
              </div>

              <p className="mt-1 text-sm font-medium text-accent">{item.org}</p>
              <p className="mt-0.5 text-xs text-fg-subtle">
                {item.period}
                {item.location && ` · ${item.location}`}
              </p>

              <ul className="mt-3 space-y-2">
                {item.points.map((point, i) => (
                  <li
                    key={i}
                    className="relative pl-4 text-sm leading-relaxed text-fg-muted"
                  >
                    <span
                      className="absolute left-0 top-[0.6em] h-1 w-1 rounded-full bg-fg-subtle"
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-fg">
                <GraduationCap className="h-4 w-4 text-accent" strokeWidth={1.8} />
                Education
              </div>
              {education.map((item) => (
                <div key={item.degree} className="mt-3.5">
                  <p className="text-sm font-medium leading-snug text-fg">
                    {item.degree}
                  </p>
                  <p className="mt-1 text-xs text-fg-muted">{item.org}</p>
                  <p className="mt-0.5 text-xs text-fg-subtle">
                    {item.location} · {item.period}
                  </p>
                </div>
              ))}
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
