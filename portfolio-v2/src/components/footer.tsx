import { profile } from "@/content/profile";
import { Rule } from "./reveal";
import { Shell } from "./section";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 pb-14 pt-6">
      <Shell>
        <Rule className="mb-8" />
        <div className="flex flex-col gap-6 font-mono text-meta text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name} · {profile.location}
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/.well-known/security.txt"
              className="transition-colors duration-300 hover:text-text"
            >
              security.txt
            </a>
            <span className="text-hairline-strong" aria-hidden="true">
              /
            </span>
            <a
              href={profile.linkedin}
              rel="me noopener noreferrer"
              target="_blank"
              className="transition-colors duration-300 hover:text-text"
            >
              LinkedIn
            </a>
            <span className="text-hairline-strong" aria-hidden="true">
              /
            </span>
            <a
              href={profile.linkedinActivity}
              rel="noopener noreferrer"
              target="_blank"
              className="transition-colors duration-300 hover:text-text"
            >
              Achievements &amp; Moments ↗
            </a>
          </p>
        </div>
      </Shell>
    </footer>
  );
}
