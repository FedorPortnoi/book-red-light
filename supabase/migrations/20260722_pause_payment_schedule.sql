alter table public.profiles
  add column if not exists payment_paused_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_admin_update'
  ) then
    create policy profiles_admin_update
      on public.profiles
      for update
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$$;
