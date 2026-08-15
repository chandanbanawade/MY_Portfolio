/**
 * Renders a JSON-LD <script> tag.
 * The data always comes from our own config files via src/lib/schema.ts —
 * no user-supplied input is ever serialised here.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
