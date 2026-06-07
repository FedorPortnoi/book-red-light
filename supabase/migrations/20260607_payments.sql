-- payments table: tracks monthly payment due dates per client
create table if not exists public.payments (
  id        uuid        primary key default gen_random_uuid(),
  user_id   uuid        not null references public.profiles(id) on delete cascade,
  due_date  date        not null,
  paid_at   timestamptz,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.payments enable row level security;

-- Clients can read their own payment records
create policy "payments_select_own"
  on public.payments for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can read all payment records
create policy "payments_admin_select"
  on public.payments for select
  to authenticated
  using (public.is_admin());

-- Admins can mark payments as paid (update paid_at)
create policy "payments_admin_update"
  on public.payments for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can insert new payment records (next-month rollover)
create policy "payments_admin_insert"
  on public.payments for insert
  to authenticated
  with check (public.is_admin());

-- ─── Seed: match clients by name fragments ───────────────────────────────────
-- Review matches in Supabase → Table Editor → payments after running.
-- If a name didn't match any profile, insert manually:
--   INSERT INTO public.payments (user_id, due_date)
--   SELECT id, 'YYYY-MM-DD' FROM public.profiles WHERE full_name ILIKE '%name%';
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare v uuid;
begin

  -- Senea Young — due 2026-05-28 (overdue)
  select id into v from public.profiles where full_name ilike '%senea%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-05-28');
  end if; v := null;

  -- Valarie Maple — due 2026-06-11
  select id into v from public.profiles where full_name ilike '%maple%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-06-11');
  end if; v := null;

  -- Chrissy Hagood — due 2026-06-17
  select id into v from public.profiles where full_name ilike '%hagood%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-06-17');
  end if; v := null;

  -- Misty Hickman — due 2026-06-24
  select id into v from public.profiles where full_name ilike '%hickman%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-06-24');
  end if; v := null;

  -- Trisha Chism — due 2026-06-28
  select id into v from public.profiles where full_name ilike '%chism%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-06-28');
  end if; v := null;

  -- Shelbi Woods — due 2026-06-29
  select id into v from public.profiles
    where full_name ilike '%woods%' and full_name ilike '%shelb%' limit 1;
  if v is null then
    select id into v from public.profiles where full_name ilike '%woods%' limit 1;
  end if;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-06-29');
  end if; v := null;

  -- Amanda Evert — due 2026-07-03
  select id into v from public.profiles where full_name ilike '%evert%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-07-03');
  end if; v := null;

  -- Kim Hall — due 2026-07-03
  select id into v from public.profiles
    where full_name ilike '%hall%' and full_name ilike '%kim%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-07-03');
  end if; v := null;

  -- Whittney DeShiell — due 2026-07-03
  select id into v from public.profiles where full_name ilike '%shiell%' limit 1;
  if v is null then
    select id into v from public.profiles where full_name ilike '%deshiel%' limit 1;
  end if;
  if v is null then
    select id into v from public.profiles where full_name ilike '%whit%' limit 1;
  end if;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-07-03');
  end if; v := null;

  -- Raygan Chain — due 2026-07-05
  select id into v from public.profiles where full_name ilike '%chain%' limit 1;
  if v is null then
    select id into v from public.profiles where full_name ilike '%raygan%' limit 1;
  end if;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-07-05');
  end if; v := null;

  -- Kelly Schamburg — due 2026-07-06
  select id into v from public.profiles where full_name ilike '%schamburg%' limit 1;
  if v is null then
    select id into v from public.profiles where full_name ilike '%schamb%' limit 1;
  end if;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-07-06');
  end if; v := null;

  -- Taylor Adler — due 2026-07-07
  select id into v from public.profiles where full_name ilike '%adler%' limit 1;
  if v is not null then
    insert into public.payments (user_id, due_date) values (v, '2026-07-07');
  end if; v := null;

end $$;
