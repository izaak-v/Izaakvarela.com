/**
 * Business identity and contact details.
 * This is the one place to update name, email, phone, booking link, photo, and social links.
 * Leave a value as `null` until you have the real thing — the site hides it publicly
 * (and shows a labeled placeholder only while running `npm run dev`).
 */

export type SocialLink = { label: string; href: string };

export const profile = {
  name: "Izaak Varela",
  title: "Licensed Life Insurance Agent",
  /** Legal business identity shown in the footer and structured data. */
  legalName: "Izaak Varela, Sole Proprietor",

  email: "izaak@izaakvarela.com",

  /**
   * Public business phone. `null` = not shown anywhere.
   * Example: { display: "(555) 555-0100", tel: "+15555550100" }
   */
  phone: null as { display: string; tel: string } | null,

  website: "https://izaakvarela.com",

  /** National Producer Number (from your license record). */
  npn: "22276637",

  /**
   * Google Calendar appointment schedule link, e.g.
   * "https://calendar.google.com/calendar/appointments/schedules/AcZssZ..."
   * `null` = online booking is hidden and visitors are pointed to email instead.
   */
  bookingUrl: null as string | null,

  /**
   * Professional headshot. Replace the file in /public/images (same name) or change `src`.
   * Set to `null` to fall back to a placeholder (dev) / monogram (production).
   */
  photo: {
    src: "/images/izaak-varela.jpg",
    width: 1000,
    height: 1061,
    alt: "Izaak Varela, licensed life insurance agent, smiling in a dark suit and tie",
  } as { src: string; width: number; height: number; alt: string } | null,

  /** Optional public profiles, e.g. { label: "LinkedIn", href: "https://linkedin.com/in/..." } */
  socialLinks: [] as SocialLink[],

  /**
   * SMS / text messaging. Keep `false` unless you actually text clients (e.g. via Twilio).
   * When `true`, the Privacy Policy adds a text-messaging section.
   */
  smsEnabled: false,
};
