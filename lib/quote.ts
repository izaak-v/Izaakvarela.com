import { US_STATES, cleanText } from "@/lib/contact";

/** "Request Coverage" form — shared by the browser form and the /api/quote handler. */

export const QUOTE_INTERESTS = [
  "Life Insurance",
  "Final Expense",
  "Mortgage Protection",
  "Family Protection",
  "Living Benefits",
  "Term Life",
  "Whole Life / Permanent Coverage",
  "Not Sure",
] as const;

export type QuoteInterest = (typeof QUOTE_INTERESTS)[number];

/**
 * Window event a coverage CTA fires to preselect "What are you looking for?" before jumping to the
 * form. The value travels in the event, never in the URL.
 */
export const QUOTE_INTEREST_EVENT = "quote:interest";

export const COVERAGE_RANGES = [
  "Under $25,000",
  "$25,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "$500,000+",
  "Not sure yet",
] as const;

export const CONTACT_TIMES = ["Morning", "Afternoon", "Evening", "Any time"] as const;

/**
 * Shown next to the required consent checkbox, and recorded with each submission. Covers calls and
 * email only: texting has its own optional checkbox (SMS_CONSENT_TEXT), as A2P 10DLC requires.
 */
export const QUOTE_CONSENT_TEXT =
  "I agree that Izaak Varela, a licensed life insurance agent, may contact me about my insurance inquiry by phone call and email at the number and email I provided. Consent is not a condition of purchase.";

/**
 * Optional SMS opt-in (A2P 10DLC). Shown verbatim next to its own unchecked checkbox, followed by
 * links to /privacy and /terms, and recorded with the submission. Never required to submit.
 */
export const SMS_CONSENT_TEXT =
  "I agree to receive recurring text messages from Izaak Varela regarding my life insurance inquiry, coverage options, appointment scheduling and reminders, and follow-up. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase.";

/** Same rule as ProducerOS: 10 digits (optional leading 1); area code and exchange can't start with 0 or 1. */
export function isUsPhone(input: string): boolean {
  if (!/^[0-9()+\-.\s]{10,30}$/.test(input)) return false;
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 && !/^[01]/.test(digits) && !/^[01]/.test(digits.slice(3));
}

export type QuotePayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  state: string;
  interest: string;
  coverageRange: string;
  bestTime: string;
  message: string;
  consent: boolean;
  /** Optional SMS opt-in; false unless the visitor checked the SMS box. */
  smsConsent: boolean;
};

const LIMITS = {
  firstName: 60,
  lastName: 60,
  phone: 30,
  email: 120,
  state: 40,
  interest: 40,
  coverageRange: 40,
  bestTime: 20,
  message: 2000,
} as const;

type TextKey = keyof typeof LIMITS;

export function validateQuote(
  input: Record<string, unknown>,
): { ok: true; data: QuotePayload } | { ok: false; error: string; field?: string } {
  const d = { consent: false, smsConsent: false } as QuotePayload;
  for (const key of Object.keys(LIMITS) as TextKey[]) {
    const raw =
      typeof input[key] === "string"
        ? cleanText(input[key] as string, key === "message").trim()
        : "";
    if (raw.length > LIMITS[key])
      return { ok: false, error: "One of the fields is too long.", field: key };
    d[key] = raw;
  }
  d.consent = input.consent === true || input.consent === "on" || input.consent === "true";
  d.smsConsent =
    input.smsConsent === true || input.smsConsent === "on" || input.smsConsent === "true";

  if (!d.firstName)
    return { ok: false, error: "Please enter your first name.", field: "firstName" };
  if (!d.lastName) return { ok: false, error: "Please enter your last name.", field: "lastName" };
  if (!isUsPhone(d.phone))
    return { ok: false, error: "Please enter a valid 10-digit U.S. phone number.", field: "phone" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    return { ok: false, error: "Please enter a valid email address.", field: "email" };
  if (!US_STATES.includes(d.state))
    return { ok: false, error: "Please choose your state.", field: "state" };
  if (d.interest && !(QUOTE_INTERESTS as readonly string[]).includes(d.interest))
    return { ok: false, error: "Please choose what you're looking for.", field: "interest" };
  if (d.coverageRange && !(COVERAGE_RANGES as readonly string[]).includes(d.coverageRange))
    return { ok: false, error: "Please choose a coverage range.", field: "coverageRange" };
  if (d.bestTime && !(CONTACT_TIMES as readonly string[]).includes(d.bestTime))
    return { ok: false, error: "Please choose a contact time.", field: "bestTime" };
  if (!d.consent)
    return {
      ok: false,
      error: "Please check the box so I can contact you about your request.",
      field: "consent",
    };
  return { ok: true, data: d };
}

export function quoteSubject(d: QuotePayload): string {
  return `Coverage Request — ${d.firstName} ${d.lastName}${d.interest ? ` (${d.interest})` : ""}`;
}

export function formatQuoteEmail(d: QuotePayload, submittedAt: Date): string {
  return [
    "New coverage request from izaakvarela.com",
    "",
    `First name:     ${d.firstName}`,
    `Last name:      ${d.lastName}`,
    `Phone:          ${d.phone}`,
    `Email:          ${d.email}`,
    `State:          ${d.state}`,
    `Looking for:    ${d.interest || "(not selected)"}`,
    `Coverage range: ${d.coverageRange || "(not selected)"}`,
    `Best time:      ${d.bestTime || "(not selected)"}`,
    "",
    "Notes:",
    d.message || "(none)",
    "",
    "Consent:",
    `Checked at ${submittedAt.toISOString()} — "${QUOTE_CONSENT_TEXT}"`,
    "",
    "SMS consent (optional):",
    d.smsConsent
      ? `Yes — checked at ${submittedAt.toISOString()} — "${SMS_CONSENT_TEXT}"`
      : "No — the text message box was not checked.",
    "",
    "—",
    "Reply to this email to respond directly to the sender.",
  ].join("\n");
}
