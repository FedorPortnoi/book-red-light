import { useState, useEffect, useCallback } from 'react'
import { format, addDays, subDays, isToday, isSaturday } from 'date-fns'

function skipSat(date, dir) {
  let d = dir === 'prev' ? subDays(date, 1) : addDays(date, 1)
  while (isSaturday(d)) d = dir === 'prev' ? subDays(d, 1) : addDays(d, 1)
  return d
}
import { supabase } from '../utils/supabase.js'
import { generateSlots } from '../utils/slots.js'

const ALL_SLOTS = generateSlots()

function slotToTime(slotId) {
  return `${slotId.slice(0, 2)}:${slotId.slice(2)}:00`
}

function timeToSlot(time) {
  return time.slice(0, 5).replace(':', '')
}

export default function AdminSchedule() {
  const [viewDate, setViewDate] = useState(new Date())
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSchedule = useCallback(async (date) => {
    setLoading(true)
    const dateStr = format(date, 'yyyy-MM-dd')
    const { data, error } = await supabase
      .from('bookings')
      .select('id, booking_time, status, created_at, profiles ( full_name, username, phone, email )')
      .eq('booking_date', dateStr)
      .eq('status', 'active')
      .order('booking_time')
    if (!error) setBookings(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSchedule(viewDate)

    const dateStr = format(viewDate, 'yyyy-MM-dd')
    const channel = supabase
      .channel(`admin-schedule-${dateStr}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `booking_date=eq.${dateStr}` },
        () => fetchSchedule(viewDate))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [viewDate, fetchSchedule])

  // Build a slot-keyed map for quick lookup
  const bookingBySlot = new Map(
    bookings.map((b) => [timeToSlot(b.booking_time), b])
  )

  const bookedCount = bookings.length
  const totalSlots = ALL_SLOTS.length

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Date navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F0F8] text-[#8B6FB8] text-xs font-semibold uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6FB8]" />
            Daily Schedule
          </div>
          <h1 className="font-serif text-3xl text-[#2C4A14]">
            {isToday(viewDate) ? 'Today' : format(viewDate, 'EEEE')}
            <span className="text-[#8B6FB8] ml-2 text-2xl">
              {format(viewDate, 'MMM d')}
            </span>
          </h1>
          <p className="text-sm text-[#7A6B8A] mt-1">
            {bookedCount} of {totalSlots} slots booked
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewDate((d) => skipSat(d, 'prev'))}
            className="w-9 h-9 rounded-full border border-[#D4C4A0] bg-white flex items-center justify-center text-[#5A4A3A] hover:bg-[#F5F0F8] hover:border-[#8B6FB8] transition-colors cursor-pointer text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => setViewDate(new Date())}
            disabled={isToday(viewDate)}
            className="px-3 py-1.5 rounded-full border border-[#D4C4A0] bg-white text-xs font-semibold text-[#5A4A3A] hover:bg-[#F5F0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setViewDate((d) => skipSat(d, 'next'))}
            className="w-9 h-9 rounded-full border border-[#D4C4A0] bg-white flex items-center justify-center text-[#5A4A3A] hover:bg-[#F5F0F8] hover:border-[#8B6FB8] transition-colors cursor-pointer text-lg"
          >
            ›
          </button>
        </div>
      </div>

      {/* Slot list */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-[#EDE0C8] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ALL_SLOTS.map((slot) => {
            const booking = bookingBySlot.get(slot.id)
            return booking
              ? <BookedSlot key={slot.id} slot={slot} booking={booking} />
              : <OpenSlot key={slot.id} slot={slot} />
          })}
        </div>
      )}
    </div>
  )
}

function BookedSlot({ slot, booking }) {
  const p = booking.profiles
  return (
    <div className="bg-white border border-[#D4C4A0] rounded-2xl px-4 sm:px-5 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-[#8B6FB8] shrink-0 mt-1.5" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-[#2C4A14]">{slot.label}</p>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5F0F8] text-[#8B6FB8]">Booked</span>
          </div>
          <p className="font-medium text-[#2D2438] truncate">{p?.full_name}</p>
          <p className="text-xs text-[#7A6B8A] mt-0.5">@{p?.username} · {p?.phone}</p>
        </div>
      </div>
    </div>
  )
}

function OpenSlot({ slot }) {
  return (
    <div className="flex items-center gap-4 border border-dashed border-[#D4C4A0] rounded-2xl px-5 py-4 opacity-60">
      <div className="w-2 h-2 rounded-full bg-[#C8B898] shrink-0" />
      <div className="w-32 shrink-0">
        <p className="text-sm text-[#8A7A60]">{slot.label}</p>
      </div>
      <p className="text-sm text-[#A89880] italic">Available</p>
    </div>
  )
}
