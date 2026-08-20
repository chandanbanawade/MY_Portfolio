import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";
import { metrics } from "@/content/metrics";

export const alt = `${profile.name} — offensive security consultant`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GROUND = "#12110f";
const TEXT = "#efe9df";
const MUTED = "#9c9285";
const HAIRLINE = "#2f2b24";
const SIGNAL = "#ff6b3d";

/**
 * Satori needs TTF/OTF, so the two faces are vendored (SIL Open Font License —
 * see src/assets/fonts/OFL.txt) and read from disk. The card therefore builds
 * offline and does not depend on a font CDN being up at deploy time.
 */
function loadFont(file: string) {
  return readFile(join(process.cwd(), "src", "assets", "fonts", file));
}

const serifFamily = "Newsreader";
const monoFamily = "JetBrains Mono";

export default async function OpengraphImage() {
  const [serif, mono] = await Promise.all([
    loadFont("newsreader.ttf"),
    loadFont("jetbrains-mono.ttf"),
  ]);

  const fonts = [
    { name: serifFamily, data: serif, weight: 400 as const, style: "normal" as const },
    { name: monoFamily, data: mono, weight: 400 as const, style: "normal" as const },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: GROUND,
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: monoFamily,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <span>{profile.role}</span>
          <span>
            {profile.employer} · {profile.location}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: serifFamily,
              fontSize: 104,
              lineHeight: 1,
              color: TEXT,
              letterSpacing: -2,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 900,
              fontFamily: monoFamily,
              fontSize: 25,
              lineHeight: 1.5,
              color: TEXT,
            }}
          >
            1-to-1 mentorship — cybersecurity, AI/ML, data science.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontFamily: monoFamily,
              fontSize: 21,
              color: MUTED,
            }}
          >
            Free 15-minute consultation · sessions from ₹199
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", height: 1, background: HAIRLINE }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {metrics.map((metric) => (
              <div key={metric.label} style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: serifFamily,
                    fontSize: 56,
                    lineHeight: 1,
                    color: metric.prefix === "#" ? SIGNAL : TEXT,
                  }}
                >
                  {metric.prefix ?? ""}
                  {metric.value}
                  {metric.suffix ?? ""}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 12,
                    maxWidth: 230,
                    fontFamily: monoFamily,
                    fontSize: 18,
                    lineHeight: 1.4,
                    color: MUTED,
                  }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
