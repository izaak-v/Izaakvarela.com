import { NextResponse } from "next/server";
import { profile } from "@/content/profile";
import { formatContactEmail, validateContact } from "@/lib/contact";

/**
 * Contact form handler. Sends the submission to your inbox via Resend (https://resend.com).
 * Nothing is stored in a database.
 *
 * Environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      required to enable the form
 *   CONTACT_TO_EMAIL    optional, defaults to profile.email
 *   CONTACT_FROM_EMAIL  optional, defaults to "Website Contact Form <onboarding@resend.dev>"
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 503 });
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

  const result = validateContact(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const d = result.data;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Website Contact Form <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      reply_to: d.email,
      subject: `Website inquiry from ${d.firstName} ${d.lastName}${d.topic ? ` — ${d.topic}` : ""}`,
      text: formatContactEmail(d),
    }),
  });

  if (!res.ok) {
    console.error("Contact form send failed", res.status, await res.text().catch(() => ""));
    return NextResponse.json(
      { error: `Sorry, your message could not be sent. Please email ${profile.email} directly.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
