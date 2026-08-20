import { profile } from "@/content/profile";

/**
 * The address and number are never present as a single contiguous string in
 * the served HTML. They are assembled at runtime from parts, which stops the
 * commodity scrapers without hiding anything from a person or a screen reader
 * (a <noscript> fallback carries a human-readable form).
 */
export function emailAddress(): string {
  return [profile.emailUser, profile.emailDomain].join("@");
}

export function mailtoHref(subject = "Security engagement enquiry"): string {
  return `mailto:${emailAddress()}?subject=${encodeURIComponent(subject)}`;
}

export function phoneDigits(): string {
  return `+${profile.phoneCC}${profile.phoneRest}`;
}

export function phoneDisplay(): string {
  const r = profile.phoneRest;
  return `+${profile.phoneCC} ${r.slice(0, 5)} ${r.slice(5)}`;
}

export function telHref(): string {
  return `tel:${phoneDigits()}`;
}

/** What <noscript> readers see: unambiguous, still not machine-harvestable. */
export const emailFallback = `${profile.emailUser} [at] ${profile.emailDomain.replace(".", " [dot] ")}`;
export const phoneFallback = `+${profile.phoneCC} — ${profile.phoneRest.slice(0, 5)} ${profile.phoneRest.slice(5)}`;
