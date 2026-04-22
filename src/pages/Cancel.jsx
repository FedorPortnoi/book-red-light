import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { cancelBooking } from '../utils/bookings.js'
import { isSlotCancellable, formatDateDisplay } from '../utils/slots.js'
import { sendCancellationNotification } from '../utils/email.js'

export default function Cancel() {
  const [params] = useSearchParams()
  const bookingId = params.get('id')
  const date = params.get('date')
  const time = params.get('time')

  const [status, setStatus] = useState('idle')

  const cancellable = date && time ? isSlotCancellable(date, time) : false
  const dateDisplay = date ? formatDateDisplay(date) : ''

  async function handleCancel() {
    if (!cancellable) { setStatus('too-late'); return }
    setStatus('loading')
    try {
      await cancelBooking({ bookingId })
      sendCancellationNotification({ name: 'A client', date: dateDisplay, time }).catch(() => {})
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (!bookingId || !date || !time) {
    return (
      <div className="min-h-screen bg-[#FEFCFF] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-[#7A6B8A] mb-4">Invalid cancellation link.</p>
            <Link to="/" className="text-[#8B6FB8] underline">Book a new session</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FEFCFF] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          {status === 'success' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-[#F5F0F8] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#8B6FB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl text-[#2D2438] mb-3">Booking Cancelled</h1>
              <p className="text-[#7A6B8A] mb-6">Your session has been successfully cancelled.</p>
              <Link to="/" className="inline-block px-6 py-3 bg-[#8B6FB8] text-white rounded-xl font-semibold hover:bg-[#7A5FA8] transition-colors">
                Book Again
              </Link>
            </>
          ) : status === 'too-late' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl text-[#2D2438] mb-3">Too Late to Cancel</h1>
              <p className="text-[#7A6B8A]">Cancellations must be made at least 2 hours before your session.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#F5F0F8] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#B8A5D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl text-[#2D2438] mb-2">Cancel Booking</h1>
              <p className="text-[#7A6B8A] mb-1 text-sm">Booking ID: <span className="font-mono text-xs">{bookingId}</span></p>

              <div className="bg-white border border-[#E8DFF0] rounded-xl p-4 my-6 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A6B8A]">Date</span>
                  <span className="text-[#2D2438] font-medium">{dateDisplay}</span>
                </div>
              </div>

              {!cancellable && (
                <p className="text-amber-600 text-sm mb-4">
                  This session is within 2 hours. Cancellation may not be available.
                </p>
              )}

              {status === 'error' && (
                <p className="text-red-500 text-sm mb-4">Something went wrong. Please try again.</p>
              )}

              <button
                onClick={handleCancel}
                disabled={status === 'loading'}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {status === 'loading' ? 'Cancelling…' : 'Yes, Cancel My Booking'}
              </button>
              <Link to="/" className="block mt-3 text-sm text-[#B8A5D9] hover:text-[#8B6FB8] transition-colors">
                Keep my booking
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
