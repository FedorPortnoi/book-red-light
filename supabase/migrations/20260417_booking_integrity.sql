-- 1. Prevent double-booking at the database level.
--    A partial unique index ensures no two active bookings can share the same date+time.
--    Even a race condition (two users clicking simultaneously) will result in only one succeeding.
CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_active_slot
  ON public.bookings (booking_date, booking_time)
  WHERE status = 'active';

-- 2. Allow all authenticated users to SELECT active bookings.
--    Required for: (a) showing which slots are taken, (b) real-time subscription events
--    reaching all connected clients (Supabase filters realtime events through RLS).
--    Personal info (name, phone, email) is still protected — it lives in profiles,
--    which has a separate select-own-only policy.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'bookings'
      AND policyname = 'bookings_read_active'
  ) THEN
    CREATE POLICY "bookings_read_active"
      ON public.bookings
      FOR SELECT
      TO authenticated
      USING ( status = 'active' );
  END IF;
END
$$;

-- 3. Add bookings table to the real-time publication so Supabase broadcasts
--    INSERT/UPDATE/DELETE events to subscribed clients.
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
