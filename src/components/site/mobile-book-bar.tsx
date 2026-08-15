"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Gift } from "lucide-react";
import { formatInr } from "@/lib/format";

/**
 * Sticky bottom booking bar — mobile only.
 * Appears after the hero so it never covers the primary CTA, and shows the free
 * consultation alongside the paid CTA while one is available.
 */
export function MobileBookBar({
  startingPrice,
  freeAvailable,
}: {
  startingPrice: number;
  freeAvailable: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line glass px-4 py-3 transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      aria-hidden={!show}
    >
      {freeAvailable ? (
        <div className="flex items-center gap-2">
          <Link
            href="/book?session=free-consultation-15"
            tabIndex={show ? 0 : -1}
            className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius)] border border-[var(--success)]/40 bg-success-soft text-sm font-semibold text-success"
          >
            <Gift className="h-4 w-4" strokeWidth={2} />
            Free Consult
          </Link>
          <Link
            href="/book"
            tabIndex={show ? 0 : -1}
            className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius)] bg-fg text-sm font-medium text-fg-inverse"
          >
            Book Session
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-fg">
              1-to-1 mentorship
            </p>
            <p className="text-xs text-fg-subtle">
              From {formatInr(startingPrice)} · 15–90 min
            </p>
          </div>
          <Link
            href="/book"
            tabIndex={show ? 0 : -1}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[var(--radius)] bg-fg px-5 text-sm font-medium text-fg-inverse"
          >
            Book Session
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}
