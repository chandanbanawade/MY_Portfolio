import Image from "next/image";
import { ArrowRight, Gift, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Typewriter } from "@/components/ui/typewriter";
import { formatInr } from "@/lib/format";

/** Credential chips — all three are on the CV. */
const CREDENTIALS = ["CEH Practical", "CAP", "ISO/IEC 27001"];

/** Roles the typewriter cycles through. Every one is CV-supported. */
const ROLES = [
  "Security Consultant",
  "Penetration Tester",
  "Bug Bounty Hunter",
  "Incident Responder",
  "Mentor",
];

export function Hero({
  startingPrice,
  freeAvailable,
}: {
  startingPrice: number;
  freeAvailable: boolean;
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bloom" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-backdrop opacity-50"
        aria-hidden
      />

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* --- Copy --- */}
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  Available for mentorship
                </span>

                {freeAvailable && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--success)]/30 bg-success-soft px-3 py-1.5 text-xs font-semibold text-success">
                    <Gift className="h-3.5 w-3.5" strokeWidth={2} />
                    First consultation free
                  </span>
                )}
              </div>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="mt-6 text-[2.4rem] font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Learn from{" "}
                <span className="text-gradient">real-world technology</span>
                <br className="hidden sm:block" /> &amp; security experience.
              </h1>
            </Reveal>

            {/* Terminal-style rotating role */}
            <Reveal delay={110}>
              <div className="mt-5">
                <Typewriter phrases={ROLES} />
              </div>
            </Reveal>

            <Reveal delay={140}>
              <ul className="mt-5 flex flex-wrap gap-2">
                {CREDENTIALS.map((credential) => (
                  <li
                    key={credential}
                    className="chip-mono rounded-[var(--radius-sm)] border border-line bg-surface-2 px-2.5 py-1 text-fg-muted"
                  >
                    {credential}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={170}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
                Practical 1-to-1 mentorship for students, developers, security
                professionals, aspiring AI/ML engineers and technology
                enthusiasts.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {freeAvailable && (
                  <ButtonLink
                    href="/book?session=free-consultation-15"
                    size="lg"
                    className="group"
                  >
                    <Gift className="h-4 w-4" strokeWidth={2} />
                    Get Free Consultation
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </ButtonLink>
                )}
                <ButtonLink
                  href="/book"
                  variant={freeAvailable ? "secondary" : "primary"}
                  size="lg"
                >
                  Book a Mentorship Session
                </ButtonLink>
                <ButtonLink href="/#expertise" variant="ghost" size="lg">
                  Explore My Expertise
                </ButtonLink>
              </div>

              <p className="mt-3 text-sm text-fg-subtle">
                {freeAvailable && (
                  <>
                    <span className="font-medium text-fg">
                      Free 15-minute consultation
                    </span>{" "}
                    ·{" "}
                  </>
                )}
                Paid sessions from{" "}
                <span className="font-medium text-fg">
                  {formatInr(startingPrice)}
                </span>
              </p>
            </Reveal>
          </div>

          {/* --- Photo with animated gradient frame --- */}
          <Reveal delay={200} variant="pop">
            <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
              <div className="glow-frame">
                <div className="overflow-hidden rounded-[var(--radius-xl)] bg-surface">
                  {site.avatar ? (
                    /* The square head-and-shoulders crop, not the full portrait:
                       in a 4:5 frame it fills the height and crops the sides,
                       keeping the face centred. The full photo is in About. */
                    <Image
                      src={site.avatar}
                      alt={`${site.name}, ${site.role}`}
                      width={800}
                      height={800}
                      quality={92}
                      priority
                      sizes="(max-width: 1024px) 24rem, 26rem"
                      className="aspect-[4/5] w-full object-cover object-center"
                    />
                  ) : (
                    /* No photo configured — initials placeholder.
                       Add one to /public and set `avatar` in src/config/site.ts */
                    <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent-2/20 text-6xl font-semibold tracking-tight text-fg">
                      {site.initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Floating experience badge */}
              <div className="animate-float absolute -bottom-5 -right-3 rounded-[var(--radius)] border border-[var(--accent)]/40 bg-surface px-4 py-3 text-center shadow-[var(--glow-accent)] sm:-right-5">
                <p className="text-2xl font-semibold tracking-tight text-gradient">
                  2+
                </p>
                <p className="text-[0.6875rem] leading-tight text-fg-muted">
                  Years offensive
                  <br />
                  security
                </p>
              </div>

              {/* Floating disclosure badge */}
              <div
                className="animate-float absolute -left-3 top-8 rounded-[var(--radius)] border border-[var(--accent-2)]/40 bg-surface px-3.5 py-2.5 shadow-[var(--glow-violet)] sm:-left-6"
                style={{ animationDelay: "1.2s" }}
              >
                <p className="text-lg font-semibold tracking-tight text-gradient">
                  500+
                </p>
                <p className="text-[0.6875rem] leading-tight text-fg-muted">
                  Vulnerabilities
                </p>
              </div>

              <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-fg-subtle">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {site.location} · {site.availabilityNote}
              </p>
            </div>
          </Reveal>
        </div>

        {/* --- Stat strip --- */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {site.stats.map((stat, index) => (
            <Reveal key={stat.label} variant="pop" delay={index * 70}>
              <div className="h-full bg-surface px-5 py-5 text-center transition-colors hover:bg-surface-2">
                <p className="text-2xl font-semibold tracking-tight text-gradient">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-fg-muted">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* --- Scroll hint --- */}
        <div className="mt-12 flex justify-center" aria-hidden>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-line-strong pt-1.5">
            <span className="animate-scroll-hint h-1.5 w-1 rounded-full bg-accent" />
          </span>
        </div>
      </div>
    </section>
  );
}
