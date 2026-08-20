"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import { useMotionConfig } from "@/lib/motion";

/**
 * Link whose underline draws from the edge the cursor arrived at. Keyboard
 * focus always draws from the left, because there is no cursor to take an
 * origin from and guessing one would read as a glitch.
 */
export function DrawLink({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onEnter = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node) return;
    const { left, width } = node.getBoundingClientRect();
    const fromRight = event.clientX - left > width / 2;
    node.style.setProperty("--draw-origin", fromRight ? "right" : "left");
  }, []);

  const onFocus = useCallback(() => {
    ref.current?.style.setProperty("--draw-origin", "left");
  }, []);

  return (
    <a
      ref={ref}
      onMouseEnter={onEnter}
      onFocus={onFocus}
      className={`draw-link ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

/**
 * Copy affordance. The confirmation states what happened rather than
 * congratulating anyone, and the live region announces it once.
 */
export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  const text =
    state === "copied"
      ? "Copied to clipboard"
      : state === "failed"
        ? "Couldn't copy — select it manually"
        : label;

  return (
    <button
      type="button"
      onClick={copy}
      data-state={state}
      className={`meta-label inline-flex items-center gap-2 border border-hairline px-3 py-1.5 text-left transition-colors duration-300 hover:border-hairline-strong hover:text-text data-[state=copied]:border-signal data-[state=copied]:text-signal ${className}`}
    >
      <span aria-hidden="true" className="tabular-nums">
        {state === "copied" ? "✓" : state === "failed" ? "!" : "⧉"}
      </span>
      <span>{text}</span>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? `${label} copied to clipboard` : ""}
      </span>
    </button>
  );
}

/**
 * Counts to a real number, once, on entry. Never loops. Renders the final
 * value immediately for reduced-motion and for anyone without JS, so the
 * figure is never missing — only the animation is.
 */
export function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const { countMs: durationMs } = useMotionConfig();
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || started || durationMs === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setStarted(true);

        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          setDisplay(Math.round(value * eased));
          if (t < 1) frame.current = requestAnimationFrame(tick);
        };

        setDisplay(0);
        frame.current = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs, started]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
