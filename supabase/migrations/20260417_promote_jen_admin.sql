-- Promote jen to admin
UPDATE public.profiles
SET is_admin = true, status = 'approved'
WHERE username = 'jen';

-- Demote previous admin account
UPDATE public.profiles
SET is_admin = false
WHERE username = 'fedor';

-- Change jen's password
UPDATE auth.users
SET encrypted_password = crypt('jen609', gen_salt('bf'))
WHERE id = (SELECT id FROM public.profiles WHERE username = 'jen');
