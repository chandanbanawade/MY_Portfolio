import { Check, Sparkles } from "lucide-react";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { formatInr } from "@/lib/format";
import { formatDuration } from "@/lib/time";

type PackageView = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sessionCount: number;
  durationMin: number;
  priceInr: number;
  savingsNote: string | null;
  popular: boolean;
};

export function Packages({ packages }: { packages: PackageView[] }) {
  if (packages.length === 0) return null;

  return (
    <Section id="packages" tone="subtle">
      <SectionHeader
        eyebrow="Packages"
        title="Want more than one session?"
        description="One call sets direction. Several calls actually change outcomes — these bundles are cheaper than booking individually."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg, index) => (
          <Reveal key={pkg.slug} variant="pop" delay={index * 60}>
            <Card
              interactive
              className={`relative flex h-full flex-col p-6 ${
                pkg.popular ? "border-accent-2 ring-1 ring-accent-2/20" : ""
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-6">
                  <Badge tone="violet" className="shadow-[var(--shadow-sm)]">
                    <Sparkles className="h-3 w-3" strokeWidth={2} />
                    Best value
                  </Badge>
                </span>
              )}

              <h3 className="text-lg font-semibold text-fg">{pkg.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                {pkg.description}
              </p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-[1.75rem] font-semibold tracking-tight text-fg">
                  {formatInr(pkg.priceInr)}
                </span>
                {pkg.savingsNote && (
                  <Badge tone="success">{pkg.savingsNote}</Badge>
                )}
              </div>

              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-fg-muted">
                <li className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.2} />
                  <span>
                    {pkg.sessionCount} × {formatDuration(pkg.durationMin)} sessions
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.2} />
                  <span>Scheduled at your pace</span>
                </li>
                <li className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.2} />
                  <span>Notes and action plan after each call</span>
                </li>
              </ul>

              <ButtonLink
                href={`/book?package=${pkg.slug}`}
                variant={pkg.popular ? "primary" : "secondary"}
                className="mt-6 w-full"
              >
                Enquire
              </ButtonLink>
            </Card>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-fg-subtle">
        Packages start with a short call to agree the plan and schedule — you
        won&apos;t be charged before we&apos;ve spoken.
      </p>
    </Section>
  );
}
