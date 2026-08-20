"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  // Assume motion is allowed on the server; the client corrects on hydration.
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type MotionConfig = {
  reduced: boolean;
  /** Count-up duration in ms. Zero snaps straight to the final value. */
  countMs: number;
};

/**
 * The gate for JS-driven motion. There is exactly one other place
 * reduced-motion is handled — the media query at the bottom of globals.css,
 * which covers the CSS-driven load sequence and scroll reveals. Two gates,
 * not thirty scattered media queries.
 */
export function useMotionConfig(): MotionConfig {
  const reduced = usePrefersReducedMotion();
  return { reduced, countMs: reduced ? 0 : 900 };
}
