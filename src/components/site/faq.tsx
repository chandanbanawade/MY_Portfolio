"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/config/faq";
import { Section, SectionHeader } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/format";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            align="left"
            eyebrow="FAQ"
            title="Questions people ask before booking"
            description="If yours isn't here, email me before you book — I'd rather tell you a session won't help than take the booking."
          />
          <ButtonLink href="/book" size="md" className="mt-7">
            Book a Session
          </ButtonLink>
        </div>

        <div className="divide-y divide-[var(--border)] border-y border-line">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={faq.question} delay={index * 25}>
                <div>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "text-[0.9375rem] font-medium transition-colors",
                          isOpen ? "text-accent" : "text-fg",
                        )}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-300",
                          isOpen && "rotate-180 text-accent",
                        )}
                        strokeWidth={2}
                      />
                    </button>
                  </h3>

                  {/* Grid-rows trick animates height without measuring the DOM. */}
                  <div
                    id={`faq-panel-${index}`}
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 pr-8 text-sm leading-relaxed text-fg-muted">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
