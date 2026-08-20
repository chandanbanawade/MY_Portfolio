import { headers } from "next/headers";

/**
 * Renders a JSON-LD <script> tag.
 * The data always comes from our own config files via src/lib/schema.ts —
 * no user-supplied input is ever serialised here.
 *
 * Carries the per-request CSP nonce minted in src/middleware.ts, so this block
 * keeps working when the policy is switched from Report-Only to enforcing.
 */
export async function JsonLd({ data }: { data: object }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
