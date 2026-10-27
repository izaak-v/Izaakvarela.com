import { buildVCard } from "@/lib/vcard";

export const dynamic = "force-static";

/** Downloadable contact card (Add to Contacts). */
export function GET() {
  return new Response(buildVCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="izaak-varela.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
