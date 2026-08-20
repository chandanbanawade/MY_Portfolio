"use client";

import { useMemo, useState } from "react";

import {
  findings,
  severityOrder,
  vulnClasses,
  type Finding,
  type Severity,
  type VulnClass,
} from "@/content/findings";
import { Reveal } from "./reveal";
import { Section } from "./section";

const SEVERITIES: Severity[] = ["Critical", "High", "Medium"];

/**
 * Severity is one hue at four strengths, not four hues. Only Critical is
 * allowed to fill; everything below it steps down through outline, then bone,
 * then muted — which is how a real triage queue directs attention.
 */
const severityChip: Record<Severity, string> = {
  Critical: "bg-signal text-signal-ink border-signal",
  High: "text-signal border-signal/45",
  Medium: "text-text border-hairline-strong",
  Low: "text-muted border-hairline",
};

function Chip({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center border px-2.5 py-1 font-mono text-meta uppercase tracking-[0.1em] ${severityChip[severity]}`}
    >
      {severity}
    </span>
  );
}

function Entry({ finding, index }: { finding: Finding; index: number }) {
  return (
    <Reveal as="li" delay={Math.min(index, 4) * 60} className="bg-ground">
      <article className="grid gap-6 py-9 sm:py-11 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
        {/* Metadata column — reads like the header block of a report entry. */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-meta text-hairline-strong tabular-nums">
              {finding.id}
            </span>
            <Chip severity={finding.severity} />
          </div>
          <h3 className="font-display text-lg text-text sm:text-xl">{finding.vulnClass}</h3>
          <p className="font-mono text-meta text-muted">
            CVSS <span className="text-text tabular-nums">{finding.cvss.toFixed(1)}</span>
          </p>
          <p className="break-all font-mono text-meta leading-relaxed text-hairline-strong">
            {finding.vector}
          </p>
        </div>

        {/* Impact column — what an attacker could do, first sentence, always. */}
        <div className="flex flex-col gap-4">
          <p className="text-base text-text sm:max-w-[62ch]">{finding.impact}</p>

          <details className="group">
            <summary className="meta-label inline-flex cursor-pointer list-none items-center gap-2 transition-colors duration-300 hover:text-text">
              <span aria-hidden="true" className="transition-transform duration-300 group-open:rotate-90">
                ›
              </span>
              Route
            </summary>
            <p className="mt-3 max-w-[62ch] text-sm text-muted">{finding.method}</p>
          </details>

          <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-meta text-muted">
            <div className="flex gap-2">
              <dt className="text-hairline-strong">Target</dt>
              <dd className="text-muted">{finding.target}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-hairline-strong">Year</dt>
              <dd>
                <time dateTime={finding.year}>{finding.year}</time>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-hairline-strong">Status</dt>
              <dd>{finding.status}</dd>
            </div>
            {finding.disclosure ? (
              <a href={finding.disclosure} className="text-text underline underline-offset-4">
                Public write-up
              </a>
            ) : null}
          </dl>
        </div>
      </article>
    </Reveal>
  );
}

type Sort = "severity" | "recent";

export function Findings() {
  const [severity, setSeverity] = useState<Severity | "All">("All");
  const [vulnClass, setVulnClass] = useState<VulnClass | "All">("All");
  const [sort, setSort] = useState<Sort>("severity");

  const visible = useMemo(() => {
    const filtered = findings.filter(
      (f) =>
        (severity === "All" || f.severity === severity) &&
        (vulnClass === "All" || f.vulnClass === vulnClass),
    );
    return filtered.sort((a, b) =>
      sort === "recent"
        ? Number(b.year) - Number(a.year) || severityOrder[a.severity] - severityOrder[b.severity]
        : severityOrder[a.severity] - severityOrder[b.severity] || b.cvss - a.cvss,
    );
  }, [severity, vulnClass, sort]);

  const filtered = severity !== "All" || vulnClass !== "All";

  function clear() {
    setSeverity("All");
    setVulnClass("All");
  }

  return (
    <Section
      id="findings"
      index="01"
      title="Selected findings"
      note="Targets are described by sector. Client names and report detail are withheld under NDA or coordinated disclosure."
    >
      {/* ---- Controls: a triage queue's controls, not a filter bar ---- */}
      <div className="flex flex-col gap-5 border-y border-hairline py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
          <span className="meta-label mr-2">Severity</span>
          {(["All", ...SEVERITIES] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSeverity(level)}
              aria-pressed={severity === level}
              className="border border-hairline px-3 py-1.5 font-mono text-meta text-muted transition-colors duration-300 hover:border-hairline-strong hover:text-text aria-pressed:border-text aria-pressed:text-text"
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <label className="flex items-center gap-2">
            <span className="meta-label">Class</span>
            <select
              value={vulnClass}
              onChange={(e) => setVulnClass(e.target.value as VulnClass | "All")}
              className="border border-hairline bg-ground px-3 py-1.5 font-mono text-meta text-text transition-colors duration-300 hover:border-hairline-strong"
            >
              <option value="All">All classes</option>
              {vulnClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="meta-label">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="border border-hairline bg-ground px-3 py-1.5 font-mono text-meta text-text transition-colors duration-300 hover:border-hairline-strong"
            >
              <option value="severity">Severity</option>
              <option value="recent">Most recent</option>
            </select>
          </label>
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {visible.length} of {findings.length} findings shown
      </p>

      {visible.length === 0 ? (
        <div className="py-16">
          <p className="text-base text-text">
            Nothing matches that combination. There are {findings.length} findings in total.
          </p>
          <button
            type="button"
            onClick={clear}
            className="meta-label mt-4 border border-hairline px-3 py-1.5 transition-colors duration-300 hover:border-text hover:text-text"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="grid gap-px bg-hairline">
          {visible.map((finding, i) => (
            <Entry key={finding.id} finding={finding} index={i} />
          ))}
        </ul>
      )}

      {filtered && visible.length > 0 ? (
        <button
          type="button"
          onClick={clear}
          className="meta-label mt-8 border border-hairline px-3 py-1.5 transition-colors duration-300 hover:border-text hover:text-text"
        >
          Clear filters — showing {visible.length} of {findings.length}
        </button>
      ) : null}
    </Section>
  );
}
