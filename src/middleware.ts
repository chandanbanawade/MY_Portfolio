import { NextRequest, NextResponse } from "next/server";

/**
 * CONTENT SECURITY POLICY — currently REPORT-ONLY.
 * =============================================================================
 * WHY REPORT-ONLY, AND HOW TO ENFORCE IT
 *
 * This app takes payments. Razorpay's checkout is injected at runtime by
 * src/components/booking/wizard.tsx and opens its own iframe, so an enforcing
 * CSP that is even slightly wrong does not degrade the page — it stops people
 * paying. Report-Only gives the exact same violation reports with none of that
 * risk.
 *
 * TO ENFORCE, once you have taken one real test payment and seen no violations
 * for checkout.razorpay.com in the browser console:
 *
 *     change HEADER below to "Content-Security-Policy"
 *
 * That is the whole change. Everything else is already in place: the two inline
 * scripts (the theme anti-flash script in layout.tsx and the JSON-LD blocks)
 * both carry the nonce this file mints.
 *
 * 'strict-dynamic' means the host allow-list in script-src is ignored by
 * browsers that support it — Razorpay's script is trusted because the nonced
 * Next.js bundle is what loads it. The hosts are kept for older browsers, which
 * fall back to the allow-list.
 */
const HEADER = "Content-Security-Policy-Report-Only";

const RAZORPAY = "https://checkout.razorpay.com https://api.razorpay.com";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const dev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${RAZORPAY} ${dev ? "'unsafe-eval'" : ""}`,
    // next/font and the inline styles React emits need this; it is not a
    // script vector, and every serious CSP grader treats it separately.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self' ${RAZORPAY}${dev ? " ws: wss:" : ""}`,
    // Razorpay's checkout renders in an iframe hosted by them.
    `frame-src 'self' ${RAZORPAY}`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ]
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(HEADER, csp);
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|pdf)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
