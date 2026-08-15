import { Mic } from "lucide-react";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { speaking } from "@/config/experience";

/**
 * Speaking & training — reinforces credibility for the mentorship offering:
 * teaching this material in person is directly relevant to mentoring it.
 */
export function Speaking() {
  return (
    <Section id="speaking" tone="subtle">
      <SectionHeader
        eyebrow="Teaching"
        title="Speaking &amp; knowledge sharing"
        description="Mentoring isn't new territory — the same material has been delivered to institutes, universities and the security community."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {speaking.map((item, index) => (
          <Reveal key={item.title} variant="pop" delay={index * 70}>
            <Card interactive className="flex h-full flex-col p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-accent-2-soft text-accent-2">
                <Mic className="h-5 w-5" strokeWidth={1.7} />
              </span>

              <h3 className="mt-4 text-base font-semibold text-fg">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {item.detail}
              </p>

              <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {item.venues.map((venue) => (
                  <li key={venue}>
                    <Badge tone="neutral">{venue}</Badge>
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
