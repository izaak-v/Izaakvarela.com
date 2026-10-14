# izaakvarela.com

Personal one-page website for **Izaak Varela, Licensed Life Insurance Agent**.

Built with Next.js (App Router) + TypeScript. Fully static — no database, login, or form backend.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

- `app/site.ts` — name, title, email, and SEO description (edit here)
- `app/page.tsx` — landing page (hero, services, about, contact, licensing)
- `app/privacy/page.tsx`, `app/terms/page.tsx` — Privacy Policy and Terms of Use
- `app/globals.css` — styles (light/dark, responsive)

## Deploy

Import this repository in Vercel (framework preset: Next.js, default settings),
then add `izaakvarela.com` and `www.izaakvarela.com` under Project → Settings → Domains.
