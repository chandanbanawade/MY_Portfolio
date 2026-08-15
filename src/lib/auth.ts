/**
 * ADMIN AUTHENTICATION
 * -----------------------------------------------------------------------------
 * Single-admin session auth:
 *   · passwords hashed with scrypt (Node built-in — no native dependency)
 *   · session is a signed JWT in an httpOnly, SameSite=Lax, Secure cookie
 *   · comparisons are timing-safe
 *
 * The admin account is created by the seed from ADMIN_EMAIL / ADMIN_PASSWORD.
 * AUTH_SECRET signs the session cookie and must be set in production.
 */

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const SESSION_COOKIE = "cb_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET must be set to a random string of at least 32 characters in production.",
      );
    }
    // Development-only fallback so the app boots before .env is filled in.
    return new TextEncoder().encode("dev-only-insecure-secret-change-me-please");
  }
  return new TextEncoder().encode(secret);
}

// --- Password hashing -------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const derived = await scrypt(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(hashHex, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

// --- Sessions ---------------------------------------------------------------

export type AdminSession = { id: string; email: string; name: string };

export async function createSession(admin: AdminSession) {
  const token = await new SignJWT({ email: admin.email, name: admin.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? "Admin"),
    };
  } catch {
    return null;
  }
}

/** Server-component guard — redirects to the login page when signed out. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function authenticate(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin) {
    // Burn comparable time on a miss so the response doesn't reveal whether
    // the email exists.
    await scrypt(password, randomBytes(16), 64);
    return null;
  }

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return null;

  return { id: admin.id, email: admin.email, name: admin.name };
}
