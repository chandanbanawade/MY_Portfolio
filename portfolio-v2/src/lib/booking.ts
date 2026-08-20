import { profile } from "@/content/profile";
import type { Session } from "@/content/sessions";

export function formatInr(value: number): string {
  if (value === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${hours.toFixed(1)} hr`;
}

/**
 * Where a session's call to action goes.
 *
 * With `profile.bookingBaseUrl` set — point it at the booking platform — this
 * deep-links straight into the wizard. Without it the site has no scheduler,
 * so the button falls through to the contact section.
 *
 * Deliberately NOT a mailto: a mailto would put the address into the served
 * HTML as one contiguous string and undo the scraper obfuscation that the
 * contact section goes to some trouble to maintain.
 */
export function sessionHref(session: Session): string {
  if (profile.bookingBaseUrl) {
    return `${profile.bookingBaseUrl.replace(/\/$/, "")}?session=${session.slug}`;
  }
  return "#contact";
}
