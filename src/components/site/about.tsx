import Image from "next/image";
import { Briefcase, MapPin, Quote } from "lucide-react";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { profile } from "@/config/experience";
import { site } from "@/config/site";

export function About() {
  return (
    <Section id="about" tone="subtle">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <SectionHeader
            align="left"
            eyebrow="About"
            title="Security is my profession. Mentoring is how I pass it on."
          />

          <div className="mt-6 space-y-5">
            {profile.intro.map((paragraph, i) => (
              <p
                key={i}
                className="text-[1.0625rem] leading-relaxed text-fg-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Card className="relative mt-8 overflow-hidden p-6">
            <div
              className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-accent-2"
              aria-hidden
            />
            <Quote className="mb-3 h-5 w-5 text-accent" strokeWidth={2} aria-hidden />
            <p className="text-[0.9375rem] font-medium leading-relaxed text-fg">
              {profile.mentoringApproach}
            </p>
          </Card>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book">Book a Session</ButtonLink>
            <ButtonLink href="/#experience" variant="secondary">
              View full experience
            </ButtonLink>
          </div>
        </div>

        {/* --- Photo + identity panel --- */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {site.portrait && (
            <Reveal>
              <figure className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface-2 shadow-[var(--shadow-md)]">
                <Image
                  src={site.portrait}
                  alt={`${site.name}, ${site.role}`}
                  width={1100}
                  height={1954}
                  sizes="(max-width: 1024px) 100vw, 34rem"
                  quality={90}
                  className="h-auto w-full object-cover"
                />
                {site.photoCaption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-xs font-medium text-white/90">
                    {site.photoCaption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          )}

          <Reveal>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Briefcase className="h-4 w-4 text-accent" strokeWidth={1.8} />
              Professional identity
            </div>

            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {site.identity}
            </p>

            <dl className="mt-5 space-y-3.5 border-t border-line pt-5 text-sm">
              <div>
                <dt className="text-xs text-fg-subtle">Current role</dt>
                <dd className="mt-0.5 font-medium text-fg">
                  {site.currentPosition}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-fg-subtle">Experience</dt>
                <dd className="mt-0.5 font-medium text-fg">
                  2+ years of offensive security expertise
                </dd>
              </div>
              <div>
                <dt className="text-xs text-fg-subtle">Based in</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-fg">
                  <MapPin className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.8} />
                  {site.location}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-line pt-5">
              <p className="text-xs text-fg-subtle">Core practice areas</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {[
                  "Web security",
                  "Mobile security",
                  "API security",
                  "Cloud security",
                  "Network security",
                  "Infrastructure security",
                  "Vulnerability assessment",
                  "Penetration testing",
                  "Red team operations",
                  "Threat emulation",
                  "Incident response",
                  "Digital forensics",
                  "Security automation",
                  "Threat analysis",
                  "Security remediation",
                ].map((area) => (
                  <li key={area}>
                    <Badge tone="neutral">{area}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
