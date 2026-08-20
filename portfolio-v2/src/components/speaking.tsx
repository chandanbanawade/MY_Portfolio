import { talks } from "@/content/talks";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Speaking() {
  return (
    <Section
      id="speaking"
      index="02"
      title="Speaking & knowledge sharing"
      note="Mentoring is not new territory — the same material has been delivered to institutes, universities and the security community. Also available to speak: send a date and an audience."
    >
      <ul className="grid gap-px bg-hairline sm:grid-cols-2">
        {talks.map((talk, i) => (
          <Reveal key={talk.venue} as="li" delay={i * 55} className="bg-ground">
            <article className="flex h-full flex-col gap-3 px-1 py-8 sm:px-7 sm:py-10">
              <h3 className="font-display text-lg text-text sm:text-xl">{talk.venue}</h3>
              <p className="font-mono text-meta text-muted">
                {talk.location}
                <span className="text-hairline-strong"> · </span>
                {talk.audience}
              </p>
              <p className="mt-1 text-sm text-muted sm:max-w-[46ch]">{talk.topic}</p>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
