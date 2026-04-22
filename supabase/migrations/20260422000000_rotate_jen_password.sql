-- Rotate Jen's admin password (previous password 'jen609' was exposed in git history via 20260417_promote_jen_admin.sql)
-- NEW PASSWORD: xQ7#mP2$wL9!nK4v
-- TODO: rotate again before making this repo public

UPDATE auth.users
SET encrypted_password = crypt('xQ7#mP2$wL9!nK4v', gen_salt('bf'))
WHERE id = (SELECT id FROM public.profiles WHERE username = 'jen');
