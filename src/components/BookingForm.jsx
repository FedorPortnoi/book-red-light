import { useState } from 'react'
import { format } from 'date-fns'
import { createBooking } from '../utils/bookings.js'
import { sendConfirmation, generateCancelUrl } from '../utils/email.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function BookingForm({ date, slot, onClose, onSlotConflict }) {
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
        date: dateDisplay,
        time: slot.label,
        bookingId: result.bookingId,
        cancelUrl,
      })
      navigate('/confirmation', {
        state: { name: profile.full_name, email: profile.email, date: dateStr, dateDisplay, slot, bookingId: result.bookingId },
      })
    } catch (err) {
      if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
        onSlotConflict?.()
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fade-in-up w-full sm:max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-[0_24px_80px_rgba(45,36,56,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#B8A5D9] via-[#8B6FB8] to-[#C4B3D9]" />

        <div className="p-7 sm:p-8">
          {/* close */}
          <div className="flex justify-end mb-5">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F0F8] flex items-center justify-center text-[#7A6B8A] hover:bg-[#EDE6F5] hover:text-[#2D2438] transition-colors cursor-pointer text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* date + time summary */}
          <div className="bg-gradient-to-br from-[#F5F0F8] to-[#EDE6F5] rounded-2xl p-5 mb-6 text-center">
            <div className="font-serif text-3xl text-[#8B6FB8] font-medium mb-1">
              {slot.label}
            </div>
            <div className="text-sm text-[#7A6B8A] font-medium">{dateDisplay}</div>
            <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-[#D8CCF0]">
              <Chip label="30 minutes" />
              <Chip label="Red Light Therapy" />
            </div>
          </div>

          <h2 className="font-serif text-2xl text-[#2D2438] mb-4">Confirm Booking</h2>

          {/* profile details */}
          <div className="flex flex-col gap-2.5 mb-6">
            <Row label="Name" value={profile?.full_name} />
            <Row label="Email" value={profile?.email} />
            <Row label="Phone" value={profile?.phone} />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full py-4 bg-[#8B6FB8] hover:bg-[#7A5FA8] active:bg-[#6B4F98] disabled:opacity-60 text-white font-semibold rounded-2xl transition-all shadow-[0_4px_16px_rgba(139,111,184,0.35)] hover:shadow-[0_6px_20px_rgba(139,111,184,0.45)] cursor-pointer text-base"
          >
            {submitting ? 'Booking…' : 'Confirm Booking'}
          </button>

          <p className="text-center text-xs text-[#9B8AAB] mt-4 leading-relaxed">
            Booking appears in Your Sessions immediately · Free cancellation anytime before your session
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[#F0EAF8] last:border-0">
      <span className="text-sm text-[#9B8AAB]">{label}</span>
      <span className="text-sm text-[#2D2438] font-medium">{value || '—'}</span>
    </div>
  )
}

function Chip({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-[#D8CCF0] text-xs text-[#8B6FB8] font-medium">
      {label}
    </span>
  )
}
