/**
 * SEED — syncs the config files into the database.
 * Safe to re-run: everything is upserted by slug, so bookings survive.
 *
 *   npm run db:seed
 *
 * NOTE: this seed creates NO testimonials. Reviews only ever come from real
 * submissions through the "Rate your session" form, and are published only
 * after approval in /admin/reviews.
 */

import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt as scryptCb } from "crypto";
import { promisify } from "util";

import { sessionTypes, freeConsultation } from "../src/config/sessions";
import { categories } from "../src/config/categories";
import { packages } from "../src/config/packages";
import { weeklyAvailability, blockedDates } from "../src/config/availability";

const prisma = new PrismaClient();
const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Removes rows whose slug has disappeared from the config files.
 * Rows still referenced by a booking are deactivated instead of deleted, so
 * historical bookings never lose the record they point at.
 */
async function pruneStale(
  label: string,
  find: () => Promise<{ id: string; slug: string; _count: { bookings: number } }[]>,
  remove: (id: string) => Promise<unknown>,
  deactivate: (id: string) => Promise<unknown>,
) {
  const stale = await find();
  if (stale.length === 0) return;

  let deleted = 0;
  let hidden = 0;

  for (const row of stale) {
    if (row._count.bookings > 0) {
      await deactivate(row.id);
      hidden++;
    } else {
      await remove(row.id);
      deleted++;
    }
  }

  console.log(
    `  ✓ pruned ${label}: ${deleted} removed` +
      (hidden > 0 ? `, ${hidden} kept but hidden (referenced by bookings)` : ""),
  );
}

async function main() {
  console.log("Seeding database…\n");

  // --- Session types --------------------------------------------------------
  for (const [index, s] of sessionTypes.entries()) {
    const data = {
      title: s.title,
      tagline: s.tagline,
      durationMin: s.durationMin,
      priceInr: s.priceInr,
      description: s.description,
      bullets: JSON.stringify(s.bullets),
      allowedProviders: JSON.stringify(s.allowedProviders),
      isFree: Boolean(s.isFree),
      popular: Boolean(s.popular),
      active: s.active !== false,
      sortOrder: index,
    };
    await prisma.sessionType.upsert({
      where: { slug: s.slug },
      create: { slug: s.slug, ...data },
      update: data,
    });
  }
  const freeCount = sessionTypes.filter((s) => s.isFree).length;
  console.log(
    `  ✓ ${sessionTypes.length} session types (${freeCount} free, ${sessionTypes.length - freeCount} paid)`,
  );

  await pruneStale(
    "session types",
    () =>
      prisma.sessionType.findMany({
        where: { slug: { notIn: sessionTypes.map((s) => s.slug) } },
        select: { id: true, slug: true, _count: { select: { bookings: true } } },
      }),
    (id) => prisma.sessionType.delete({ where: { id } }),
    (id) => prisma.sessionType.update({ where: { id }, data: { active: false } }),
  );

  // --- Mentorship categories ------------------------------------------------
  for (const [index, c] of categories.entries()) {
    const data = {
      title: c.title,
      description: c.description,
      icon: c.icon,
      group: c.group,
      backing: c.backing,
      topics: JSON.stringify(c.topics),
      active: c.active !== false,
      sortOrder: index,
    };
    await prisma.mentorshipCategory.upsert({
      where: { slug: c.slug },
      create: { slug: c.slug, ...data },
      update: data,
    });
  }
  const groupCount = new Set(categories.map((c) => c.group)).size;
  console.log(
    `  ✓ ${categories.length} mentorship categories across ${groupCount} areas`,
  );

  // Prune categories that no longer exist in config — otherwise renaming or
  // restructuring the list leaves orphans that still render on the site.
  // Anything referenced by a booking is deactivated rather than deleted, so
  // historical bookings keep their category.
  await pruneStale(
    "mentorship categories",
    () =>
      prisma.mentorshipCategory.findMany({
        where: { slug: { notIn: categories.map((c) => c.slug) } },
        select: { id: true, slug: true, _count: { select: { bookings: true } } },
      }),
    (id) => prisma.mentorshipCategory.delete({ where: { id } }),
    (id) => prisma.mentorshipCategory.update({ where: { id }, data: { active: false } }),
  );

  // --- Packages -------------------------------------------------------------
  for (const [index, p] of packages.entries()) {
    const data = {
      title: p.title,
      description: p.description,
      sessionCount: p.sessionCount,
      durationMin: p.durationMin,
      priceInr: p.priceInr,
      savingsNote: p.savingsNote ?? null,
      popular: Boolean(p.popular),
      active: p.active !== false,
      sortOrder: index,
    };
    await prisma.mentorshipPackage.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, ...data },
      update: data,
    });
  }
  console.log(`  ✓ ${packages.length} packages`);

  // Packages carry no bookings relation, so stale ones are simply removed.
  const stalePackages = await prisma.mentorshipPackage.deleteMany({
    where: { slug: { notIn: packages.map((p) => p.slug) } },
  });
  if (stalePackages.count > 0) {
    console.log(`  ✓ pruned packages: ${stalePackages.count} removed`);
  }

  // --- Availability ---------------------------------------------------------
  // Rules have no natural key, so replace them wholesale from config.
  await prisma.availabilityRule.deleteMany();
  const rules = Object.entries(weeklyAvailability).flatMap(([day, windows]) =>
    windows.map((w) => ({
      dayOfWeek: Number(day),
      startMinutes: timeToMinutes(w.start),
      endMinutes: timeToMinutes(w.end),
      active: true,
    })),
  );
  if (rules.length > 0) {
    await prisma.availabilityRule.createMany({ data: rules });
  }
  console.log(`  ✓ ${rules.length} availability windows`);

  for (const b of blockedDates) {
    await prisma.blockedDate.upsert({
      where: { date: b.date },
      create: { date: b.date, reason: b.reason },
      update: { reason: b.reason },
    });
  }
  if (blockedDates.length) console.log(`  ✓ ${blockedDates.length} blocked dates`);

  // --- Settings -------------------------------------------------------------
  await prisma.appSetting.upsert({
    where: { key: "free_consultation_enabled" },
    create: {
      key: "free_consultation_enabled",
      value: String(freeConsultation.enabled),
    },
    update: {},
  });
  console.log(
    `  ✓ free consultation ${freeConsultation.enabled ? "enabled" : "disabled"} (one per email)`,
  );

  // --- Reviews --------------------------------------------------------------
  // No testimonials are created. Any sample rows from an older seed are removed
  // so nothing fabricated can ever reach the live site.
  // Genuine submissions always carry an email address, so rows without one can
  // only be leftovers from the old placeholder seed.
  const removed = await prisma.review.deleteMany({ where: { email: null } });
  const realReviews = await prisma.review.count();
  if (removed.count > 0) {
    console.log(`  ✓ removed ${removed.count} legacy placeholder testimonials`);
  }
  console.log(`  ✓ ${realReviews} genuine reviews in database (none seeded)`);

  // --- Admin user -----------------------------------------------------------
  const email = process.env.ADMIN_EMAIL || "banawadechandan@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  await prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      name: "Chandan Banawade",
      passwordHash: await hashPassword(password),
    },
    update: {},
  });
  console.log(`  ✓ admin user: ${email}`);

  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      "\n  ⚠  ADMIN_PASSWORD was not set — the default password 'changeme123'\n" +
        "     was used. Set ADMIN_PASSWORD in .env and re-run before deploying.",
    );
  }

  console.log("\nDone.\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
