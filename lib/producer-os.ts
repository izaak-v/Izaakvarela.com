import { QUOTE_CONSENT_TEXT, type QuotePayload } from "@/lib/quote";

/**
 * Optional: forward "Request Coverage" submissions to ProducerOS as a new lead, server-side only.
 *
 * Uses ProducerOS's existing inbound-lead webhook (Settings → Integrations → Inbound sources):
 * create a source there, then set its full webhook URL — which contains the secret token — as the
 * PRODUCEROS_INBOUND_URL environment variable in Vercel. It is never sent to the browser.
 * Unset = submissions are only emailed.
 */
export function producerOsInboundUrl(): string | null {
  const raw = process.env.PRODUCEROS_INBOUND_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    // Only accept an https ProducerOS inbound-lead endpoint.
    if (u.protocol !== "https:" || !/^\/api\/inbound-leads\/[^/]{20,100}$/.test(u.pathname))
      return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** Maps a submission onto ProducerOS's standard inbound field names. */
export function toInboundLead(d: QuotePayload, submittedAt: Date) {
  const notes = [
    d.coverageRange ? `Desired coverage: ${d.coverageRange}` : "",
    d.message ? `Notes from the form:\n${d.message}` : "",
    `Consent text: "${QUOTE_CONSENT_TEXT}"`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return {
    first_name: d.firstName,
    last_name: d.lastName,
    phone: d.phone,
    email: d.email,
    state: d.state,
    product_interest: d.interest || undefined,
    coverage_interest: d.coverageRange || undefined,
    preferred_contact_time: d.bestTime || undefined,
    lead_source: "izaakvarela.com",
    consent_timestamp: submittedAt.toISOString(),
    consent_source: "izaakvarela.com Request Coverage form (consent checkbox)",
    notes,
  };
}

export async function forwardToProducerOs(url: string, d: QuotePayload, submittedAt: Date) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toInboundLead(d, submittedAt)),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`ProducerOS inbound responded ${res.status}`);
}
