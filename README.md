# book-red-light

Booking app for Red Light Studio. This is a React + Vite single-page app backed by Supabase Auth and PostgreSQL. Users register with a username and password, wait for admin approval, then book 30-minute sessions. The app also supports cancellation, account-based booking history, and self-service account deletion.

## Current Status
- Local app URL: `http://localhost:5173`
- Repo: https://github.com/FedorPortnoi/book-red-light
- Supabase project ref: `hosqexsglgfvhjgwdpau`
- Current local state: working and handoff-ready
- Deployment state: not yet deployed

## Features
- Username/password auth backed by Supabase Auth
- Profile approval workflow with `pending`, `approved`, and `rejected` states
- Admin panel for approving or rejecting registrations
- Booking flow with 30-minute slots, Sunday through Friday
- Full slot labels such as `11:30am - 12:00pm`
- `Your Sessions` view on the home page so users can find upcoming and past bookings
- Booking confirmation page with ICS download
- Cancellation flow with a 2-hour cutoff
- Self-service account deletion that removes the auth account, profile, and booking history
- Broken-session recovery for deleted users so the SPA does not get stuck on `Loading...`

## Tech Stack
- React 19
- Vite 8
- Tailwind CSS v4
- React Router v7
- Supabase
- date-fns
- EmailJS
- Cloudflare Pages

## Routes
| Route | Purpose | Access |
|---|---|---|
| `/login` | Username/password login | Guest |
| `/register` | Registration | Guest |
| `/pending` | Pending/rejected holding state | Signed-in non-approved users |
| `/admin` | Approve/reject/reset users | Admin only |
| `/` | Booking UI + session history + account deletion | Approved users |
| `/confirmation` | Booking summary | Approved users |
| `/cancel` | Cancel a booking | Approved users |

## Environment Variables
Create `.env.local` with:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_CONFIRMATION_TEMPLATE=template_confirmation
```

## Local Development
```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Supabase Operational Notes
- Supabase email confirmation must stay disabled for this workflow
- Admin approval is the business gate instead
- The initial live admin was bootstrapped by updating the relevant `profiles` row in SQL

Tracked SQL artifacts added during the current session:
- `supabase/migrations/20260416_add_profiles_select_own.sql`
- `supabase/migrations/20260416_add_delete_own_account.sql`

## Remaining Work
- Configure EmailJS template `template_confirmation`
- Run one clean booking plus cancellation smoke test after EmailJS is configured
- Deploy to Cloudflare Pages
- Add richer admin management and schedule controls if needed

## Recent Session Commits
- `f61f1e6` `fix: recover from broken auth sessions`
- `b4d6d40` `feat: add self-service account deletion`
- `68d1f63` `feat: improve booking session visibility`
- `fbb63cb` `feat: add Supabase backend + full auth system`
