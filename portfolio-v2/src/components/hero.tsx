import type { CSSProperties, ReactNode } from "react";

import { profile } from "@/content/profile";
import { request, response, responseBodyLines } from "@/content/exchange";
import { Shell } from "./section";

/* -------------------------------------------------------------------------
   The load sequence. One timeline, every delay derived from this table, whole
   thing resolved inside 1200ms. Driven by CSS custom properties rather than a
   motion library — see DESIGN.md.
------------------------------------------------------------------------- */
const SEQ = {
  role: 60,
  name: 130,
  positioning: 200,
  location: 260,
  actions: 320,
  panes: 400,
  bodyStart: 470,
  bodyStep: 20,
} as const;

function delay(ms: number): CSSProperties {
  return { "--seq-delay": `${ms}ms` } as CSSProperties;
}

/* JSON line colouring. Keys recede, values carry. No accent in here — the
   signal colour is spent on severity and the call to action, nowhere else. */
function JsonLine({ line }: { line: string }) {
  const match = line.match(/^(\s*)"([^"]+)":\s?(.*)$/);

  if (!match) {
    return <span className="text-hairline-strong">{line}</span>;
  }

  const [, indent, key, rest] = match;
  const isStructural = /^[[{]/.test(rest);

  return (
    <>
      <span>{indent}</span>
      <span className="text-muted">&quot;{key}&quot;</span>
      <span className="text-hairline-strong">: </span>
      <span className={isStructural ? "text-hairline-strong" : "text-text"}>{rest}</span>
    </>
  );
}

function Pane({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2.5">
        <span className="meta-label">{title}</span>
        <span className="font-mono text-meta text-hairline-strong">{meta}</span>
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <pre className="font-mono text-meta leading-[1.75] text-text sm:text-sm">{children}</pre>
      </div>
    </div>
  );
}

function HeaderLines({ headers }: { headers: readonly { name: string; value: string }[] }) {
  return (
    <>
      {headers.map((header) => (
        <span key={header.name}>
          <span className="text-muted">{header.name}</span>
          <span className="text-hairline-strong">: </span>
          <span className="text-text">{header.value}</span>
          {"\n"}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const [method, path, version] = request.startLine.split(" ");
  const [proto, ...status] = response.statusLine.split(" ");

  return (
    <header className="relative z-10 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <Shell>
        <p className="seq meta-label mb-8" style={delay(SEQ.role)}>
          {profile.role} · {profile.employer} ({profile.employerParent})
        </p>

        <h1
          className="seq max-w-4xl text-4xl leading-[1.02] tracking-[-0.02em] text-text sm:text-5xl lg:text-6xl"
          style={delay(SEQ.name)}
        >
          {profile.name}
        </h1>

        <p
          className="seq mt-8 max-w-2xl text-lg text-text/90 sm:text-xl sm:leading-[1.45]"
          style={delay(SEQ.positioning)}
        >
          {profile.positioning}
        </p>

        <div
          className="seq mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-meta text-muted"
          style={delay(SEQ.location)}
        >
          <span>{profile.location}</span>
          <span aria-hidden="true" className="text-hairline-strong">
            /
          </span>
          <span>{profile.relocation}</span>
        </div>

        <div
          className="seq mt-10 flex flex-wrap items-center gap-4"
          style={delay(SEQ.actions)}
        >
          <a
            href="#sessions"
            className="bg-signal px-6 py-3 font-mono text-meta uppercase tracking-[0.12em] text-signal-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
          >
            Book a session
          </a>
          <a
            href={profile.cvPath}
            className="border border-hairline-strong px-6 py-3 font-mono text-meta uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:border-text"
          >
            Download CV
          </a>

          {/* Live feed of wins, talks and event photos — the part of the record
              that changes weekly and therefore should not be frozen into HTML. */}
          <a
            href={profile.linkedinActivity}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 border border-hairline bg-surface px-6 py-3 font-mono text-meta uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:border-text hover:bg-surface-2"
          >
            Achievements &amp; Moments
            <span
              aria-hidden="true"
              className="text-muted transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
            >
              ↗
            </span>
            <span className="sr-only">— opens LinkedIn activity in a new tab</span>
          </a>
        </div>

        <div
          className="seq mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta text-muted"
          style={delay(SEQ.actions)}
        >
          <span>Free 15-minute consultation first, if you prefer</span>
          <span aria-hidden="true" className="text-hairline-strong">
            /
          </span>
          <span>Latest talks &amp; wins on LinkedIn</span>
        </div>

        {/* ---- Signature: the Repeater pair ---- */}
        <div
          className="seq mt-16 grid gap-px border border-hairline bg-hairline sm:mt-20 lg:grid-cols-2"
          style={delay(SEQ.panes)}
        >
          <Pane title="Request" meta="raw">
            <span className="text-text">{method} </span>
            <span className="text-text">{path} </span>
            <span className="text-hairline-strong">{version}</span>
            {"\n"}
            <HeaderLines headers={request.headers} />
          </Pane>

          <Pane title="Response" meta="200 · application/json">
            <span className="text-hairline-strong">{proto} </span>
            <span className="text-text">{status.join(" ")}</span>
            {"\n"}
            <HeaderLines headers={response.headers} />
            {"\n"}
            {responseBodyLines.map((line, i) => (
              <span
                key={i}
                className="seq-line block"
                style={delay(SEQ.bodyStart + i * SEQ.bodyStep)}
              >
                <JsonLine line={line} />
              </span>
            ))}
          </Pane>
        </div>
      </Shell>
    </header>
  );
}
