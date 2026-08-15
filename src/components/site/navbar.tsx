"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck, Gift } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/format";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-line shadow-[var(--shadow-sm)]"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4 md:h-18">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-fg text-fg-inverse transition-colors group-hover:bg-accent group-hover:text-white">
            <ShieldCheck className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.9375rem] font-semibold tracking-tight">
              {site.name}
            </span>
            <span className="mt-0.5 text-[0.6875rem] text-fg-subtle">
              Security &amp; AI Mentor
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 xl:flex">
          <Link
            href="/"
            className="rounded-[var(--radius-sm)] px-2.5 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            Home
          </Link>
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-2.5 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Free consultation kept visually distinct from the paid CTA. */}
          <Link
            href="/book?session=free-consultation-15"
            className="hidden items-center gap-1.5 rounded-[var(--radius)] border border-[var(--success)]/35 bg-success-soft px-3 py-2 text-sm font-semibold text-success transition-colors hover:border-[var(--success)]/60 md:inline-flex"
          >
            <Gift className="h-3.5 w-3.5" strokeWidth={2} />
            Free Consultation
          </Link>
          <ButtonLink href="/book" size="sm" className="hidden sm:inline-flex">
            Book a Session
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-line bg-surface text-fg xl:hidden"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.8} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="animate-slide-down max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-surface xl:hidden">
          <div className="container-page flex flex-col py-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-line py-3.5 text-[0.9375rem] font-medium text-fg-muted transition-colors hover:text-fg"
            >
              Home
            </Link>
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 text-[0.9375rem] font-medium text-fg-muted transition-colors hover:text-fg"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/book?session=free-consultation-15"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius)] border border-[var(--success)]/35 bg-success-soft px-4 py-3 text-sm font-semibold text-success"
            >
              <Gift className="h-4 w-4" strokeWidth={2} />
              Get Free Consultation
            </Link>
            <ButtonLink
              href="/book"
              size="md"
              className="mt-2 mb-2 w-full"
              onClick={() => setOpen(false)}
            >
              Book a Session
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
