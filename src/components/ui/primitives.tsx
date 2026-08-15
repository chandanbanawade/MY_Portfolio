import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

/* --- Card ----------------------------------------------------------------- */

export function Card({
  className,
  children,
  interactive = false,
  ...props
}: ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface",
        interactive &&
          "transition-all duration-300 hover:border-line-strong hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* --- Badge ---------------------------------------------------------------- */

type BadgeTone = "neutral" | "accent" | "violet" | "success" | "warning" | "danger";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-fg-muted border-line",
  accent: "bg-accent-soft text-accent border-transparent",
  violet: "bg-accent-2-soft text-accent-2 border-transparent",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-xs font-medium leading-none",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --- Section scaffolding -------------------------------------------------- */

export function Section({
  id,
  className,
  children,
  tone = "default",
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  tone?: "default" | "subtle";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-20 md:py-28",
        tone === "subtle" && "bg-bg-subtle",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-6 bg-accent/40" aria-hidden />
          {eyebrow}
          {align === "center" && (
            <span className="h-px w-6 bg-accent/40" aria-hidden />
          )}
        </div>
      )}
      <h2 className="text-3xl font-semibold leading-tight md:text-[2.6rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-fg-muted">
          {description}
        </p>
      )}
    </div>
  );
}

/* --- Form fields ---------------------------------------------------------- */

const fieldBase =
  "w-full rounded-[var(--radius)] border border-line bg-surface px-3.5 py-2.5 " +
  "text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-colors " +
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-[var(--ring)] " +
  "disabled:opacity-60";

export function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-2 text-sm font-medium text-fg"
      >
        <span>
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
        {hint && !error && (
          <span className="text-xs font-normal text-fg-subtle">{hint}</span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(fieldBase, invalid && "border-danger", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-[110px] resize-y", invalid && "border-danger", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select className={cn(fieldBase, "pr-9", className)} {...props}>
      {children}
    </select>
  );
}

/* --- Feedback ------------------------------------------------------------- */

export function Alert({
  tone = "neutral",
  title,
  children,
  className,
}: {
  tone?: "neutral" | "warning" | "danger" | "success" | "accent";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-2 border-line text-fg-muted",
    warning: "bg-warning-soft border-[var(--warning)]/25 text-fg",
    danger: "bg-danger-soft border-[var(--danger)]/25 text-fg",
    success: "bg-success-soft border-[var(--success)]/25 text-fg",
    accent: "bg-accent-soft border-accent/20 text-fg",
  };
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border px-4 py-3 text-sm leading-relaxed",
        tones[tone],
        className,
      )}
      role={tone === "danger" ? "alert" : undefined}
    >
      {title && <p className="mb-1 font-semibold text-fg">{title}</p>}
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface-2/50 px-6 py-14 text-center">
      {icon && <div className="mb-3 text-fg-subtle">{icon}</div>}
      <p className="font-medium text-fg">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-fg-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}
