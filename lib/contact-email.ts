import { profile } from "@/content/profile";
import { contactSubject, formatContactEmail, type ContactPayload } from "@/lib/contact";

/** Sender on the Resend-verified domain izaakvarela.com. */
export const CONTACT_FROM = "Izaak Varela Website <website@izaakvarela.com>";

/** Inbox that receives website inquiries. */
export const CONTACT_TO = profile.email;

/** Resend `POST /emails` payload for a validated contact-form submission. */
export function buildContactEmail(d: ContactPayload) {
  return {
    from: CONTACT_FROM,
    to: [CONTACT_TO],
    reply_to: d.email,
    subject: contactSubject(d),
    text: formatContactEmail(d),
  };
}
