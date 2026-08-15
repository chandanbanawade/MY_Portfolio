/**
 * FEEDBACK & TESTIMONIALS
 * =============================================================================
 * There are NO sample, placeholder or demo testimonials in this project.
 *
 * The homepage shows a real "Rate Your Session" feedback form. Ratings submitted
 * there are stored unpublished and appear on the site only after you approve
 * them in /admin/reviews. Until a genuine review is approved, visitors see the
 * feedback form alone — never an empty or fabricated review grid.
 */

export const feedbackSettings = {
  eyebrow: "Feedback",
  title: "Rate your session",
  description:
    "Completed a mentorship session? Your rating helps me improve, and helps the next person decide.",
  /**
   * Submitted ratings stay hidden until approved in the admin dashboard.
   * Set to false to publish them immediately (not recommended).
   */
  requireApproval: true,
  /** Minimum characters for the optional comment, when one is given. */
  minCommentLength: 10,
  maxCommentLength: 600,
  successTitle: "Thanks for the feedback",
  successMessage:
    "Your rating has been recorded. If you left a comment, it may appear on this page once reviewed.",
} as const;
