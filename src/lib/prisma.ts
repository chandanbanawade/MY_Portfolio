import { PrismaClient } from "@prisma/client";

/**
 * A single PrismaClient across hot reloads in development, otherwise Next's
 * dev server opens a new connection on every change until the pool is exhausted.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
