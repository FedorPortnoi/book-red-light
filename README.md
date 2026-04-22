# book-red-light

Booking app for Red Light Studio (Jen's LLC). A React + Vite single-page app backed by Supabase Auth and PostgreSQL. Clients register with a username and password, wait for admin approval, then book 30-minute red-light-therapy sessions. Admin (Jen) sees a daily schedule, manages approvals, and books sessions for herself by clicking open slots.

## Status

- **Production:** https://book-red-light.pages.dev (auto-deploys from `master` via Cloudflare Pages)
- **Local dev:** `http://localhost:5173` after `npm run dev`
- **Supabase project ref:** `hosqexsglgfvhjgwdpau`
- **Repo:** https://github.com/FedorPortnoi/book-red-light (private)

## Features

- Username/password auth via Supabase Auth + `public.profiles` table (email is used under the hood; username is the UX layer)
- Registration approval workflow: `pending` → `approved` or `rejected`
- Admin panel (`/admin`): approve/reject/reset users
- Admin daily schedule view (landing page for admin at `/`): hour-by-hour list of booked vs open slots, click an open slot to book for yourself
- Booking: 30-minute slots, 9:30am–8:30pm, Sun–Fri (Saturday blocked)
- Slot conflict prevention: DB-level partial unique index + Supabase Realtime live updates
- Booking confirmation page with ICS calendar download
- Cancellation: self-serve via `/cancel`, enforced 2-hour cutoff (client-side)
- Account page: booking history + self-serve account deletion (cascades everything)
- Broken session recovery: deleted/stale auth sessions auto-clear; app never stalls on Loading…
- Email notifications to Jen on: (1) every new booking, (2) every new account pending approval. No cancellation emails, no emails to bookers.

## Routes

| Route | Purpose | Access |
|---|---|---|
| `/login` | Username/password login | Guest |
| `/register` | Registration | Guest |
| `/pending` | Pending/rejected holding state | Signed-in non-approved users |
| `/` | Booking UI (users) OR daily schedule (admin) | Approved users |
| `/account` | Booking history + account deletion | Approved users |
| `/confirmation` | Post-booking summary with ICS download | Approved users |
| `/cancel` | Cancel a booking | Approved users |
| `/admin` | Approve/reject/reset registrations | Admin only |

## Stack

- React 19
- Vite 8
- Tailwind CSS v4 (new `@theme` engine, no config file)
- React Router v7
- Supabase (Auth + Postgres + Realtime)
- EmailJS (delivery to Jen's Gmail via Outlook SMTP service)
- date-fns
- Cloudflare Pages

## Local development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
# produces dist/ and copies dist/index.html → dist/404.html for SPA routing
```

Preview built bundle:
```bash
npm run preview
```

## Environment variables

See `.env.example`. `.env.local` is gitignored.

**Important:** Cloudflare Pages env vars don't inject into the Vite bundle on this project, so all three env vars are also hardcoded in source as fallbacks:
- `src/utils/supabase.js` — Supabase URL + anon key
- `src/utils/email.js` — EmailJS public key + service ID + template ID + Jen's destination email

Local dev reads `.env.local` normally. Production uses the hardcoded fallbacks. To change any of these in production, edit source and push.

## Supabase notes

- Email confirmation must stay **disabled** in Supabase Auth settings — admin approval is the access gate instead.
- No automated migration tooling. Apply migrations manually via the SQL editor.
- Committed migrations live in `supabase/migrations/`. Two live-DB RPCs (`get_email_by_username`, `is_admin`) are not committed — if the project is ever restored from scratch, they need to be recreated.

## EmailJS notes

- Service ID: `service_uk0l7x9` (Outlook)
- Template ID: `template_sms_jen` (legacy name — used for plain email, not SMS)
- Destination: `jen60985@gmail.com`
- Template fields: Subject = `{{subject}}`, Body = `{{message}}`, To = `{{to_email}}`

## Deployment

Auto-deploys from `master` branch to Cloudflare Pages. No CI, no staging — every push to master is production. Build command: `npm run build`. Output dir: `dist`. Configured in `wrangler.jsonc`.

## Full documentation

Detailed docs (architecture, database schema, routes, components, integrations, runbook, known issues, decisions) live in the Obsidian vault at `C:\Users\fedor\Obsidian\Brain\Projects\book-red-light\`. Start with `Overview.md`.
