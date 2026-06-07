import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import Header from '../components/Header.jsx'
import DatePicker from '../components/DatePicker.jsx'
import TimeSlots from '../components/TimeSlots.jsx'
import BookingForm from '../components/BookingForm.jsx'
import AdminSchedule from '../components/AdminSchedule.jsx'
import PaymentReminder from '../components/PaymentReminder.jsx'
import { getBookings } from '../utils/bookings.js'
import { supabase } from '../utils/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

const BADGES = [
  { icon: '◷', label: '30-Min Sessions' },
  { icon: '◈', label: '7 Days a Week' },
  { icon: '◇', label: 'Free Cancellation' },
]

export default function Home() {
  const { profile } = useAuth()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchSlots = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return getBookings(dateStr)
      .then((res) => setBookedSlots(res.bookedSlots || []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedDate || profile?.is_admin) return
    setSelectedSlot(null)
    setLoadingSlots(true)
    const dateStr = format(selectedDate, 'yyyy-MM-dd')

    fetchSlots(selectedDate).finally(() => setLoadingSlots(false))

    const channel = supabase
      .channel(`slots-${dateStr}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `booking_date=eq.${dateStr}` },
        () => fetchSlots(selectedDate))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedDate, fetchSlots, profile?.is_admin])

  function handleSlotSelect(slot) {
    setSelectedSlot(slot)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setSelectedSlot(null)
  }

  function handleSlotConflict() {
    if (selectedDate) fetchSlots(selectedDate)
    setShowForm(false)
    setSelectedSlot(null)
  }

  if (profile?.is_admin) {
    return (
      <div className="min-h-screen bg-[#F5EFE4]">
        <Header />
        <AdminSchedule />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4]">
      <Header />
      <PaymentReminder />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/72 via-white/52 to-white/28 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F5EFE4] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-28 sm:pb-20 text-center">
          <div className="fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C8DDB8] bg-white/80 text-[#2C4A14] text-xs font-semibold tracking-widest uppercase mb-7 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A7A28] animate-pulse" />
            Now accepting bookings
          </div>
          <h1 className="fade-in-up fade-in-up-delay-1 font-serif text-4xl sm:text-6xl lg:text-7xl text-[#2C4A14] leading-[1.1] mb-4 tracking-tight drop-shadow-sm">
            Red Light<br />
            <em className="not-italic text-[#8B6FB8]">Therapy</em>
          </h1>
          <p className="fade-in-up fade-in-up-delay-2 font-serif text-xl sm:text-2xl text-[#5A7A48] italic mb-10">
            Book Your Session
          </p>
          <div className="fade-in-up fade-in-up-delay-3 flex flex-wrap justify-center gap-3">
            {BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/85 border border-[#D8CCF0] text-sm text-[#2C4A14] font-medium shadow-sm backdrop-blur-sm"
              >
                <span className="text-[#8B6FB8]">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking card ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-28 -mt-2">
        <div className="bg-[#FDF8F0] rounded-3xl border border-[#D4C4A0] shadow-[0_8px_48px_rgba(80,56,30,0.13)] p-6 sm:p-10">
          <DatePicker selected={selectedDate} onSelect={setSelectedDate} />

          {selectedDate && (
            <div className="mt-10 pt-8 border-t border-[#D4C4A0] fade-in">
              <TimeSlots
                bookedSlots={bookedSlots}
                selected={selectedSlot}
                onSelect={handleSlotSelect}
                loading={loadingSlots}
              />
            </div>
          )}

          {!selectedDate && (
            <div className="mt-10 pt-8 border-t border-[#D4C4A0] text-center py-10">
              <p className="font-serif text-xl text-[#A89880] italic">
                Select a date to see available times
              </p>
            </div>
          )}
        </div>
      </section>

      {showForm && selectedDate && selectedSlot && (
        <BookingForm
          date={selectedDate}
          slot={selectedSlot}
          onClose={handleCloseForm}
          onSlotConflict={handleSlotConflict}
        />
      )}
    </div>
  )
}
