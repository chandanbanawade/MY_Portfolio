"use client";

import { useEffect, useState } from "react";

import { profile } from "@/content/profile";
import {
  emailAddress,
  emailFallback,
  mailtoHref,
  phoneDigits,
  phoneDisplay,
  phoneFallback,
  telHref,
} from "@/lib/contact";
import { CopyButton, DrawLink } from "./interactive";
import { Reveal } from "./reveal";
import { Section } from "./section";

/**
 * There is no contact form, deliberately. A form on a static site means a
 * server route, a third-party endpoint and a spam funnel — three pieces of
 * attack surface bought in exchange for saving a visitor one click. The
 * address is assembled after hydration so it never ships as a contiguous
 * string, with a <noscript> form for anyone without JS.
 */
function Assembled({
  render,
  fallback,
}: {
  render: () => React.ReactNode;
  fallback: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return fallback ? <span className="font-mono text-muted">{fallback}</span> : null;
  }
  return <>{render()}</>;
}

export function Contact() {
  return (
    <Section
      id="contact"
      index="08"
      title="Contact"
      note="Booking a session, scoping an engagement or inviting a talk — all reach the same inbox. Say which and I can answer in one reply."
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
        <div className="flex flex-col gap-10">
          <Reveal>
            <dl className="flex flex-col gap-8">
              <div>
                <dt className="meta-label mb-3">Email</dt>
                <dd className="flex flex-wrap items-center gap-4">
                  <Assembled
                    fallback={emailFallback}
                    render={() => (
                      <DrawLink
                        href={mailtoHref()}
                        className="font-display text-xl text-text sm:text-2xl"
                      >
                        {emailAddress()}
                      </DrawLink>
                    )}
                  />
                  <Assembled
                    fallback=""
                    render={() => <CopyButton value={emailAddress()} label="Copy address" />}
                  />
                </dd>
              </div>

              <div>
                <dt className="meta-label mb-3">Phone</dt>
                <dd className="flex flex-wrap items-center gap-4">
                  <Assembled
                    fallback={phoneFallback}
                    render={() => (
                      <DrawLink href={telHref()} className="font-mono text-lg text-text">
                        {phoneDisplay()}
                      </DrawLink>
                    )}
                  />
                  <Assembled
                    fallback=""
                    render={() => <CopyButton value={phoneDigits()} label="Copy number" />}
                  />
                </dd>
              </div>

              <div>
                <dt className="meta-label mb-3">LinkedIn</dt>
                <dd>
                  <DrawLink
                    href={profile.linkedin}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="font-mono text-base text-text"
                  >
                    {profile.linkedinHandle}
                  </DrawLink>
                  <p className="mt-3">
                    <DrawLink
                      href={profile.linkedinActivity}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="font-mono text-meta uppercase tracking-[0.12em] text-muted"
                    >
                      Achievements &amp; Moments ↗
                    </DrawLink>
                  </p>
                </dd>
              </div>
            </dl>
          </Reveal>

          <noscript>
            <p className="border border-hairline px-4 py-3 font-mono text-meta text-muted">
              Email: {emailFallback} · Phone: {phoneFallback}
            </p>
          </noscript>

          <Reveal delay={80}>
            <p className="max-w-[58ch] text-sm text-muted">
              No form here on purpose — a contact form on a static site buys one saved click in
              exchange for a server route and a spam funnel. Email reaches me faster.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <h3 className="meta-label mb-5">Currently available for</h3>
          <dl className="grid gap-px bg-hairline">
            {profile.availability.map((slot) => (
              <div key={slot.label} className="bg-ground py-5">
                <dt className="text-base text-text">{slot.label}</dt>
                <dd className="mt-1 text-sm text-muted">{slot.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
