# chandanbanawade.com

Single-page portfolio for an offensive security consultant. Next.js 15 (App Router),
React 19, TypeScript strict, Tailwind v4 (CSS-first `@theme`). No animation library —
see `DESIGN.md` for why Motion was measured and then cut. Runtime dependencies are
`next`, `react`, `react-dom` and nothing else.

Design rationale — direction, tokens, the signature element, what was rejected — is in
[`DESIGN.md`](./DESIGN.md).

```bash
npm install
npm run dev      # http://localhost:3100
npm run build
npm run start    # production, also :3100
```

`pnpm install && pnpm dev` works identically if you have pnpm; this was built with npm
because pnpm was not installed on the authoring machine. Port 3100 is used so it can run
beside the booking platform in the parent directory, which owns 3000.

---

## Editing content

**All copy and data live in `src/content/*.ts` as typed exports. Nothing is hardcoded in
JSX.** Editing one array updates the page. TypeScript will tell you if a field is missing.

| File | What it holds |
|---|---|
| `profile.ts` | Name, positioning line, role, location, contact parts, CV path, site URL, LinkedIn activity link, `bookingBaseUrl`, availability list |
| `mentorship.ts` | The three pillars and their areas, each with a `backing` flag driving the "professional field" chip |
| `sessions.ts` | Free consultation + the four paid sessions: duration, price, bullets, meeting providers |
| `metrics.ts` | The four proof-strip numbers and their provenance strings |
| `exchange.ts` | The hero's HTTP request/response — **see the warning below** |
| `hall-of-fame.ts` | Recognised organisations; `bounty: true` gets the dagger treatment |
| `findings.ts` | The finding entries: class, severity, CVSS + vector, target sector, impact, method |
| `capabilities.ts` | The surface/depth matrix and the tooling & framework lists |
| `experience.ts` | Roles, max three bullets each |
| `project.ts` | The recon framework block |
| `talks.ts` | Speaking venues |
| `credentials.ts` | Certifications, membership, education |
| `nav.ts` | Section navigation |

### Adding a finding

Append to the array in `src/content/findings.ts`. The filter and sort controls pick up new
entries and new vulnerability classes automatically — `vulnClasses` is derived from the
data. Keep to the house rules:

- **Impact first.** "An authenticated user could read arbitrary tenant records," not
  "found an IDOR."
- **Sector, not client**, unless the disclosure is genuinely public.
- **CVSS vector must match the score.** This audience reads them.
- `disclosure` stays `null` unless you have a real, verifiable URL. Every entry currently
  ships `null` on purpose.

### Editing the hero exchange

`src/content/exchange.ts` must stay valid HTTP. The response headers there are meant to
mirror the headers the site actually sends (`next.config.ts` + `src/middleware.ts`) — if you
change the real headers, change these too, or the hero stops being true.

## Where the tokens live

`src/app/globals.css`, in the `@theme` block. Colours, the type scale, fonts and the easing
curve are all CSS custom properties; Tailwind generates utilities from them
(`text-signal`, `border-hairline`, `text-2xl`, `font-display`…). Change a value there and it
propagates everywhere. Components contain no literal hex values.

The page-load timeline is the `SEQ` table at the top of `src/components/hero.tsx`; each
value becomes a `--seq-delay` custom property on one element. Keep the last line's delay
plus 300ms under 1200ms.

Reduced motion is gated in exactly two places: the media query at the bottom of
`globals.css` (it zeroes animation delays as well as durations — remove that and the first
fold sits blank before snapping in), and `useMotionConfig()` in `src/lib/motion.ts`, which
covers the one JS-driven animation, the count-up.

### Wiring up booking

Session buttons resolve through `sessionHref()` in `src/lib/booking.ts`:

- **`profile.bookingBaseUrl` set** (e.g. `https://your-booking-app/book`) → each button
  deep-links as `?session=<slug>`. The slugs match the booking platform's
  `src/config/sessions.ts`, so they line up out of the box.
- **left empty** (the default) → buttons scroll to the contact section.

Prices live in `src/content/sessions.ts` only. If you also run the booking platform, keep
the two files in step — they are separate apps and nothing syncs them automatically.

### Adding or removing a mentorship area

Append to `mentorshipAreas` in `src/content/mentorship.ts` with a `pillar` and a `backing`.
Set `backing: "professional"` **only** where the CV evidences it — that flag is what prints
the "professional field" chip, and the section's opening note promises the reader it means
something. To add a pillar, add it to `pillars`; the grid picks it up.

## Before you deploy — three things to change

1. **`profile.siteUrl`** in `src/content/profile.ts` is `https://chandanbanawade.com`.
   Set it to the real domain; it feeds canonical URLs, `sitemap.xml`, `robots.txt`,
   the OG card and the JSON-LD.
2. **`public/chandan-banawade-cv.pdf`** is a generated placeholder that says so on the
   page. Replace it with the real CV — the hero's secondary CTA links straight to it.
3. **`public/.well-known/security.txt`** has an `Expires` of 2027-01-01 and the canonical
   URL hardcoded. Update both for the real domain.

## Deploying

### Vercel (no configuration needed)

Push and import. `/` is server-rendered on demand so that `src/middleware.ts` can mint a
per-request CSP nonce; there is no data fetching, so it behaves like a static page with a
fresh nonce.

### Cloudflare Pages

Use `@cloudflare/next-on-pages`, which supports middleware. Alternatively, take the static
route below.

### Static export, if you need one

Delete `src/middleware.ts`, add `output: "export"` to `next.config.ts`, and move the CSP
into the `headers()` block in `next.config.ts` with `script-src 'self' 'unsafe-inline'`.
Understand the trade before you do it: Next's App Router emits inline hydration scripts, so
without a nonce there is no strict `script-src`. `DESIGN.md` explains why the nonce won.

## Security posture

This is a portfolio item, not a footnote — the site will be scanned by peers.

- **CSP with a per-request nonce** and `strict-dynamic`, no `unsafe-inline` in `script-src`
  (`src/middleware.ts`). `style-src` keeps `unsafe-inline` because `next/font` needs it and
  it is not a script vector.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, HSTS with
  preload, `Cross-Origin-Opener-Policy` (`next.config.ts`).
- **No server-side form handling, no database, no auth, no third-party scripts.** The
  contact section is email and phone only, deliberately.
- **Email and phone are assembled after hydration** from parts in `src/lib/contact.ts`, so
  neither appears as a contiguous string in the served HTML. A `<noscript>` block carries a
  human-readable fallback. Verify with:
  `curl -s https://your-domain/ | grep -c 'banawadechandan@'` → expect `0`.
- `/.well-known/security.txt` per RFC 9116.

Expect an A+ on securityheaders.com once HSTS is served over real TLS.

## Accessibility & performance notes

- One `h1`, ordered headings, landmark elements, `<time datetime>` on every date.
- Skip-to-content link; focus rings are designed (2px signal, 3px offset), never removed.
- Filter controls expose `aria-pressed`; result counts announce through a polite live
  region; the copy button confirms in a live region as well as visually.
- All text meets WCAG AA against the ground — see the contrast column in `DESIGN.md`.
- Client JS is confined to the four pieces that need it: nav scroll state, findings filter,
  copy buttons, count-up. The hero, the reveals and the rules are pure CSS and run before
  hydration. Measured first load: **145.6 kB gzipped** including the legacy polyfill chunk,
  **106.9 kB** without it on modern browsers. CSS is 6.6 kB gzipped.

## Fonts in the OG card

`src/assets/fonts/*.ttf` are static instances of Newsreader and JetBrains Mono, vendored so
`src/app/opengraph-image.tsx` builds offline — Satori needs TTF/OTF and cannot use the woff2
that `next/font` downloads. Both are SIL Open Font License; `OFL.txt` sits beside them.
