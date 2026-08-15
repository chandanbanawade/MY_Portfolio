"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

/**
 * Scroll-triggered entrance animation.
 *
 *   variant="up"  — fade + slide up (default, for prose and headings)
 *   variant="pop" — scale up with a gentle overshoot, for cards and stat tiles
 *
 * Uses IntersectionObserver rather than a scroll listener, and unobserves once
 * shown so nothing keeps running. Motion is disabled entirely under
 * prefers-reduced-motion (handled in CSS).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  variant = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "up" | "pop";
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Guard for older browsers — show content rather than hide it forever.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(
        "reveal",
        variant === "pop" && "reveal-pop",
        visible && "is-visible",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
