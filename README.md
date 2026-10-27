# izaakvarela.com

Website for **Izaak Varela, Licensed Life Insurance Agent** (Izaak Varela, Sole Proprietor).
Next.js (App Router) + TypeScript. No database and no login.

## Edit your information — `content/`

| What                                                                        | File                             |
| --------------------------------------------------------------------------- | -------------------------------- |
| Name, title, email, phone, NPN, booking link, photo, social links, SMS flag | `content/profile.ts`             |
| State licenses (one entry per state)                                        | `content/licenses.ts`            |
| Testimonials (only `approved: true` ever show publicly)                     | `content/testimonials.ts`        |
| Service cards                                                               | `content/services.ts`            |
| FAQ                                                                         | `content/faqs.ts`                |
| Headshot                                                                    | `public/images/izaak-varela.jpg` |

- **Credentials:** verification is NIPR-first, using `npn` and `niprLookupUrl` in
  `content/profile.ts`. State license cards are optional — add an entry to `content/licenses.ts`
  only for a state you've confirmed from your official license record.
- **Booking:** `bookingUrl` is your Google Calendar appointment booking page link; every
  "Schedule" button leads to `/schedule`, which opens it. To also show the calendar inline, paste
  the iframe `src` from Google Calendar → appointment schedule → Share → Website embed → Inline
  into `bookingEmbedUrl`.
- **Phone:** `phone: { display: "(928) 581-1704", tel: "+19285811704" }` in `content/profile.ts`
  — the only phone number used anywhere on the site.

Values left as `null` are hidden on the live site. While running `npm run dev`, a clearly labeled
placeholder appears in their place instead. Placeholders never appear in a production build.

## Contact form

Submissions are emailed to `izaak@izaakvarela.com` through [Resend](https://resend.com) — subject
`Website Inquiry — First Last`, all fields in the body, and the visitor's address as Reply-To.
Nothing is stored. Until it's configured, the form keeps the visitor's message and offers an
"Open in my email app" button pre-filled with it.

Emails are sent from `Izaak Varela Website <website@izaakvarela.com>` (the Resend-verified
domain) to `izaak@izaakvarela.com`, with the visitor's address as Reply-To — see
`lib/contact-email.ts`.

The only setting needed in Vercel → Project → Settings → Environment Variables (Production) is
`RESEND_API_KEY` — server-only; never sent to the browser.

## Request Coverage form

The homepage form (`/api/quote`) emails each request to `izaak@izaakvarela.com` via Resend (same
verified sender and Reply-To as the contact form) and records the visitor's consent text and time.

Optional — also create the lead in ProducerOS: in ProducerOS, add an **Inbound source** (Settings →
Integrations), copy its webhook URL (`https://…/api/inbound-leads/pos_in_…`), and set it in Vercel as
`PRODUCEROS_INBOUND_URL`. It is used only on the server. Without it, requests are emailed only.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000 (shows dev placeholders)
npm run check     # typecheck + lint + format check + production build
npm run test:e2e  # browser tests: mobile menu, contact form, content guards (iPhone/iPad/desktop)
```

## Deploy

Vercel → Add New → Project → import this repo (framework preset: Next.js, default settings). Then add
`izaakvarela.com` and `www.izaakvarela.com` under Project → Settings → Domains.
