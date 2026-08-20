"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Fires once, at 15% visibility. IntersectionObserver rather than a motion
 * library — these are the cheapest animations on the page and there are a lot
 * of them. The transition itself lives in globals.css so reduced-motion is
 * handled by one media query instead of a prop on every call site.
 */
function useOnceInView<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  const timer = useRef<number | undefined>(undefined);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (delay > 0) {
          timer.current = window.setTimeout(() => setShown(true), delay);
          return;
        }
        setShown(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [delay, shown]);

  return { ref, shown };
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const { ref, shown } = useOnceInView<HTMLDivElement>(delay);
  return (
    <Tag ref={ref} data-shown={shown} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

/** Section rules draw left→right on entry. Cheap, precise, on-brand. */
export function Rule({ className = "" }: { className?: string }) {
  const { ref, shown } = useOnceInView<HTMLDivElement>();
  return <div ref={ref} data-drawn={shown} className={`rule ${className}`} aria-hidden="true" />;
}
