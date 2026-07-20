/**
 * Renders schema.org structured data. The payload is built from the local
 * catalog, never from user input, so serialising it into the script tag is safe
 * once `<` is escaped to keep the tag from closing early.
 */
export const JsonLd = ({ data }: { data: Record<string, unknown>[] }) => (
  <script
    type="application/ld+json"
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data.length === 1 ? data[0] : data).replace(/</g, '\\u003c'),
    }}
  />
)
