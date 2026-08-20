"use client";

import { useMemo, useState } from "react";
import { ChevronRight, ShieldAlert } from "lucide-react";

import { Section, SectionHeader, Card, Badge, Select } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import {
  findings,
  findingClasses,
  findingsCopy,
  severityOrder,
  type Finding,
  type Severity,
  type VulnClass,
} from "@/config/findings";

const SEVERITIES: Severity[] = ["Critical", "High", "Medium"];

/** Severity maps onto the existing semantic badge tones, not new colours. */
const severityTone: Record<Severity, "danger" | "warning" | "accent" | "neutral"> = {
  Critical: "danger",
  High: "warning",
  Medium: "accent",
  Low: "neutral",
};

type Sort = "severity" | "recent";

function FindingCard({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);

  return (
    <Card interactive className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={severityTone[finding.severity]}>{finding.severity}</Badge>
          {finding.bounty && <Badge tone="success">Bounty</Badge>}
        </div>
        <span className="font-mono text-xs text-fg-subtle">{finding.id}</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-fg">
        {finding.vulnClass}
      </h3>
      <p className="mt-1 text-sm text-fg-subtle">{finding.target}</p>

      <p className="mt-4 text-sm leading-relaxed text-fg-muted">{finding.impact}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg-subtle">
        <span className="font-medium text-fg-muted">
          CVSS <span className="font-mono">{finding.cvss.toFixed(1)}</span>
        </span>
        <time dateTime={finding.year}>{finding.year}</time>
        <span>{finding.status}</span>
      </div>

      <p className="mt-3 break-all rounded-[var(--radius-sm)] bg-surface-2 px-2.5 py-2 font-mono text-[0.6875rem] leading-relaxed text-fg-subtle">
        {finding.vector}
      </p>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            strokeWidth={2}
            aria-hidden
          />
          How it was reached
        </button>
        {open && (
          <p className="mt-2.5 border-t border-line pt-3 text-sm leading-relaxed text-fg-muted">
            {finding.method}
          </p>
        )}
      </div>
    </Card>
  );
}

export function Findings() {
  const [severity, setSeverity] = useState<Severity | "All">("All");
  const [vulnClass, setVulnClass] = useState<VulnClass | "All">("All");
  const [sort, setSort] = useState<Sort>("severity");

  const visible = useMemo(() => {
    return findings
      .filter(
        (f) =>
          (severity === "All" || f.severity === severity) &&
          (vulnClass === "All" || f.vulnClass === vulnClass),
      )
      .sort((a, b) =>
        sort === "recent"
          ? Number(b.year) - Number(a.year) ||
            severityOrder[a.severity] - severityOrder[b.severity]
          : severityOrder[a.severity] - severityOrder[b.severity] || b.cvss - a.cvss,
      );
  }, [severity, vulnClass, sort]);

  function clear() {
    setSeverity("All");
    setVulnClass("All");
  }

  return (
    <Section id="findings">
      <SectionHeader
        eyebrow={findingsCopy.eyebrow}
        title={findingsCopy.title}
        description={findingsCopy.description}
      />

      {/* Client names and report detail are withheld — say so plainly. */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-fg-subtle">
        Targets are described by sector. Client names and full reports stay under NDA or
        coordinated disclosure.
      </p>

      {/* --- Filters --- */}
      <div className="mt-10 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-surface-2/50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Severity
          </span>
          {(["All", ...SEVERITIES] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSeverity(level)}
              aria-pressed={severity === level}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                severity === level
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Class
            <Select
              value={vulnClass}
              onChange={(e) => setVulnClass(e.target.value as VulnClass | "All")}
              className="w-auto py-1.5 text-xs font-normal normal-case tracking-normal"
            >
              <option value="All">All classes</option>
              {findingClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Sort
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-auto py-1.5 text-xs font-normal normal-case tracking-normal"
            >
              <option value="severity">Severity</option>
              <option value="recent">Most recent</option>
            </Select>
          </label>
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {visible.length} of {findings.length} findings shown
      </p>

      {visible.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface-2/50 px-6 py-14 text-center">
          <ShieldAlert className="mb-3 h-5 w-5 text-fg-subtle" strokeWidth={1.8} aria-hidden />
          <p className="font-medium text-fg">Nothing matches that combination.</p>
          <p className="mt-1.5 text-sm text-fg-muted">
            There are {findings.length} findings in total.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-5 rounded-[var(--radius)] border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-line-strong"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((finding, i) => (
            <Reveal key={finding.id} variant="pop" delay={Math.min(i, 5) * 55}>
              <FindingCard finding={finding} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
