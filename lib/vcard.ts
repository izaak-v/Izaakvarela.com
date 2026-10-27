import { profile } from "@/content/profile";

/** Escape text for a vCard property value (RFC 6350 §3.4). */
function esc(v: string) {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/([,;])/g, "\\$1");
}

/** Public contact card for "Save Contact" — only the public business details. */
export function buildVCard(): string {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(last)};${esc(first)};;;`,
    `FN:${esc(profile.name)}`,
    `TITLE:${esc(profile.title)}`,
    `ORG:${esc(profile.legalName)}`,
    ...(profile.phone ? [`TEL;TYPE=WORK,VOICE:${profile.phone.tel}`] : []),
    `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
    `URL:${profile.website}`,
    `NOTE:${esc(`${profile.title} · NPN ${profile.npn}. Verify credentials at ${profile.website}/credentials`)}`,
    "END:VCARD",
  ];
  return lines.join("\r\n") + "\r\n";
}
