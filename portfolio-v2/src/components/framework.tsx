import { project } from "@/content/project";
import { Reveal } from "./reveal";
import { Section } from "./section";

/** The differentiator, so it gets its own treated block rather than a card. */
export function Framework() {
  return (
    <Section id="framework" index="07" title="Framework">
      <div className="border border-hairline bg-surface">
        <div className="border-b border-hairline px-6 py-5 sm:px-10 sm:py-7">
          <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="font-display text-xl text-text sm:text-2xl">{project.name}</h3>
            <p className="font-mono text-meta text-muted">{project.deployment}</p>
          </Reveal>
        </div>

        <div className="grid gap-10 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Reveal>
              <p className="text-lg leading-[1.55] text-text sm:max-w-[58ch]">{project.summary}</p>
            </Reveal>
            {project.body.map((paragraph, i) => (
              <Reveal key={i} delay={(i + 1) * 60}>
                <p className="text-sm text-muted sm:max-w-[64ch]">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            <Reveal delay={80}>
              <dl className="flex flex-col gap-6">
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="sr-only">{metric.label}</dt>
                    <dd>
                      <p className="font-display text-3xl leading-none text-text">{metric.value}</p>
                      <p className="mt-2 max-w-[24ch] font-mono text-meta leading-snug text-muted">
                        {metric.label}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={140}>
              <h4 className="meta-label mb-3">Stack</h4>
              <p className="font-mono text-meta leading-[2]">
                {project.stack.map((item, i) => (
                  <span key={item}>
                    <span className="text-text">{item}</span>
                    {i < project.stack.length - 1 ? (
                      <span className="text-hairline-strong"> · </span>
                    ) : null}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
