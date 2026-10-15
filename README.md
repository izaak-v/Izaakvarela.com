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

Without configuration, the form opens the visitor's email app with their message filled in.
To have it send directly to your inbox, create a free [Resend](https://resend.com) account and add
these environment variables in Vercel, then redeploy:

- `RESEND_API_KEY` (required)
- `CONTACT_TO_EMAIL` (optional; defaults to the email in `content/profile.ts`)
- `CONTACT_FROM_EMAIL` (optional; defaults to `onboarding@resend.dev`, which can only deliver to
  your Resend account's own email address. Verify your domain in Resend to use your own address.)

## Develop

```bash
npm install
npm run dev     # http://localhost:3000 (shows dev placeholders)
npm run check   # typecheck + lint + format check + production build
```

## Deploy

Vercel → Add New → Project → import this repo (framework preset: Next.js, default settings). Then add
`izaakvarela.com` and `www.izaakvarela.com` under Project → Settings → Domains.
