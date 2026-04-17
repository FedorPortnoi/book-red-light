-- Allow admins to read all bookings (joined with profiles for the schedule view)
CREATE POLICY "admin_read_all_bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING ( public.is_admin() );
