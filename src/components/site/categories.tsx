import { ArrowRight, Info } from "lucide-react";
import { Section, SectionHeader, Card, Badge, Alert } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { categoryGroups, groupOrder, type CategoryGroupKey } from "@/config/categories";
import { site } from "@/config/site";
import type { CategoryView } from "@/lib/data";

export function Categories({ categories }: { categories: CategoryView[] }) {
  const grouped = groupOrder
    .map((key) => ({
      key,
      meta: categoryGroups[key],
      items: categories.filter((c) => c.group === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Section id="categories">
      <SectionHeader
        eyebrow="Mentorship areas"
        title="Choose your mentorship"
        description="Mentorship isn't limited to one field. Pick the area you need help with — you'll choose it as the first step when you book."
      />

      {/* Honest framing: what the platform offers vs. what the CV evidences. */}
      <Alert tone="neutral" className="mx-auto mt-8 max-w-3xl">
        <span className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
          <span>
            These are the areas {site.shortName} offers mentorship in. Cards
            marked{" "}
            <span className="mx-0.5 inline-flex translate-y-px">
              <Badge tone="accent">Professional field</Badge>
            </span>{" "}
            are backed by his documented professional experience; the rest are
            mentorship and career guidance rather than claims of industry
            employment in that field.
          </span>
        </span>
      </Alert>

      <div className="mt-12 space-y-14">
        {grouped.map((group) => (
          <div key={group.key}>
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] bg-surface-2 text-fg-muted">
                <Icon name={group.meta.icon} className="h-4.5 w-4.5" />
              </span>
              <h3 className="text-lg font-semibold text-fg">{group.meta.label}</h3>
              <p className="w-full text-sm text-fg-subtle sm:w-auto">
                {group.meta.blurb}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((category, index) => (
                <Reveal key={category.slug} variant="pop" delay={index * 45}>
                  <CategoryCard category={category} groupKey={group.key} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const groupAccent: Record<CategoryGroupKey, string> = {
  cybersecurity: "bg-accent-soft text-accent",
  ai_ml: "bg-accent-2-soft text-accent-2",
  data_science: "bg-success-soft text-success",
  programming: "bg-surface-3 text-fg-muted",
  career: "bg-warning-soft text-warning",
  interview: "bg-accent-soft text-accent",
  projects: "bg-accent-2-soft text-accent-2",
};

function CategoryCard({
  category,
  groupKey,
}: {
  category: CategoryView;
  groupKey: CategoryGroupKey;
}) {
  return (
    <Card interactive className="group flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius)] ${groupAccent[groupKey]}`}
        >
          <Icon name={category.icon} className="h-5 w-5" />
        </span>
        {category.backing === "professional" && (
          <Badge tone="accent">Professional field</Badge>
        )}
      </div>

      <h4 className="mt-4 text-[0.9375rem] font-semibold leading-snug text-fg">
        {category.title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        {category.description}
      </p>

      {category.topics.length > 0 && (
        <ul className="mt-3.5 flex flex-wrap gap-1.5">
          {category.topics.slice(0, 4).map((topic) => (
            <li
              key={topic}
              className="rounded-[var(--radius-sm)] border border-line bg-surface-2 px-2 py-0.5 text-[0.6875rem] font-medium text-fg-muted"
            >
              {topic}
            </li>
          ))}
          {category.topics.length > 4 && (
            <li className="px-1 py-0.5 text-[0.6875rem] text-fg-subtle">
              +{category.topics.length - 4} more
            </li>
          )}
        </ul>
      )}

      <a
        href={`/book?category=${category.slug}`}
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Book a session
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </a>
    </Card>
  );
}
