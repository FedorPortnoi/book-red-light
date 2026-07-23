-- New accounts only require name, username, password, and email.
-- Preserve existing phone numbers while allowing the field to be omitted.
alter table public.profiles
  alter column phone drop not null;
