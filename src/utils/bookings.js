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

// Every active booking between two dates (inclusive), with who holds it.
export async function getActiveBookingsInRange(fromDate, toDate) {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, user_id, booking_date, booking_time, profiles ( full_name )')
    .gte('booking_date', fromDate)
    .lte('booking_date', toDate)
    .eq('status', 'active')
  if (error) throw error
  return data.map((b) => ({ ...b, slotId: timeToSlot(b.booking_time) }))
}

// Admin blackout: books every { date, slotId } for the admin in one go.
// If someone grabs a slot mid-way, falls back to one-by-one and skips the taken ones.
export async function blockSlots({ slots, userId }) {
  const rows = slots.map((s) => ({ user_id: userId, booking_date: s.date, booking_time: slotToTime(s.slotId) }))
  if (rows.length === 0) return { blocked: 0, skipped: 0 }

  const { error } = await supabase.from('bookings').insert(rows)
  if (!error) return { blocked: rows.length, skipped: 0 }
  if (error.code !== '23505') throw error

  let blocked = 0
  for (const row of rows) {
    const { error: rowError } = await supabase.from('bookings').insert(row)
    if (!rowError) blocked++
    else if (rowError.code !== '23505') throw rowError
  }
  return { blocked, skipped: rows.length - blocked }
}

export async function cancelBookings(bookingIds) {
  if (bookingIds.length === 0) return { cancelled: 0 }
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .in('id', bookingIds)
    .eq('status', 'active')
  if (error) throw error
  return { cancelled: bookingIds.length }
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
