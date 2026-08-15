"use client";

import { useState } from "react";
import { CheckCircle2, Send, Star } from "lucide-react";
import { Section, SectionHeader, Card, Field, Input, Textarea, Alert, Spinner } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { feedbackSettings } from "@/config/testimonials";
import { initialsOf, cn } from "@/lib/format";

export type PublishedReview = {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
};

const RATING_LABELS: Record<number, string> = {
  1: "Not useful",
  2: "Below expectations",
  3: "Useful",
  4: "Very useful",
  5: "Excellent",
};

/* --- Star display (read-only) --------------------------------------------- */

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "h-4 w-4 fill-[var(--warning)] text-[var(--warning)]"
              : "h-4 w-4 text-fg-subtle/50"
          }
          strokeWidth={1.5}
          aria-hidden
        />
      ))}
    </div>
  );
}

/* --- Star selector (interactive) ------------------------------------------ */

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Session rating out of 5"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"} — ${RATING_LABELS[star]}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                star <= shown
                  ? "fill-[var(--warning)] text-[var(--warning)]"
                  : "text-fg-subtle/40",
              )}
              strokeWidth={1.4}
              aria-hidden
            />
          </button>
        ))}

        <span
          className={cn(
            "ml-2 text-sm font-medium transition-opacity",
            shown ? "text-fg opacity-100" : "opacity-0",
          )}
          aria-hidden
        >
          {RATING_LABELS[shown] ?? ""}
        </span>
      </div>
    </div>
  );
}

/* --- Section --------------------------------------------------------------- */

export function Feedback({ reviews }: { reviews: PublishedReview[] }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [comment, setComment] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const canSubmit =
    rating > 0 && name.trim().length >= 2 && /\S+@\S+\.\S+/.test(email);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, name, role, email, comment, reference }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) setErrors(data.fields);
        setFormError(data.error ?? "Could not save your rating.");
        return;
      }

      setDone(true);
    } catch {
      setFormError("Network problem — please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  const hasReviews = reviews.length > 0;

  return (
    <Section id="feedback" tone="subtle">
      <SectionHeader
        eyebrow={feedbackSettings.eyebrow}
        title={feedbackSettings.title}
        description={feedbackSettings.description}
      />

      <div
        className={cn(
          "mt-12 grid gap-6",
          hasReviews ? "lg:grid-cols-[1fr_1fr] lg:gap-10" : "mx-auto max-w-xl",
        )}
      >
        {/* --- Published reviews, only when genuine ones exist --------------- */}
        {hasReviews && (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 60}>
                <Card className="p-5">
                  <StarDisplay rating={review.rating} />
                  {review.quote && (
                    <blockquote className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                  )}
                  <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-[0.6875rem] font-semibold text-fg-muted">
                      {initialsOf(review.name)}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-fg">
                        {review.name}
                      </span>
                      {review.role && (
                        <span className="block text-xs text-fg-subtle">
                          {review.role}
                        </span>
                      )}
                    </span>
                  </figcaption>
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        {/* --- Rating form --------------------------------------------------- */}
        <Reveal>
          <Card className="p-6 sm:p-7">
            {done ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft">
                  <CheckCircle2 className="h-6 w-6 text-success" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-fg">
                  {feedbackSettings.successTitle}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
                  {feedbackSettings.successMessage}
                </p>
                <div className="mt-4">
                  <StarDisplay rating={rating} />
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-fg">
                    How was your session?
                  </p>
                  <p className="mt-1 text-xs text-fg-subtle">
                    Attended a mentorship session? Rate it below.
                  </p>
                  <div className="mt-3">
                    <StarSelector value={rating} onChange={setRating} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Your name"
                    htmlFor="fb-name"
                    required
                    error={errors.name}
                  >
                    <Input
                      id="fb-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      invalid={Boolean(errors.name)}
                    />
                  </Field>

                  <Field
                    label="Role"
                    hint="Optional"
                    htmlFor="fb-role"
                    error={errors.role}
                  >
                    <Input
                      id="fb-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Student, Developer…"
                      invalid={Boolean(errors.role)}
                    />
                  </Field>

                  <Field
                    label="Email"
                    htmlFor="fb-email"
                    required
                    hint="Not published"
                    error={errors.email}
                  >
                    <Input
                      id="fb-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      invalid={Boolean(errors.email)}
                    />
                  </Field>

                  <Field
                    label="Booking ID"
                    hint="Optional"
                    htmlFor="fb-ref"
                    error={errors.reference}
                  >
                    <Input
                      id="fb-ref"
                      value={reference}
                      onChange={(e) => setReference(e.target.value.toUpperCase())}
                      placeholder="CB-XXXXXX"
                      invalid={Boolean(errors.reference)}
                    />
                  </Field>
                </div>

                <Field
                  label="Feedback"
                  hint="Optional"
                  htmlFor="fb-comment"
                  error={errors.comment}
                >
                  <Textarea
                    id="fb-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What was most useful? What could be better?"
                    maxLength={feedbackSettings.maxCommentLength}
                    className="min-h-[100px]"
                    invalid={Boolean(errors.comment)}
                  />
                </Field>

                {formError && <Alert tone="danger">{formError}</Alert>}

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={!canSubmit || submitting}>
                    {submitting ? (
                      <>
                        <Spinner /> Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" strokeWidth={2} />
                        Submit Rating
                      </>
                    )}
                  </Button>

                  {rating === 0 && (
                    <span className="text-xs text-fg-subtle">
                      Select a star rating to continue
                    </span>
                  )}
                </div>

                <p className="border-t border-line pt-4 text-xs leading-relaxed text-fg-subtle">
                  Your email is used only to verify the rating and is never
                  published. Written feedback appears on this page only after
                  review.
                </p>
              </form>
            )}
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
