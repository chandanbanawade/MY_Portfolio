"use client";

import { useEffect, useState } from "react";

import { navItems } from "@/content/nav";
import { profile } from "@/content/profile";
import { Shell } from "./section";

export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-lifted={lifted}
      aria-label="Section navigation"
      // First participant in the load sequence, so no delay.
      className="seq fixed inset-x-0 top-0 z-40 border-b border-transparent bg-ground transition-colors duration-500 data-[lifted=true]:border-hairline"
    >
      <Shell>
        <div className="flex h-16 items-center justify-between gap-6">
          <a href="#main" className="font-mono text-meta uppercase tracking-[0.14em] text-text">
            {profile.name.split(" ")[0]}
            <span className="text-hairline-strong"> / </span>
            <span className="text-muted">{profile.name.split(" ")[1]}</span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {navItems.map((entry) => (
              <li key={entry.href}>
                <a
                  href={entry.href}
                  className="flex items-baseline gap-2 font-mono text-meta text-muted transition-colors duration-300 hover:text-text"
                >
                  <span className="text-hairline-strong tabular-nums">{entry.index}</span>
                  {entry.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#sessions"
            className="border border-hairline px-4 py-2 font-mono text-meta uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:border-text"
          >
            Book<span className="hidden sm:inline"> a session</span>
          </a>
        </div>
      </Shell>
    </nav>
  );
}
