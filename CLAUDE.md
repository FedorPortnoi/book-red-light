## Team Brain
Read before starting any session:
1. C:\Users\fedor\Documents\Fedor's Brain\00 - Team Brain\AGENTS.md
2. C:\Users\fedor\Documents\Fedor's Brain\00 - Team Brain\Off-Repo Truth Handoff.md
Follow the shared workflow in AGENTS.md.

## Brain
Vault: C:\Users\fedor\Documents\Fedor's Brain\
Project vault folder: 04 - book-red-light\
Before any task: run /brain
After any significant change: run /log
Never ask what we're working on — read the vault first

## Key Info
Local path: C:\Users\fedor\book-red-light\
GitHub: https://github.com/FedorPortnoi/book-red-light

## Current State
- Stack: React 19 + Vite 8 + Tailwind CSS v4 + Supabase + EmailJS + Cloudflare Pages
- Runtime: local app at http://localhost:5173
- Auth model: username/password login backed by Supabase Auth plus `public.profiles`
- Approval model: admins approve users from `/admin`; only `is_admin = true` users can do that
- Booking model: 30-minute slots, Sunday through Friday, with account-linked session history on the home page
- Deletion model: users can self-delete their own account and related bookings via `delete_own_account()`
- Session hardening: deleted/broken sessions now auto-clear instead of leaving the app stuck on `Loading...`

## Current Handoff Notes
- Supabase email confirmation has been manually disabled in the live project
- Fedor is already promoted as the initial live admin
- Tracked SQL fixes added in this session:
  - `supabase/migrations/20260416_add_profiles_select_own.sql`
  - `supabase/migrations/20260416_add_delete_own_account.sql`
- See `README.md` for the current implementation snapshot
