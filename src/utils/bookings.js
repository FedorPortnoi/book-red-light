import { supabase } from './supabase.js'

// slot id '0930' → postgres time '09:30:00'
function slotToTime(slotId) {
  return `${slotId.slice(0, 2)}:${slotId.slice(2)}:00`
}

// postgres time '09:30:00' → slot id '0930'
function timeToSlot(time) {
  return time.slice(0, 5).replace(':', '')
}

export async function getBookings(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('booking_time')
    .eq('booking_date', date)
    .eq('status', 'active')
  if (error) throw error
  return { bookedSlots: data.map((b) => timeToSlot(b.booking_time)) }
}

export async function createBooking({ date, time, userId }) {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ user_id: userId, booking_date: date, booking_time: slotToTime(time) })
    .select('id')
    .single()
  if (error) throw error
  return { success: true, bookingId: data.id }
}

export async function cancelBooking({ bookingId }) {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', bookingId)
    .eq('status', 'active')
  if (error) throw error
  return { success: true }
}
