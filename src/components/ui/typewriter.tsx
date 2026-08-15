"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";

/**
 * Terminal-style rotating text: types a phrase, holds, deletes, moves to the
 * next. Matches the reference site's "> Penetration Tester |" treatment.
 *
 * Respects prefers-reduced-motion by showing the first phrase statically.
 */
export function Typewriter({
  phrases,
  typeSpeed = 65,
  deleteSpeed = 32,
  holdMs = 1600,
  className,
  prefix = ">",
}: {
  phrases: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  holdMs?: number;
  className?: string;
  prefix?: string;
}) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || phrases.length === 0) return;

    const current = phrases[index % phrases.length];

    // Finished typing — hold, then start deleting.
    if (!deleting && text === current) {
      timer.current = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(timer.current);
    }

    // Finished deleting — advance to the next phrase.
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }

    timer.current = setTimeout(
      () =>
        setText((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1),
        ),
      deleting ? deleteSpeed : typeSpeed,
    );

    return () => clearTimeout(timer.current);
  }, [text, deleting, index, phrases, typeSpeed, deleteSpeed, holdMs, reduced]);

  const shown = reduced ? (phrases[0] ?? "") : text;

  return (
    <p className={cn("font-mono text-sm sm:text-base", className)}>
      <span className="text-accent">{prefix}</span>{" "}
      <span className="text-fg">{shown}</span>
      {!reduced && (
        <span
          className="animate-caret ml-0.5 inline-block w-[2px] translate-y-[2px] bg-accent align-middle"
          style={{ height: "1.05em" }}
          aria-hidden
        />
      )}
      {/* Screen readers get the full list rather than a jittering string. */}
      <span className="sr-only">{phrases.join(", ")}</span>
    </p>
  );
}
