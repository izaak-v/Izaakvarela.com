import { NextResponse } from "next/server";
import { profile } from "@/content/profile";
import { buildQuoteEmail } from "@/lib/contact-email";
import { consentPageUrl, forwardToProducerOs, producerOsInboundUrl } from "@/lib/producer-os";
import { validateQuote } from "@/lib/quote";

/**
 * "Request Coverage" handler (server-only).
 *  1. Emails the request to izaak@izaakvarela.com via Resend (RESEND_API_KEY), Reply-To = visitor.
 *  2. If PRODUCEROS_INBOUND_URL is set, also creates the lead in ProducerOS through its inbound
 *     webhook. Neither secret ever reaches the browser.
 * Succeeds when at least one delivery path succeeds.
 */

const GENERIC_FAILURE = `Sorry, your request couldn't be sent right now. Please try again, or call or email ${profile.email} directly.`;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const crmUrl = producerOsInboundUrl();
  if (!apiKey && !crmUrl) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        error: `Too many requests in a short time. Please call or email ${profile.email} directly.`,
      },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const result = validateQuote(body);
  if (!result.ok)
    return NextResponse.json({ error: result.error, field: result.field }, { status: 400 });
  const d = result.data;
  const submittedAt = new Date();
  const pageUrl = consentPageUrl(body.pageUrl, host);

  const [emailed, forwarded] = await Promise.all([
    apiKey
      ? fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(buildQuoteEmail(d, submittedAt)),
          signal: AbortSignal.timeout(10000),
        })
          .then(async (res) => {
            if (!res.ok)
              throw new Error(`Resend ${res.status}: ${await res.text().catch(() => "")}`);
            return true;
          })
          .catch((err) => {
            console.error("Quote form: email failed", err);
            return false;
          })
      : Promise.resolve(false),
    crmUrl
      ? forwardToProducerOs(crmUrl, d, submittedAt, pageUrl)
          .then(() => true)
          .catch((err) => {
            console.error("Quote form: ProducerOS forward failed", err);
            return false;
          })
      : Promise.resolve(false),
  ]);

  if (!emailed && !forwarded) return NextResponse.json({ error: GENERIC_FAILURE }, { status: 502 });
  return NextResponse.json({ ok: true });
}
