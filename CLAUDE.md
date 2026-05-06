## Team Brain
Read before starting any session:
1. C:\Users\fedor\Obsidian\Brain\00 - Team Brain\vault-cross-project-decisions.md
2. C:\Users\fedor\Obsidian\Brain\00 - Team Brain\vault-dev-log.md
3. C:\Users\fedor\Obsidian\Brain\00 - Team Brain\vault-project-status.md

## Brain
Vault: C:\Users\fedor\Obsidian\Brain\
Project vault folder: Projects\book-red-light\
Before any task: read the vault's book-red-light.md and any referenced docs
After any significant change: update book-red-light-dev-log.md with commit SHAs and a short summary
Never ask what we're working on — read the vault first

CRITICAL: After every single file change, update the Dev Log automatically. Do not wait to be asked. The vault must always reflect current state.

## Key Info
GitHub: https://github.com/FedorPortnoi/book-red-light
Production URL: https://book-red-light.pages.dev
Supabase project ref: hosqexsglgfvhjgwdpau

## Vault Files
Projects/book-red-light/book-red-light.md               ← start here always
Projects/book-red-light/book-red-light-architecture.md  ← component tree, data flow, guards
Projects/book-red-light/book-red-light-supabase-database.md ← schema, RLS, RPC functions
Projects/book-red-light/book-red-light-sql-migrations.md ← all 6 migrations with full SQL
Projects/book-red-light/book-red-light-react-components.md ← every component documented
Projects/book-red-light/book-red-light-known-issues.md  ← bugs and quirks
Projects/book-red-light/book-red-light-ops-runbook.md   ← reset user, rotate password, deploy
Projects/book-red-light/book-red-light-dev-log.md       ← changelog

## Current State
- Status: LIVE in production on Cloudflare Pages (auto-deploys from master)
- Stack: React 19 + Vite 8 + Tailwind CSS v4 + Supabase + EmailJS + Cloudflare Pages
- Auth model: username/password via Supabase Auth plus `public.profiles`; email confirmation disabled; admin approval is the access gate
- Booking model: 30-minute slots, all 7 days, 9:30am–8:30pm; partial unique index prevents double-booking
- Admin (Jen): sees a daily schedule on `/`; open slots are clickable and open BookingForm so she can book for herself; approvals happen at `/admin`
- Notifications: email to `jen60985@gmail.com` on new booking and new-account-pending-approval; no cancellation emails; no emails to bookers
- Env vars: Cloudflare Pages env-var injection doesn't work here — values are hardcoded as fallbacks in `src/utils/supabase.js` and `src/utils/email.js`

## Handoff Notes
- Jen is sole admin; Fedor was demoted (re-promote via SQL if needed — see vault ops runbook)
- Committed migrations live in `supabase/migrations/` and are applied manually via the Supabase SQL editor
- Two RPCs live in the Supabase project but are NOT in committed migrations: `get_email_by_username`, `is_admin`. See book-red-light-sql-migrations.md for reconstructed definitions.
