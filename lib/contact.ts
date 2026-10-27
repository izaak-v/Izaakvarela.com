import { services } from "@/content/services";

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export const TOPICS = [
  ...services.map((s) => s.title),
  "Reviewing coverage I already have",
  "Something else",
];

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  topic: string;
  message: string;
};

const LIMITS: Record<keyof ContactPayload, number> = {
  firstName: 60,
  lastName: 60,
  email: 120,
  phone: 30,
  state: 40,
  topic: 80,
  message: 3000,
};

const MULTILINE: (keyof ContactPayload)[] = ["message"];

/** Strip control characters (and line breaks from single-line fields, so they can't alter email headers). */
export function cleanText(value: string, multiline = false): string {
  if (multiline) {
    return value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "");
  }
  return value.replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/\s{2,}/g, " ");
}

function clean(key: keyof ContactPayload, value: string): string {
  return cleanText(value, MULTILINE.includes(key));
}

/** Returns a cleaned payload, or an error message. Used on both client and server. */
export function validateContact(
  input: Record<string, unknown>,
): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  const data = {} as ContactPayload;
  for (const key of Object.keys(LIMITS) as (keyof ContactPayload)[]) {
    const raw = typeof input[key] === "string" ? clean(key, input[key] as string).trim() : "";
    if (raw.length > LIMITS[key]) return { ok: false, error: `${key} is too long.` };
    data[key] = raw;
  }
  if (!data.firstName || !data.lastName) return { ok: false, error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return { ok: false, error: "Please enter a valid email address." };
  if (data.phone && !/^[0-9()+\-.\s]{7,30}$/.test(data.phone))
    return { ok: false, error: "Please enter a valid phone number, or leave it blank." };
  if (data.state && !US_STATES.includes(data.state))
    return { ok: false, error: "Please choose a state." };
  if (data.topic && !TOPICS.includes(data.topic))
    return { ok: false, error: "Please choose a topic." };
  if (!data.message) return { ok: false, error: "Please include a short message." };
  return { ok: true, data };
}

export function contactSubject(d: ContactPayload): string {
  return `Website Inquiry — ${d.firstName} ${d.lastName}`;
}

export function formatContactEmail(d: ContactPayload): string {
  return [
    "New inquiry from izaakvarela.com",
    "",
    `First name:  ${d.firstName}`,
    `Last name:   ${d.lastName}`,
    `Email:       ${d.email}`,
    `Phone:       ${d.phone || "(not provided)"}`,
    `State:       ${d.state || "(not provided)"}`,
    `Topic:       ${d.topic || "(not selected)"}`,
    "",
    "Message:",
    d.message,
    "",
    "—",
    "Reply to this email to respond directly to the sender.",
  ].join("\n");
}
