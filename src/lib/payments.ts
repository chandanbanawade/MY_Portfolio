/**
 * PAYMENT PROVIDER ABSTRACTION
 * -----------------------------------------------------------------------------
 * SAFETY NOTE: secrets are read from process.env inside server-only code. No
 * key is ever sent to the browser. The client receives only a public key id and
 * an order id — exactly what Razorpay's checkout script expects.
 *
 * MODES
 *   mock     (default) — a clearly-labelled test flow. No money moves. Used when
 *                        Razorpay keys are absent, so the whole booking journey
 *                        is testable end to end today.
 *   razorpay          — enabled automatically once RAZORPAY_KEY_ID and
 *                        RAZORPAY_KEY_SECRET are set in .env.
 *
 * The two paths are deliberately separated: `createMockOrder` can never run in
 * razorpay mode, and vice versa.
 */

import "server-only";
import { randomBytes } from "crypto";

export type PaymentProvider = "mock" | "razorpay";

export type CreateOrderInput = {
  amountInr: number;
  reference: string;
  customerName: string;
  customerEmail: string;
};

export type CreateOrderResult = {
  provider: PaymentProvider;
  orderId: string;
  amountInr: number;
  currency: "INR";
  /** Public key id — safe to expose. Null in mock mode. */
  publicKey: string | null;
};

/** Razorpay is live only when BOTH keys are present. */
export function getPaymentProvider(): PaymentProvider {
  return process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? "razorpay"
    : "mock";
}

export function isMockPayments(): boolean {
  return getPaymentProvider() === "mock";
}

// --- Mock ------------------------------------------------------------------

function createMockOrder(input: CreateOrderInput): CreateOrderResult {
  return {
    provider: "mock",
    orderId: `mock_order_${randomBytes(8).toString("hex")}`,
    amountInr: input.amountInr,
    currency: "INR",
    publicKey: null,
  };
}

// --- Razorpay --------------------------------------------------------------

async function createRazorpayOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const keyId = process.env.RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      // Razorpay works in the smallest currency unit — paise.
      amount: input.amountInr * 100,
      currency: "INR",
      receipt: input.reference,
      notes: {
        reference: input.reference,
        customer: input.customerName,
        email: input.customerEmail,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Razorpay order creation failed: ${response.status} ${detail}`);
  }

  const order = (await response.json()) as { id: string };

  return {
    provider: "razorpay",
    orderId: order.id,
    amountInr: input.amountInr,
    currency: "INR",
    publicKey: keyId, // public by design — pairs with the checkout script
  };
}

export async function createPaymentOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  return getPaymentProvider() === "razorpay"
    ? createRazorpayOrder(input)
    : createMockOrder(input);
}

/**
 * Verifies a Razorpay checkout callback signature.
 * HMAC-SHA256 of "<order_id>|<payment_id>" keyed with the secret.
 */
export async function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<boolean> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const { createHmac, timingSafeEqual } = await import("crypto");
  const expected = createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(params.signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Mock settlement — only ever reachable while Razorpay keys are absent. */
export function settleMockPayment(orderId: string) {
  if (!isMockPayments()) {
    throw new Error(
      "settleMockPayment called while Razorpay is configured — refusing.",
    );
  }
  return {
    transactionId: `mock_pay_${randomBytes(8).toString("hex")}`,
    orderId,
    status: "paid" as const,
  };
}
