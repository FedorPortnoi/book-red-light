import { useLocation, Link } from 'react-router-dom'
import { generateCancelUrl, generateICS } from '../utils/email.js'
import { isSlotCancellable } from '../utils/slots.js'
import Header from '../components/Header.jsx'

export default function Confirmation() {
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="min-h-screen bg-[#FEFCFF] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-[#7A6B8A]">
          <p>No booking found. <Link to="/" className="text-[#8B6FB8] underline">Book a session</Link></p>
        </div>
      </div>
    )
  }

  const { name, email, date, dateDisplay, slot, bookingId } = state
  const cancelUrl = generateCancelUrl(bookingId, date, slot.id)
  const cancellable = isSlotCancellable(date, slot.id)

  function downloadICS() {
    const ics = generateICS({ name, date, time: slot.id, bookingId })
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `red-light-session-${date}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#FEFCFF] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-[#F5F0F8] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#8B6FB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2438] mb-3">You're booked!</h1>
          <p className="text-[#7A6B8A] mb-8">
            Your booking is saved to your account. You can always find it in Your Sessions.
          </p>

          {/* Booking card */}
          <div className="bg-white border border-[#E8DFF0] rounded-2xl p-6 mb-6 text-left">
            <div className="text-xs uppercase tracking-widest text-[#B8A5D9] font-medium mb-4">Booking Details</div>
            <div className="flex flex-col gap-3">
              <Row label="Name" value={name} />
              <Row label="Date" value={dateDisplay} />
              <Row label="Time" value={slot.label} />
              <Row label="Booking ID" value={bookingId} mono />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={downloadICS}
              className="w-full py-3.5 bg-[#8B6FB8] hover:bg-[#7A5FA8] text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Add to Calendar
            </button>

            {cancellable ? (
              <a
                href={cancelUrl}
                className="w-full py-3.5 border border-[#E8DFF0] hover:border-[#B8A5D9] text-[#7A6B8A] hover:text-[#8B6FB8] font-medium rounded-xl transition-colors text-center"
              >
                Cancel Booking
              </a>
            ) : (
              <p className="text-xs text-[#7A6B8A] py-2">
                Cancellation window has passed (must cancel 2h before session).
              </p>
            )}

            <Link
              to="/"
              className="text-sm text-[#B8A5D9] hover:text-[#8B6FB8] transition-colors"
            >
              ← Book another session
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-[#7A6B8A] shrink-0">{label}</span>
      <span className={`text-sm text-[#2D2438] text-right ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</span>
    </div>
  )
}
