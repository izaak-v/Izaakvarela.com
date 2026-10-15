import { NextResponse } from "next/server";
import { profile } from "@/content/profile";
import { contactSubject, formatContactEmail, validateContact } from "@/lib/contact";

/**
 * Contact form handler. Emails each submission to your inbox via Resend (https://resend.com).
 * Nothing is stored. Runs only on the server — RESEND_API_KEY never reaches the browser.
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      required to enable direct delivery
 *   CONTACT_TO_EMAIL    optional, defaults to profile.email (izaak@izaakvarela.com)
 *   CONTACT_FROM_EMAIL  optional, defaults to "Izaakvarela.com <onboarding@resend.dev>"
 */

const GENERIC_FAILURE = `Sorry, your message couldn't be sent right now. Please try again, or email ${profile.email} directly.`;

// Best-effort per-instance rate limit (serverless instances don't share memory).
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
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // Only accept submissions from this site's own pages.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: `Too many messages in a short time. Please email ${profile.email} directly.` },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const d = result.data;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Izaakvarela.com <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || profile.email],
        reply_to: d.email,
        subject: contactSubject(d),
        text: formatContactEmail(d),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error("Contact form: Resend responded", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ error: GENERIC_FAILURE }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact form: send failed", err);
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
