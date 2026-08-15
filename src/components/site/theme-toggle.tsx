"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Inlined in <head> so the correct theme is applied before first paint —
 * without this the page flashes light before hydration.
 */
/**
 * Dark is the default: the design is built around the neon-on-black palette.
 * A visitor who explicitly picks light gets light and it sticks; everyone else
 * — including first-time visitors on a light OS — sees dark.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored !== 'light') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing — the toggle still works for this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-line bg-surface text-fg-muted transition-colors hover:text-fg hover:border-line-strong ${className ?? ""}`}
    >
      {/* Render a stable icon until mounted to avoid a hydration mismatch. */}
      {mounted && theme === "dark" ? (
        <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.7} />
      ) : (
        <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.7} />
      )}
    </button>
  );
}
