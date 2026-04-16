import { useState } from 'react'
import { format } from 'date-fns'
import { createBooking } from '../utils/bookings.js'
import { sendConfirmation, generateCancelUrl } from '../utils/email.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function BookingForm({ date, slot, onClose }) {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const dateStr = format(date, 'yyyy-MM-dd')
  const dateDisplay = format(date, 'EEEE, MMMM d, yyyy')

  async function handleConfirm() {
    setSubmitting(true)
    setError('')
    try {
      const result = await createBooking({ date: dateStr, time: slot.id, userId: profile.id })
      const cancelUrl = generateCancelUrl(result.bookingId, dateStr, slot.id)
      await sendConfirmation({
        name: profile.full_name,
        email: profile.email,
        date: dateDisplay,
        time: slot.label,
        bookingId: result.bookingId,
        cancelUrl,
      })
      navigate('/confirmation', {
        state: { name: profile.full_name, email: profile.email, date: dateStr, dateDisplay, slot, bookingId: result.bookingId },
      })
    } catch (err) {
      setError(err.message?.includes('unique') ? 'That slot was just booked. Please pick another time.' : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-[#2D2438]">Confirm Booking</h2>
            <div className="mt-2 flex flex-col gap-0.5">
              <span className="text-sm text-[#7A6B8A]">{dateDisplay}</span>
              <span className="text-sm font-semibold text-[#8B6FB8]">{slot.label}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#7A6B8A] hover:text-[#2D2438] text-2xl leading-none mt-1 cursor-pointer">×</button>
        </div>

        {/* Profile details */}
        <div className="bg-[#F5F0F8] rounded-xl p-4 mb-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-widest text-[#B8A5D9] font-medium mb-1">Your Details</div>
          <Row label="Name" value={profile?.full_name} />
          <Row label="Email" value={profile?.email} />
          <Row label="Phone" value={profile?.phone} />
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full py-4 bg-[#8B6FB8] hover:bg-[#7A5FA8] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer"
        >
          {submitting ? 'Booking…' : 'Confirm Booking'}
        </button>

        <p className="text-center text-xs text-[#7A6B8A] mt-3">
          Confirmation email will be sent to {profile?.email}. Free cancellation up to 2 hours before.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#7A6B8A]">{label}</span>
      <span className="text-[#2D2438] font-medium">{value}</span>
    </div>
  )
}
