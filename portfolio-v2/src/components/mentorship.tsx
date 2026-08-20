import { areasFor, pillars, type Backing } from "@/content/mentorship";
import { Reveal } from "./reveal";
import { Section } from "./section";

/**
 * "Professional field" is the honest label, and it is made with type rather
 * than a second colour: evidenced areas carry a bordered mono chip, guidance
 * areas carry nothing. The distinction matters — mentoring a subject is not
 * the same claim as having been employed in it, and this audience can tell.
 */
function BackingChip({ backing }: { backing: Backing }) {
  if (backing !== "professional") return null;
  return (
    <span className="inline-flex shrink-0 items-center border border-hairline-strong px-2 py-0.5 font-mono text-meta uppercase tracking-[0.1em] text-text">
      Professional field
    </span>
  );
}

export function Mentorship() {
  return (
    <Section
      id="mentorship"
      index="03"
      title="Choose your mentorship"
      note="Pick the area you need help with. Sessions are 1-to-1 and end with concrete next steps, not a reading list."
    >
      <p className="max-w-[70ch] border-y border-hairline py-5 text-sm text-muted">
        Areas marked{" "}
        <span className="font-mono text-meta uppercase tracking-[0.1em] text-text">
          professional field
        </span>{" "}
        are backed by documented client and disclosure work. The rest are mentorship and
        career guidance — real help, but not a claim of industry employment in that field.
      </p>

      <div className="mt-14 flex flex-col gap-16 sm:gap-20">
        {pillars.map((pillar, pillarIndex) => {
          const areas = areasFor(pillar.key);
          return (
            <div key={pillar.key}>
              <Reveal className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="meta-label tabular-nums">
                    {String(pillarIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-text sm:text-2xl">
                      {pillar.label}
                    </h3>
                    <p className="mt-1.5 max-w-[52ch] text-sm text-muted">{pillar.blurb}</p>
                  </div>
                </div>
                <span className="font-mono text-meta text-hairline-strong tabular-nums">
                  {areas.length} {areas.length === 1 ? "area" : "areas"}
                </span>
              </Reveal>

              <ul className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
                {areas.map((area, i) => (
                  <Reveal key={area.slug} as="li" delay={Math.min(i, 4) * 55} className="bg-ground">
                    <article className="group flex h-full flex-col gap-3 px-1 py-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 sm:py-8 sm:hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-meta text-hairline-strong tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <BackingChip backing={area.backing} />
                      </div>

                      <h4 className="font-display text-lg leading-snug text-text">
                        {area.title}
                      </h4>
                      <p className="text-sm text-muted">{area.description}</p>

                      <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-4 font-mono text-meta text-muted">
                        {area.topics.map((topic, topicIndex) => (
                          <li key={topic} className="flex items-center gap-3">
                            {topicIndex > 0 ? (
                              <span aria-hidden="true" className="text-hairline-strong">
                                ·
                              </span>
                            ) : null}
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
