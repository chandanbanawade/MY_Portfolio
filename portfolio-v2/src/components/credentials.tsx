import { certifications, education, memberships } from "@/content/credentials";
import { Reveal, Rule } from "./reveal";
import { Shell } from "./section";

/** One compact row. This does not get a viewport. */
export function Credentials() {
  return (
    <section aria-label="Certifications and education" className="relative z-10 py-14">
      <Shell>
        <Rule className="mb-10" />
        <Reveal>
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="meta-label mb-3">Certifications</dt>
              <dd className="flex flex-col gap-1.5 text-sm text-text">
                {certifications.map((cert) => (
                  <span key={cert.name}>
                    {cert.name}
                    <span className="font-mono text-meta text-muted"> — {cert.issuer}</span>
                  </span>
                ))}
              </dd>
            </div>

            <div>
              <dt className="meta-label mb-3">Credential ID</dt>
              <dd className="font-mono text-meta text-muted">
                {certifications.find((c) => c.id)?.id ?? "—"}
              </dd>
            </div>

            <div>
              <dt className="meta-label mb-3">Membership</dt>
              <dd className="flex flex-col gap-1.5 text-sm text-text">
                {memberships.map((m) => (
                  <span key={m.name}>
                    {m.name}
                    <span className="font-mono text-meta text-muted"> — {m.issuer}</span>
                  </span>
                ))}
              </dd>
            </div>

            <div>
              <dt className="meta-label mb-3">Education</dt>
              <dd className="text-sm text-text">
                {education.degree}
                <span className="mt-1 block font-mono text-meta text-muted">
                  {education.institution} ·{" "}
                  <time dateTime={education.endISO}>
                    {education.start}–{education.end}
                  </time>
                </span>
              </dd>
            </div>
          </dl>
        </Reveal>
      </Shell>
    </section>
  );
}
