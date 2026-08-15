import type { ReactNode } from "react";
import { Card, Badge } from "@/components/ui/primitives";
import type { BookingStatus } from "@/lib/types";
import { statusLabels } from "@/lib/types";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sublabel,
  icon,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
          {label}
        </p>
        {icon && <span className="text-fg-subtle">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-fg-subtle">{sublabel}</p>}
    </Card>
  );
}

const statusTone: Record<
  BookingStatus,
  "success" | "warning" | "neutral" | "danger"
> = {
  confirmed: "success",
  pending: "warning",
  completed: "neutral",
  cancelled: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  const key = (status as BookingStatus) in statusLabels
    ? (status as BookingStatus)
    : "pending";
  return <Badge tone={statusTone[key]}>{statusLabels[key]}</Badge>;
}
