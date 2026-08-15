import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — Cyber Security & AI Mentor`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated Open Graph card — what people see when the site is shared on
 * LinkedIn, WhatsApp or X. Built at request time so it always reflects config.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05070d",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#98a3b8",
              fontSize: 26,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {site.initials}
            </div>
            {site.role}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 68,
              fontWeight: 700,
              color: "#e9edf6",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            1-to-1 mentorship in cyber security, AI/ML and tech careers.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: "#fff" }}>
              {site.name}
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#6f7b93" }}>
              500+ vulnerabilities disclosed · Top 5 HackerOne India
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "16px 28px",
              borderRadius: 12,
              background: "#5b93ff",
              color: "#05070d",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            Book a session
          </div>
        </div>
      </div>
    ),
    size,
  );
}
