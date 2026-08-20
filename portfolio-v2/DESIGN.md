# DESIGN

Personal site for Chandan Banawade — offensive security consultant, mentoring 1-to-1 in
security, AI/ML and data science. One page, one job: turn a 20-second skim into "this
person finds things other people miss — book time with them."

The order the page argues in: the record → who vouches for it → the findings themselves →
evidence of teaching → what you can be mentored in → how to book it. Proof comes before the
pitch, deliberately. Anyone can list mentorship topics; the 500+ disclosures and the
HackerOne rank are what make the topics worth paying for, so they are read first.

---

## Direction: A — "Report"

The page reads like a well-typeset penetration-test report that happens to be a website.
Warm paper-adjacent dark ground, hairline rules, generous margins, a real type scale, and
one signal colour that is spent almost nowhere.

The vernacular is the actual paperwork of the trade — Burp Repeater panes, CVSS vector
strings, severity chips, sanitised finding entries, a triage queue's filter controls. Used
structurally: the findings section *is* a list of report entries, not cards decorated to
look like one.

## Token system

### Colour

| Token | Hex | Role | Contrast on ground |
|---|---|---|---|
| `ground` | `#12110F` | page ground — warm near-black, never `#000` | — |
| `surface` | `#191713` | raised panes (hero Repeater, framework block) | — |
| `hairline` | `#2F2B24` | rules, chip borders, grid dividers | — |
| `hairline-strong` | `#443E34` | punctuation, disabled-weight metadata | — |
| `text` | `#EFE9DF` | body and headings — warm bone | 16.0:1 |
| `muted` | `#9C9285` | metadata, secondary copy | 6.2:1 |
| `signal` | `#FF6B3D` | **critical severity and the primary CTA only** | 7.0:1 |

**Why this accent.** Vermilion is the colour of a Critical chip and a Repeater highlight.
It is warm enough to belong to a paper-neutral ground rather than fighting it, and it
clears AA against the ground at 7.0:1 — which most saturated accents on dark grounds do
not.

**There is no second accent.** Severity is a ramp of the *same* hue at four strengths:
Critical fills, High is outline-and-text, Medium is bone, Low is muted. That is how a real
triage queue directs the eye — only the top of the queue is allowed to grab you. The Hall
of Fame's bounty/acknowledgement distinction, which would normally reach for a second
colour, is made with a dagger and a hairline underline instead.

Static appearances of the accent on the whole page: **9** — the hero CTA, the `#13` metric,
two Critical chips, three High chips, the "Most booked" session marker and that session's
button. Everything else it touches is a state (focus ring, copy confirmation, text
selection, the scroll-progress rule).

The two session uses are the accent doing its actual job. In a triage queue it marks the
one row you should look at first; on a pricing grid it marks the one session most people
should book. Same rule, same restraint — one thing at a time is allowed to be loud.

### Type

| Role | Face | Notes |
|---|---|---|
| Display | **Newsreader** | Variable serif. Headings, org wordmarks, large figures. |
| Body | **Instrument Sans** | 17px base. Not Inter. |
| Utility | **JetBrains Mono** | CVSS vectors, HTTP, timestamps, all metadata. |

All three are self-hosted through `next/font` — zero external font requests at runtime, which
the CSP would block anyway.

### Scale

Modular scale **1.25** from a 16px base: 16 · 20 · 25 · 31.25 · 39 · 48.8 · 61 · 76.3.
`--text-meta` at **14px** is the one deliberate off-scale value: it is the mobile floor, and
nothing on the page renders smaller. Spacing is Tailwind's default **4px** base.

Every colour, size and duration in the build comes from `src/app/globals.css`. There are no
literal hex values or magic pixel numbers in components.

## Signature element: the Repeater hero

Two panes. Left is a real `GET /.well-known/security-researcher HTTP/1.1` with the scope
declared in request headers. Right is a `200 OK` whose **response headers carry the
positioning** (`X-Role`, `X-Rank`) and whose JSON body is the contact card — disclosed
count, programs, HackerOne ranking with its quarter, NCIIPC acknowledgements, availability.

It encodes something true rather than decorating: the response headers in that pane are the
security headers this site actually serves. The hero is therefore also the evidence for the
claim the footer makes. A security person will read it, and it holds up when they do.

## The one risk

**A serif display face on an offensive-security portfolio.** Nobody in this field does this;
the reflex is a monospace or a squared-off techno sans. The argument is that the single
thing separating a researcher who gets hired from one who does not is whether their reports
get read — so the site is set like something worth reading. Newsreader carries the name, the
org wordmarks and the big figures; the mono is confined to evidence, where it belongs.

## What was rejected, and why

The whole Hollywood register went first: no katakana rain, no `#00FF41` on black, no
Orbitron, no hexagon mesh, no HUD brackets, no particle constellation, no glitch loop. Those
signal *films about hacking* to an audience that does the actual job. Skill bars with
percentages went next — "Python 85%" is a fabricated number in a portfolio whose entire
credibility rests on numbers being real, so capability depth is stated in words instead
("Primary / Regular / Supporting"). The contact form went too: it buys a visitor one saved
click in exchange for a server route, a third-party endpoint and a spam funnel, which is a
bad trade on a site whose selling point is that it survives being scanned by peers.

Three things died in the plan audit, before any code. The hero originally typed the response
body character by character — that is the banned `> Ethical Hacker_` typewriter wearing a
different costume, so it became a one-shot staggered line reveal that never loops. Lenis and
GSAP were both cut; a smooth-scroll library that fights native scroll on mobile and a second
animation engine used for nothing were bytes without an argument. And the accessory removed
at the end was the custom cursor — it lagged the frame budget on the pane hover, and the
spec's own instruction is that a cursor that lags a single frame should not exist.

**Motion was cut after measurement, not on principle.** The hero was built with
`motion/react` first. Measured on the real build it cost **38.5 KB gzipped** — a quarter of
the entire JS budget — to deliver a staggered fade and one opacity ramp, both of which CSS
does natively. First-load JS was 178.5 KB gzipped with it and 145.6 KB without, against a
150 KB ceiling. The library was the difference between passing and failing, for no motion
the page could not otherwise have. The CSS version is also strictly better in one respect:
it runs before hydration and without JavaScript at all.

## Motion

One orchestrated load sequence, ~1170ms total: nav → role → name → positioning → location →
CTAs → Repeater panes, then the response body's 20 lines at a faster 20ms cadence so the
whole thing lands inside budget. Every delay comes from the `SEQ` table at the top of
`src/components/hero.tsx` and reaches the DOM as one `--seq-delay` custom property, so the
timeline is a single object to edit rather than fifteen independent fades.

Everything below the fold is `IntersectionObserver`, fires once, at 15% visibility, ≤20px
translate, 520ms on `cubic-bezier(0.16, 1, 0.3, 1)`. No springs on text, no bounce, no
loops. Section rules draw left-to-right on entry. Count-up runs once on the four real
numbers.

`prefers-reduced-motion` is gated in two places and only two: the media query at the bottom
of `globals.css` — which zeroes animation *delays* as well as durations, or the first fold
would sit blank for a second before snapping in — and `useMotionConfig()` in
`src/lib/motion.ts` for the one JS-driven animation left, the count-up. Set it and the page
becomes static: figures render at their final values, nothing is missing, only the movement
is.

Ambient layer: one scanline at 2.5% opacity drifting 4px over 32 seconds. It does not show
up in a screenshot. It is the only ambient layer on the page.

## Mentorship, and the honesty label

The mentorship areas are ported from the booking platform, trimmed to two pillars:
security, and data science / AI-ML. Each area carries a `backing` field, and the UI renders
it: areas evidenced by the CV get a bordered **professional field** chip, the rest get
nothing and are described as guidance in the section's opening note.

That distinction is load-bearing, not decoration. Mentoring machine learning is a real,
useful offer; claiming to have been employed as an ML engineer is a different claim, and
the audience most likely to book — people who can already read a CV — is exactly the
audience that punishes blurring the two. The chip is typographic rather than a second
colour, for the same reason the bounty dagger is.

Sessions have no scheduler here. `profile.bookingBaseUrl` deep-links into the booking
platform when set; empty, the buttons fall through to the contact section. They are
deliberately **not** `mailto:` links — a mailto would put the address into the served HTML
as one contiguous string and undo the scraper obfuscation the contact section maintains.

## Known tradeoff: nonce CSP vs. static export

A strict `script-src` with no `unsafe-inline` needs a per-request nonce, and a nonce cannot
be minted at build time. So `/` is server-rendered on demand (no data fetching — it is
effectively static with a fresh nonce) rather than a pure `output: "export"` build. That is
a deliberate trade: this is a security researcher's own site, and shipping `unsafe-inline`
on it to save a server hop is the wrong call. `README.md` documents the static-export
variant if the deploy target requires one.
