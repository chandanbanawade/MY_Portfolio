import { experience } from "@/content/experience";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Experience() {
  return (
    <Section id="experience" index="06" title="Experience">
      <ol className="grid gap-px bg-hairline">
        {experience.map((role, i) => (
          <Reveal key={`${role.org}-${role.start}`} as="li" delay={i * 60} className="bg-ground">
            <article className="grid gap-5 py-9 sm:py-11 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-12">
              <div className="flex flex-col gap-2">
                <p className="font-mono text-meta text-muted">
                  <time dateTime={role.startISO}>{role.start}</time>
                  <span className="text-hairline-strong"> — </span>
                  {role.endISO ? (
                    <time dateTime={role.endISO}>{role.end}</time>
                  ) : (
                    <span>{role.end}</span>
                  )}
                </p>
                <h3 className="font-display text-xl text-text">{role.org}</h3>
                {role.orgNote ? (
                  <p className="font-mono text-meta text-hairline-strong">{role.orgNote}</p>
                ) : null}
                <p className="font-mono text-meta text-muted">{role.location}</p>
              </div>

              <div>
                <h4 className="mb-4 text-base text-text">{role.title}</h4>
                <ul className="flex flex-col gap-3">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-4 text-sm text-muted sm:max-w-[68ch]">
                      <span aria-hidden="true" className="mt-[0.55em] h-px w-4 shrink-0 bg-hairline-strong" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
