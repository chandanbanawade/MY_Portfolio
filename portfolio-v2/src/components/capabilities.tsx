import { capabilities, toolGroups } from "@/content/capabilities";
import { Reveal } from "./reveal";
import { Section } from "./section";

/**
 * A matrix of surface against depth. Depth is stated in words — "Primary",
 * "Regular", "Supporting" — because a percentage next to a skill is invented
 * data and everyone in this audience knows it.
 */
export function Capabilities() {
  return (
    <Section
      id="capabilities"
      index="05"
      title="Capabilities"
      note="Depth is stated plainly rather than scored. Primary surfaces are where most of the 500+ findings came from."
    >
      <div className="grid gap-px bg-hairline">
        <div className="hidden grid-cols-[minmax(0,16rem)_minmax(0,7rem)_minmax(0,1fr)] gap-8 bg-ground px-1 py-3 lg:grid">
          <span className="meta-label">Surface</span>
          <span className="meta-label">Depth</span>
          <span className="meta-label">What gets tested</span>
        </div>

        {capabilities.map((row, i) => (
          <Reveal key={row.surface} delay={Math.min(i, 5) * 45} className="bg-ground">
            <div className="grid gap-2 px-1 py-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,7rem)_minmax(0,1fr)] lg:items-baseline lg:gap-8">
              <h3 className="font-display text-lg text-text">{row.surface}</h3>
              <p
                className={`font-mono text-meta uppercase tracking-[0.1em] ${
                  row.depth === "Primary"
                    ? "text-text"
                    : row.depth === "Regular"
                      ? "text-muted"
                      : "text-hairline-strong"
                }`}
              >
                {row.depth}
              </p>
              <p className="text-sm text-muted">{row.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Dense utility block. Tooling is a list, not a grid of icon cards. */}
      <div className="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-3">
        {toolGroups.map((group, i) => (
          <Reveal key={group.label} delay={i * 70}>
            <h3 className="meta-label mb-4">{group.label}</h3>
            <p className="font-mono text-meta leading-[2] text-muted">
              {group.items.map((item, index) => (
                <span key={item}>
                  <span className="text-text">{item}</span>
                  {index < group.items.length - 1 ? (
                    <span className="text-hairline-strong"> · </span>
                  ) : null}
                </span>
              ))}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
