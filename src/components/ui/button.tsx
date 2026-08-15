import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius)] " +
  "transition-all duration-200 select-none whitespace-nowrap " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-fg-inverse hover:bg-accent hover:text-white shadow-[var(--shadow-sm)] " +
    "hover:shadow-[var(--shadow-md)] active:translate-y-px",
  secondary:
    "bg-surface-2 text-fg border border-line hover:border-line-strong hover:bg-surface-3 " +
    "active:translate-y-px",
  outline:
    "border border-line-strong text-fg hover:bg-surface-2 active:translate-y-px",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-2",
  danger:
    "bg-[var(--danger)] text-white hover:opacity-90 active:translate-y-px",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
