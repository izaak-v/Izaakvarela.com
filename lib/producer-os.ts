import { profile } from "@/content/profile";
import { QUOTE_CONSENT_TEXT, SMS_CONSENT_TEXT, type QuotePayload } from "@/lib/quote";

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

/**
 * The page the form was submitted from, for the SMS consent record: the browser-reported URL when it
 * is on this site (query and hash dropped), otherwise the site's home page.
 */
export function consentPageUrl(raw: unknown, host: string | null): string {
  const fallback = `${profile.website}/`;
  if (typeof raw !== "string" || !host) return fallback;
  try {
    const u = new URL(raw);
    if (!/^https?:$/.test(u.protocol) || u.host !== host) return fallback;
    return `${u.origin}${u.pathname}`;
  } catch {
    return fallback;
  }
}

/**
 * Maps a submission onto ProducerOS's standard inbound field names.
 *
 * The sms_consent* fields are not standard ProducerOS inbound names: ProducerOS keeps them in the
 * lead's notes ("Additional fields") and its inbound request log. Mapping `sms_consent=smsPermission`
 * on the inbound source also sets the lead's SMS permission.
 */
export function toInboundLead(d: QuotePayload, submittedAt: Date, pageUrl = `${profile.website}/`) {
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
    sms_consent: d.smsConsent,
    sms_consent_timestamp: d.smsConsent ? submittedAt.toISOString() : undefined,
    sms_consent_source: pageUrl,
    sms_consent_text: SMS_CONSENT_TEXT,
    notes,
  };
}

export async function forwardToProducerOs(
  url: string,
  d: QuotePayload,
  submittedAt: Date,
  pageUrl?: string,
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toInboundLead(d, submittedAt, pageUrl)),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`ProducerOS inbound responded ${res.status}`);
}
