import { NextRequest, NextResponse } from "next/server";

/**
 * Per-request nonce + strict CSP.
 *
 * This is the one reason the app is not a pure `output: "export"` build: a
 * nonce cannot be minted at build time, and a CSP with `unsafe-inline` in
 * script-src is not a CSP this particular site can ship. See README for the
 * static-export variant if you need one.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const dev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' lets Next's nonced bootstrap load its own chunks and
    // nothing else. 'unsafe-eval' is dev-only, for the HMR runtime.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${dev ? "'unsafe-eval'" : ""}`,
    // Inline styles are unavoidable with next/font and are not a script vector.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `manifest-src 'self'`,
    `upgrade-insecure-requests`,
  ]
    .filter(Boolean)
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|pdf)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
