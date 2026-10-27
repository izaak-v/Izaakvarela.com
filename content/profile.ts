/**
 * Business identity and contact details.
 * This is the one place to update name, phone, email, NPN, booking link, photo, and social links.
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
   * Public phone — the only phone number shown anywhere on the site.
   * `null` = no phone shown.
   */
  phone: { display: "(928) 581-1704", tel: "+19285811704" } as {
    display: string;
    tel: string;
  } | null,

  website: "https://izaakvarela.com",

  /** Licensing footprint statement. Keep generic unless every state is confirmed. */
  serviceArea: "Serving clients across the U.S. where licensed",

  /** National Producer Number. Used for NIPR verification. */
  npn: "22276637",

  /** Official NIPR lookup page used by the "Verify My Credentials on NIPR" buttons. */
  niprLookupUrl: "https://nipr.com/licensing-center/look-up-a-national-producer-number",

  /**
   * Google Calendar appointment schedule — the booking page link from
   * Google Calendar → your appointment schedule → Share → "Booking page" link.
   * `null` = online booking hidden; visitors are pointed to phone/email instead.
   */
  bookingUrl: "https://calendar.app.google/aEjZtfNMAWdBLpKJA" as string | null,

  /**
   * Optional: inline embed of the same booking page on /schedule.
   * Google Calendar → appointment schedule → Share → "Website embed" → "Inline booking page",
   * then paste ONLY the iframe `src` URL here, e.g.
   * "https://calendar.google.com/calendar/appointments/schedules/AcZssZ...?gv=true"
   * `null` = /schedule shows the "Open Booking Page" button only (works on every device).
   */
  bookingEmbedUrl:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Xss6yM8JYxknHCLrczI9S6x4JeFk6Q1Gs96aUbUMGp_1rMO1r7h7ZdQfb69KDG6u_hjqJbmL9?gv=true" as
      string | null,

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
  smsEnabled: true,
};
