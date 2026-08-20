import type { ReactNode } from "react";

import { Reveal, Rule } from "./reveal";

export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-report px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Every section opens the way a report section opens: a numbered rule, a
 * title set in the display face, and a single line of orientation.
 */
export function Section({
  id,
  index,
  title,
  note,
  children,
}: {
  id: string;
  index: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-20 sm:py-28" aria-labelledby={`${id}-heading`}>
      <Shell>
        <Rule className="mb-6" />
        <div className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
          <Reveal className="flex items-baseline gap-4 sm:gap-6">
            <span className="meta-label pt-1 tabular-nums">{index}</span>
            <h2 id={`${id}-heading`} className="text-2xl text-text sm:text-3xl">
              {title}
            </h2>
          </Reveal>
          {note ? (
            <Reveal delay={80} className="max-w-sm">
              <p className="text-sm text-muted">{note}</p>
            </Reveal>
          ) : null}
        </div>
        {children}
      </Shell>
    </section>
  );
}
