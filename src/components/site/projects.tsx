"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Github, TrendingUp } from "lucide-react";
import { projects, projectFilters } from "@/config/projects";
import { Section, SectionHeader, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { initialsOf, cn } from "@/lib/format";

export function Projects() {
  const [filter, setFilter] = useState<string>("All");

  // Only show filters that actually match something.
  const availableFilters = useMemo(
    () =>
      projectFilters.filter(
        (f) => f === "All" || projects.some((p) => p.tags.includes(f)),
      ),
    [],
  );

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.tags.includes(filter)),
    [filter],
  );

  return (
    <Section id="projects">
      <SectionHeader
        eyebrow="Work"
        title="Projects &amp; engagements"
        description="Security tooling I've built, research I've published and work I've delivered for clients."
      />

      {/* Filters */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {availableFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
              filter === f
                ? "border-transparent bg-fg text-fg-inverse"
                : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => (
          <Reveal key={project.slug} variant="pop" delay={index * 50}>
            <Card interactive className="flex h-full flex-col overflow-hidden">
              {/* Cover */}
              <div className="relative h-40 overflow-hidden border-b border-line bg-surface-2">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  /* No image supplied — generated cover.
                     Drop a file in /public/projects and set `image` in config. */
                  <div className="relative flex h-full items-center justify-center bg-gradient-to-br from-accent/12 via-surface-2 to-accent-2/12">
                    <div
                      className="absolute inset-0 opacity-[0.35] grid-backdrop"
                      aria-hidden
                    />
                    <span className="relative text-3xl font-semibold tracking-tight text-fg-subtle">
                      {initialsOf(project.title)}
                    </span>
                  </div>
                )}

                {project.featured && (
                  <span className="absolute right-3 top-3">
                    <Badge tone="accent">Featured</Badge>
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[0.9375rem] font-semibold leading-snug text-fg">
                  {project.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
                  {project.summary}
                </p>

                {project.result && (
                  <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] bg-success-soft px-3 py-2">
                    <TrendingUp
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                      strokeWidth={2}
                    />
                    <span className="text-xs font-medium leading-snug text-fg">
                      {project.result}
                    </span>
                  </div>
                )}

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-[var(--radius-sm)] border border-line bg-surface-2 px-2 py-0.5 text-[0.6875rem] font-medium text-fg-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {(project.github || project.demo) && (
                  <div className="mt-4 flex gap-2 border-t border-line pt-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-line px-2.5 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                      >
                        <Github className="h-3.5 w-3.5" strokeWidth={1.8} />
                        GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-line px-2.5 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                      >
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

    </Section>
  );
}
