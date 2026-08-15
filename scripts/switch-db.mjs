/**
 * Switches the Prisma datasource between SQLite and PostgreSQL.
 *
 *   npm run use:postgres
 *   npm run use:sqlite
 *
 * Prisma cannot read the provider from an environment variable, so this
 * rewrites the single `provider` line in prisma/schema.prisma.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const target = process.argv[2];
if (!["sqlite", "postgresql"].includes(target)) {
  console.error("Usage: node scripts/switch-db.mjs <sqlite|postgresql>");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(here, "..", "prisma", "schema.prisma");

const schema = readFileSync(schemaPath, "utf8");
const updated = schema.replace(
  /(datasource db \{[\s\S]*?provider\s*=\s*)"[^"]+"/,
  `$1"${target}"`,
);

if (schema === updated) {
  console.log(`Already using ${target}. Nothing to do.`);
  process.exit(0);
}

writeFileSync(schemaPath, updated);
console.log(`Datasource provider set to "${target}".\n`);

if (target === "postgresql") {
  console.log("Next steps:");
  console.log('  1. Set DATABASE_URL="postgresql://user:pass@host:5432/db" in .env');
  console.log("  2. npx prisma migrate dev --name init");
  console.log("  3. npm run db:seed\n");
} else {
  console.log("Next steps:");
  console.log('  1. Set DATABASE_URL="file:./dev.db" in .env');
  console.log("  2. npm run setup\n");
}
