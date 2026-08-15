import Link from "next/link";
import { Linkedin, Mail, MapPin, Phone, Github, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg-subtle">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-fg text-fg-inverse">
                <ShieldCheck className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} />
              </span>
              <span className="text-[0.9375rem] font-semibold">{site.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
              Cyber Security Consultant and security researcher, mentoring in
              offensive security, AI/ML and tech careers — one session at a time.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {site.socials.linkedin && (
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-surface text-fg-muted transition-colors hover:text-accent hover:border-line-strong"
                >
                  <Linkedin className="h-4 w-4" strokeWidth={1.8} />
                </a>
              )}
              {site.socials.github && (
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-surface text-fg-muted transition-colors hover:text-accent hover:border-line-strong"
                >
                  <Github className="h-4 w-4" strokeWidth={1.8} />
                </a>
              )}
              <a
                href={`mailto:${site.contact.email}`}
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-surface text-fg-muted transition-colors hover:text-accent hover:border-line-strong"
              >
                <Mail className="h-4 w-4" strokeWidth={1.8} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/book"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Book a Session
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-fg-muted">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="break-all transition-colors hover:text-accent"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-accent"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.7} />
                <span>
                  {site.location}
                  <br />
                  <span className="text-fg-subtle">{site.timezoneLabel}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Sessions are mentorship and guidance only — not a guarantee of
            employment or certification.
          </p>
        </div>
      </div>
    </footer>
  );
}
