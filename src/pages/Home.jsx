import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Header from '../components/Header.jsx'
import DangerZone from '../components/DangerZone.jsx'
import MySessions from '../components/MySessions.jsx'
import DatePicker from '../components/DatePicker.jsx'
import TimeSlots from '../components/TimeSlots.jsx'
import BookingForm from '../components/BookingForm.jsx'
import { getBookings, getUserBookings } from '../utils/bookings.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { profile } = useAuth()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loadingMyBookings, setLoadingMyBookings] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!profile?.id) return
    setLoadingMyBookings(true)
    getUserBookings(profile.id)
      .then(setMyBookings)
      .catch(console.error)
      .finally(() => setLoadingMyBookings(false))
  }, [profile?.id])

  useEffect(() => {
    if (!selectedDate) return
    setSelectedSlot(null)
    setLoadingSlots(true)
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    getBookings(dateStr)
      .then((res) => setBookedSlots(res.bookedSlots || []))
      .catch(console.error)
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  function handleSlotSelect(slot) {
    setSelectedSlot(slot)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setSelectedSlot(null)
  }

  return (
    <div className="min-h-screen bg-[#FEFCFF]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0F8] to-[#FEFCFF] -z-10" />
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B8A5D9]/20 text-[#8B6FB8] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#8B6FB8] animate-pulse" />
            Now accepting bookings
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#2D2438] leading-tight mb-5">
            Book Your<br />
            <em className="text-[#8B6FB8] not-italic">Red Light</em> Session
          </h1>
          <p className="text-[#7A6B8A] text-lg max-w-md mx-auto leading-relaxed">
            Experience the rejuvenating power of red light therapy. 30-minute sessions tailored to your wellbeing.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-[#7A6B8A]">
            {[
              { icon: '⏱', text: '30-min sessions' },
              { icon: '📅', text: 'Sun – Fri' },
              { icon: '🗂', text: 'Your sessions saved' },
              { icon: '🔄', text: 'Free cancellation' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MySessions bookings={myBookings} loading={loadingMyBookings} />

      {/* Booking section */}
      <section id="book" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-2xl border border-[#E8DFF0] shadow-sm p-6 sm:p-10">
          <DatePicker selected={selectedDate} onSelect={setSelectedDate} />

          {selectedDate && (
            <div className="mt-10 pt-8 border-t border-[#E8DFF0]">
              <TimeSlots
                bookedSlots={bookedSlots}
                selected={selectedSlot}
                onSelect={handleSlotSelect}
                loading={loadingSlots}
              />
            </div>
          )}

          {!selectedDate && (
            <div className="mt-10 pt-8 border-t border-[#E8DFF0] text-center text-[#B8A5D9] py-8">
              <p className="font-serif text-lg">Select a date to see available times</p>
            </div>
          )}
        </div>
      </section>

      {/* About strip */}
      <section id="about" className="bg-[#F5F0F8] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-[#2D2438] mb-4">What is Red Light Therapy?</h2>
          <p className="text-[#7A6B8A] leading-relaxed max-w-xl mx-auto">
            Red light therapy uses specific wavelengths of light to penetrate skin tissue, promoting cellular regeneration, reducing inflammation, and enhancing overall vitality. Each 30-minute session is a deeply relaxing, non-invasive experience.
          </p>
        </div>
      </section>

      <DangerZone />

      {showForm && selectedDate && selectedSlot && (
        <BookingForm date={selectedDate} slot={selectedSlot} onClose={handleCloseForm} />
      )}
    </div>
  )
}
