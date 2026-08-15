# Chandan Banawade — Portfolio & Mentorship Platform

A personal portfolio and 1-to-1 mentorship booking platform for **Chandan Banawade**,
Cyber Security Engineer and Security Consultant at Pinak Infosec (C9 Lab).

Visitors explore his expertise, pick a mentorship area, try a **free 15-minute
consultation**, choose a paid session, select how they want to meet, pick a slot
from real availability and book.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma · SQLite → PostgreSQL

---

## Quick start

```bash
npm install
cp .env.example .env      # then fill in the values
npm run setup             # prisma generate + db push + seed
npm run dev               # http://localhost:3000
```

Admin dashboard: <http://localhost:3000/admin> — sign in with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you set in `.env` before seeding.

---

## Data accuracy

Chandan's CV is the **only** source for personal and professional claims. Nothing
about his employers, experience, certifications, achievements, statistics or links
is invented anywhere in this project.

One distinction is deliberately preserved throughout the UI:

| | Meaning | Where it lives |
|---|---|---|
| **Verified background** | Documented on the CV — security work, achievements, certifications, projects | `experience.ts`, `expertise.ts`, `projects.ts`, `achievements.ts` |
| **Mentorship areas** | Subjects he offers guidance in — AI/ML, data science, programming, careers, interviews, projects | `categories.ts` |

Categories carry a `backing` field. Those marked `"professional"` render a
**Professional field** badge; the rest are shown to visitors as mentorship and
career guidance, not claims of industry employment. A note above the category
grid states this explicitly.

`socials.github`, `socials.hackerone` and every project's `github` / `demo` URL
are intentionally **blank** — the CV lists none, so inventing one would be a
fabricated claim. Fill in your real URLs and the buttons appear automatically.

---

## Where to edit content

Everything you'll want to change lives in `src/config/`. No component edits needed.

| File | Controls |
|---|---|
| `site.ts` | Name, identity, contact, socials, hero stats, nav, profile photos, SEO |
| `sessions.ts` | **Pricing, durations, free-consultation policy**, booking rules |
| `categories.ts` | 25 mentorship topics across 7 areas, and their `backing` |
| `meetings.ts` | Meeting methods offered (Google Meet, Zoom, Voice, WhatsApp) |
| `packages.ts` | Multi-session bundles |
| `expertise.ts` | Skill groups and badges |
| `experience.ts` | About text, experience timeline, education, certifications, speaking, mentoring philosophy |
| `achievements.ts` | Achievements and Hall of Fame recognition |
| `projects.ts` | Project cards |
| `faq.ts` | FAQ (also emitted as structured data) |
| `testimonials.ts` | Copy and rules for the "Rate your session" form |
| `availability.ts` | Weekly availability windows and blocked dates |

After editing, run `npm run db:seed` to sync into the database. The seed **prunes**
entries you delete from config — anything still referenced by a booking is
deactivated rather than removed, so history is never broken.

---

## Free consultation

A ₹0, 15-minute session, limited to **one per email address**.

- Defined in `sessions.ts` with `isFree: true`; policy lives in `freeConsultation`.
- Enforced by an **atomic conditional update** on `Customer.freeConsultationUsedAt`,
  so two simultaneous submissions from the same email cannot both succeed.
- The booking wizard also checks eligibility on email blur (`/api/free-eligibility`)
  so nobody fills in a whole form before being told. That check is a courtesy —
  the atomic one at booking time is the real guard.
- Free bookings **skip payment entirely** and are created as `confirmed`.
- Cancelling a free consultation **returns the claim** to that person.
- Toggle the whole offer on or off at `/admin/settings`. Disabling removes every
  reference across the site instantly. You can also grant an individual person a
  second one from there.

---

## Ratings, not fake testimonials

There are **no sample, placeholder or demo testimonials anywhere** in this project,
and the seed never creates any.

The homepage shows a real **"Rate your session"** form: a 1–5 star selector, name,
email (never published), optional booking ID and optional written feedback.

- Submissions are stored **unpublished** and appear publicly only after you approve
  them at `/admin/reviews`.
- If a valid booking ID is supplied, the rating is linked to that booking and shown
  in the dashboard with a **Verified attendee** badge.
- Until a genuine review is approved, visitors see the rating form alone — never an
  empty grid or invented quotes.

---

## Profile photography

Two files in `/public`, both EXIF-normalised (rotation baked in, metadata stripped)
so no browser can re-rotate them:

| File | Size | Used for |
|---|---|---|
| `chandan-avatar.jpg` | 800×800 | Circular avatar in the hero card |
| `chandan-portrait.jpg` | 1100×1954 | Full photo in the About section |

Both are served through `next/image`, so WebP/AVIF and responsive sizes are handled
automatically. Replace the files (or point `avatar` / `portrait` in `site.ts`
elsewhere); set either to `""` to fall back to the initials placeholder.

---

## Booking flow

Eight steps, then confirmation:

1. **Mentorship area** — 25 topics grouped into 7 areas
2. **Session** — free consultation or one of four paid tiers
3. **Meeting method** — Google Meet, Zoom, Voice Call or Phone/WhatsApp
4. **Date** — calendar showing only days with genuine availability
5. **Time** — slots that fit the chosen duration
6. **Details** — name, email, phone, LinkedIn, GitHub, topic, what you need help with, notes
7. **Review** — everything, with the total (or "Free")
8. **Payment** — skipped entirely for free consultations

The meeting method a visitor picks is validated server-side against the session's
`allowedProviders`; a disallowed combination is rejected with `PROVIDER_NOT_ALLOWED`.

---

## How double booking is prevented

Three independent layers:

1. The client is only ever shown slots computed server-side.
2. On submit, availability is **recomputed from the database** — the client's view
   is never trusted.
3. A unique index on `Booking.slotKey` (`"<date>#<startMinutes>"`) is the final
   backstop. If two requests race past step 2, the database rejects the loser and
   the API returns `409`, so the UI sends that person back to pick another time.
   Cancelling sets `slotKey` to `NULL`, freeing the slot for rebooking.

Unpaid bookings hold their slot for 30 minutes, then are swept and released, so
abandoned checkouts don't block the calendar.

---

## Payments

`src/lib/payments.ts` selects the provider automatically:

- **No Razorpay keys → mock mode.** A clearly-labelled test checkout. No money
  moves, no card details collected, and the UI says so on the payment step and in
  the admin dashboard.
- **Both keys set → live Razorpay.** Orders are created server-side and the
  checkout callback signature is verified with HMAC-SHA256 before a booking is
  confirmed, so a client can never mark its own booking as paid.

The secret key is only ever read inside server code (`import "server-only"`) and is
never sent to the browser.

---

## Meetings

`src/lib/meeting.ts` abstracts the provider — nothing else in the app knows which
one is in use. No API key is read in client code.

- `google_meet` / `zoom` — use a static room link if configured; otherwise the
  confirmation states the link will be emailed. A meeting URL is **never fabricated**.
  The Google Calendar and Zoom API integration points are marked in the file.
- `voice_call` — audio-only, camera-off instructions.
- `whatsapp` — `wa.me` link built from the mentor's own number.

---

## Time handling

Bookings are stored as an IST calendar date (`YYYY-MM-DD`) plus minutes from
midnight — never a raw timestamp. India has no DST, so a fixed +5:30 offset is
exact, and a 19:00 IST session stays 19:00 IST regardless of server locale.
See `src/lib/time.ts`.

---

## Environment variables

See `.env.example` for the annotated list.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | `file:./dev.db` locally, a Postgres URL in production |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO / OG tags — no trailing slash |
| `AUTH_SECRET` | Signs the admin session cookie. **Required in production.** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Read by the seed to create your admin login |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Set **both** to switch on live payments |
| `MEETING_STATIC_LINK` / `ZOOM_STATIC_LINK` | Optional permanent meeting rooms |
| `RESEND_API_KEY` / `MAIL_FROM` | Optional — enables real email delivery |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Admin dashboard

| Page | Does |
|---|---|
| Overview | Bookings, revenue, upcoming sessions, payment-mode warning |
| Bookings | Filter, confirm, complete, cancel (releases slot + notifies) |
| Sessions & Pricing | Edit price, duration, copy and meeting methods; free session locked at ₹0 |
| Categories | Show/hide any of the 25 mentorship topics |
| Free Consultation | Enable/disable, see who claimed, grant an extra one |
| Availability | Weekly windows, blocked dates, booking rules |
| Customers | Contact details and full booking history |
| Ratings | Approve, unpublish or delete real submitted ratings |
| Notifications | Every message generated, with delivery status |

---

## Switching to PostgreSQL

```bash
npm run use:postgres                       # rewrites the provider in schema.prisma
# set DATABASE_URL="postgresql://..." in .env
npx prisma migrate dev --name init
npm run db:seed
```

`npm run use:sqlite` switches back. Every model avoids native enums and scalar
arrays specifically so the schema is portable between the two.

---

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm start` | Serve the production build |
| `npm run setup` | generate + push schema + seed |
| `npm run db:seed` | Sync `src/config/*` into the database (prunes stale rows) |
| `npm run db:studio` | Prisma Studio — browse the data |
| `npm run db:reset` | **Wipes** and re-seeds the database |
| `npm run use:postgres` / `use:sqlite` | Switch database provider |

> On Windows, stop the dev server before `npm run build` — it locks Prisma's
> query-engine DLL and the build fails with `EPERM`.

---

## Before you launch

1. Set a strong `ADMIN_PASSWORD` and a real `AUTH_SECRET`, then re-run the seed.
2. Add your **GitHub / HackerOne URLs** in `site.ts` → `socials` (blank hides them).
3. Confirm the contact email — the CV says `banawadechandan@gmail.com`.
4. Add real **project GitHub / demo links** in `projects.ts` if you have them.
5. Switch on **Razorpay** — until then checkout is a labelled test flow.
6. Set `NEXT_PUBLIC_SITE_URL` to your domain.

---

## Project structure

```
prisma/
  schema.prisma        Database models
  seed.ts              Syncs config → database, prunes stale rows
scripts/
  switch-db.mjs        SQLite ↔ PostgreSQL provider switch
public/
  chandan-avatar.jpg   800×800 head-and-shoulders
  chandan-portrait.jpg 1100×1954 full portrait
src/
  app/
    page.tsx           Homepage
    book/              Booking wizard
    booking/[ref]/     Confirmation (noindex)
    admin/             Dashboard (login + guarded route group)
    api/               availability · slots · bookings · payments · reviews · free-eligibility
    sitemap.ts robots.ts opengraph-image.tsx
  components/
    ui/                Button, Card, Badge, Field, Alert, Icon, Reveal…
    site/              Navbar, Hero, About, Expertise, FreeConsultation,
                       Mentorship, Categories, Philosophy, Packages, Projects,
                       Experience, Achievements, Speaking, Feedback, FAQ…
    booking/           Wizard, Calendar, TimePicker
  config/              ← all editable content
  lib/
    slots.ts           Pure slot-availability engine
    bookings.ts        Booking service (double-booking + free-consultation rules)
    payments.ts        Razorpay / mock abstraction
    meeting.ts         Meet / Zoom / Voice / WhatsApp abstraction
    notify.ts          Email + notification log
    auth.ts            scrypt hashing + JWT session cookie
    time.ts            IST-safe date maths
```

---

## Extending it later

The architecture leaves room for these without restructuring:

- **More sessions** — append to `sessions.ts`; grid, wizard and admin all follow.
- **Coupons / referrals** — add a model and apply the discount in `createBooking`.
- **Subscriptions, group sessions, workshops** — new `SessionType` rows with a kind discriminator.
- **Multiple mentors** — add a `Mentor` model and a foreign key on `SessionType`, `AvailabilityRule` and `Booking`.
- **WhatsApp notifications** — add a transport in `notify.ts`; `NotificationLog.channel` already allows it.
- **Automated reminders** — `notifyReminder()` is written and ready; wire it to a cron job.
