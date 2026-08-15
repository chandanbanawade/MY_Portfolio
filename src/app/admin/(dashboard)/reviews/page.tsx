import { Hash, Mail, Star, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, Badge, Alert, EmptyState } from "@/components/ui/primitives";
import { PageHeader, StatCard } from "../shared";
import { toggleReviewPublishedAction, deleteReviewAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ published: "asc" }, { createdAt: "desc" }],
    include: { booking: { select: { reference: true, date: true } } },
  });

  const pending = reviews.filter((r) => !r.published);
  const published = reviews.filter((r) => r.published);
  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <>
      <PageHeader
        title="Ratings & testimonials"
        description="Ratings submitted through the “Rate your session” form. Nothing appears on the site until you publish it."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Awaiting review"
          value={String(pending.length)}
          sublabel="Not visible on the site"
        />
        <StatCard
          label="Published"
          value={String(published.length)}
          sublabel="Live on the homepage"
        />
        <StatCard
          label="Average rating"
          value={average}
          sublabel={`${reviews.length} total submission${reviews.length === 1 ? "" : "s"}`}
        />
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Star className="h-6 w-6" strokeWidth={1.5} />}
            title="No ratings yet"
            description="When someone rates a session on the homepage, it lands here for approval. The public page shows only the rating form until then — never placeholder reviews."
          />
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <Alert tone="accent" className="mt-8">
              {pending.length} rating{pending.length === 1 ? "" : "s"} awaiting
              your approval. Publish the ones you&apos;re happy to show publicly.
            </Alert>
          )}

          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-0.5" aria-label={`${review.rating} stars`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.rating
                              ? "h-3.5 w-3.5 fill-[var(--warning)] text-[var(--warning)]"
                              : "h-3.5 w-3.5 text-fg-subtle"
                          }
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <Badge tone={review.published ? "success" : "warning"}>
                      {review.published ? "Published" : "Awaiting approval"}
                    </Badge>
                    {review.booking && (
                      <Badge tone="accent">
                        <Hash className="h-3 w-3" strokeWidth={2} />
                        Verified attendee
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={toggleReviewPublishedAction}>
                      <input type="hidden" name="id" value={review.id} />
                      <button
                        type="submit"
                        className="rounded-[var(--radius-sm)] border border-line px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                      >
                        {review.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteReviewAction}>
                      <input type="hidden" name="id" value={review.id} />
                      <button
                        type="submit"
                        aria-label="Delete rating"
                        className="rounded-[var(--radius-sm)] p-1.5 text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </form>
                  </div>
                </div>

                {review.quote ? (
                  <blockquote className="mt-3 text-sm leading-relaxed text-fg-muted">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                ) : (
                  <p className="mt-3 text-sm italic text-fg-subtle">
                    Rating only — no written feedback.
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-xs text-fg-subtle">
                  <span className="font-medium text-fg">{review.name}</span>
                  {review.role && <span>{review.role}</span>}
                  {review.email && (
                    <a
                      href={`mailto:${review.email}`}
                      className="flex items-center gap-1.5 hover:text-accent"
                    >
                      <Mail className="h-3 w-3" strokeWidth={1.8} />
                      {review.email}
                    </a>
                  )}
                  {review.reference && (
                    <span className="font-mono">{review.reference}</span>
                  )}
                  <span>
                    {review.createdAt.toISOString().slice(0, 10)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
