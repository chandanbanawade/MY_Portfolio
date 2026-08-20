import { hallOfFame } from "@/content/hall-of-fame";
import { Reveal } from "./reveal";
import { Section } from "./section";

/**
 * Wordmarks set in the display face — no scraped logo PNGs, which are a
 * trademark problem and never sit together at the same optical weight.
 * Programs that paid a bounty carry a dagger; that distinction is the one
 * this audience actually reads, and it is made with type, not a second colour.
 */
export function Recognition() {
  return (
    <Section
      id="recognition"
      index="00"
      title="Recognition"
      note="Acknowledged by the security teams below. † marks programs that awarded a bounty rather than an acknowledgement alone."
    >
      <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-7 sm:gap-x-12 sm:gap-y-9">
        {hallOfFame.map((org, i) => (
          <Reveal as="li" key={org.name} delay={i * 45} className="max-w-full">
            <span
              className={`font-display text-xl leading-none tracking-[-0.015em] text-text sm:text-2xl ${
                org.bounty ? "border-b border-hairline-strong pb-1" : ""
              }`}
            >
              {org.name}
              {org.bounty ? (
                <span className="align-super font-mono text-meta text-muted" aria-hidden="true">
                  †
                </span>
              ) : null}
            </span>
            <span className="sr-only">
              {org.bounty ? " — bounty awarded" : " — acknowledgement"}
            </span>
            <span className="mt-2 block font-mono text-meta text-muted">{org.sector}</span>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
