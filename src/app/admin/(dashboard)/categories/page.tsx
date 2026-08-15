import { prisma } from "@/lib/prisma";
import { Card, Badge, Alert } from "@/components/ui/primitives";
import { PageHeader } from "../shared";
import { toggleCategoryActiveAction } from "../../actions";
import { categoryGroups, groupOrder } from "@/config/categories";
import { Icon } from "@/components/ui/icon";
import { parseStringArray } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.mentorshipCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const grouped = groupOrder
    .map((key) => ({
      key,
      meta: categoryGroups[key],
      items: categories.filter((c) => c.group === key),
    }))
    .filter((g) => g.items.length > 0);

  const activeCount = categories.filter((c) => c.active).length;

  return (
    <>
      <PageHeader
        title="Mentorship categories"
        description={`${activeCount} of ${categories.length} categories are live. Hidden categories disappear from the homepage and the booking wizard.`}
      />

      <Alert tone="accent" className="mb-6">
        Categories marked{" "}
        <span className="mx-0.5 inline-flex translate-y-px">
          <Badge tone="accent">Professional field</Badge>
        </span>{" "}
        are backed by the CV; the rest are shown to visitors as mentorship and
        guidance areas rather than employment history. Edit the wording in{" "}
        <code className="font-mono text-[0.6875rem]">src/config/categories.ts</code>{" "}
        and re-run <code className="font-mono text-[0.6875rem]">npm run db:seed</code>.
      </Alert>

      <div className="space-y-8">
        {grouped.map((group) => (
          <section key={group.key}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
              <Icon name={group.meta.icon} className="h-4 w-4 text-accent" />
              {group.meta.label}
              <span className="text-xs font-normal text-fg-subtle">
                {group.items.filter((i) => i.active).length}/{group.items.length} live
              </span>
            </h2>

            <Card className="divide-y divide-[var(--border)]">
              {group.items.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-wrap items-start justify-between gap-3 px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Icon
                        name={category.icon}
                        className="h-4 w-4 shrink-0 text-fg-subtle"
                      />
                      <p className="text-sm font-medium text-fg">
                        {category.title}
                      </p>
                      {category.backing === "professional" && (
                        <Badge tone="accent">Professional field</Badge>
                      )}
                      <Badge tone={category.active ? "success" : "neutral"}>
                        {category.active ? "Live" : "Hidden"}
                      </Badge>
                    </div>

                    <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                      {category.description}
                    </p>

                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {parseStringArray(category.topics).map((topic) => (
                        <li
                          key={topic}
                          className="rounded-[var(--radius-sm)] border border-line bg-surface-2 px-2 py-0.5 text-[0.6875rem] text-fg-subtle"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form action={toggleCategoryActiveAction} className="shrink-0">
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      className="rounded-[var(--radius-sm)] border border-line px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      {category.active ? "Hide" : "Show"}
                    </button>
                  </form>
                </div>
              ))}
            </Card>
          </section>
        ))}
      </div>
    </>
  );
}
