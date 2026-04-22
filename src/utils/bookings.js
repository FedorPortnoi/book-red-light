import { supabase } from './supabase.js'
import { generateSlots, slotToTime, timeToSlot } from './slots.js'

const SLOT_LOOKUP = new Map(generateSlots().map((slot) => [slot.id, slot]))

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

export async function getUserBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, booking_date, booking_time, status, created_at, cancelled_at')
    .eq('user_id', userId)
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true })

  if (error) throw error

  return data.map((booking) => {
    const slotId = timeToSlot(booking.booking_time)
    const slot = SLOT_LOOKUP.get(slotId)

    return {
      ...booking,
      slotId,
      slotLabel: slot?.label ?? slotId,
      startLabel: slot?.startLabel ?? slotId,
      endLabel: slot?.endLabel ?? '',
    }
  })
}
