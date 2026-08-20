"use client";

import { useEffect, useRef } from "react";

/**
 * A one-pixel rule across the top that fills as you read — the page's own
 * progress bar, in the same hairline vocabulary as the section rules.
 *
 * Written straight to a CSS custom property inside rAF rather than through
 * React state: this fires on every scroll frame, and re-rendering the tree at
 * 60fps to move one line would be indefensible.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      node.style.setProperty("--progress", ratio.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-px origin-left scale-x-[var(--progress,0)] bg-signal transition-transform duration-150 ease-out"
    />
  );
}
