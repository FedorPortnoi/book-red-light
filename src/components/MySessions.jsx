import { compareAsc, compareDesc, format, parseISO } from 'date-fns'
import { generateCancelUrl } from '../utils/email.js'
import { formatDateDisplay } from '../utils/slots.js'

export default function MySessions({ bookings, loading }) {
  const now = new Date()
  const upcoming = bookings
    .filter((booking) => booking.status === 'active' && getSessionDate(booking) > now)
    .sort((a, b) => compareAsc(getSessionDate(a), getSessionDate(b)))
  const history = bookings
    .filter((booking) => booking.status !== 'active' || getSessionDate(booking) <= now)
    .sort((a, b) => compareDesc(getSessionDate(a), getSessionDate(b)))

  return (
    <section id="sessions" className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
      <div className="bg-white rounded-2xl border border-[#E8DFF0] shadow-sm p-6 sm:p-10">
        <div className="flex flex-col gap-2 mb-8">
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-[#F5F0F8] text-[#8B6FB8] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#8B6FB8]" />
            Your Sessions
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2438]">Everything you booked lives here</h2>
          <p className="text-[#7A6B8A] max-w-2xl">
            Upcoming sessions, completed visits, and cancellations are tied to your account so you do not have to hunt for them later.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-[#F5F0F8] animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8DFF0] bg-[#FEFCFF] px-6 py-10 text-center">
            <h3 className="font-serif text-2xl text-[#2D2438] mb-2">No sessions booked yet</h3>
            <p className="text-[#7A6B8A]">Choose a date below and your first booking will show up here immediately.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <SessionGroup
              title="Upcoming"
              bookings={upcoming}
              emptyText="No upcoming sessions at the moment."
            />
            <SessionGroup
              title="History"
              bookings={history}
              emptyText="Past or cancelled sessions will appear here."
            />
          </div>
        )}
      </div>
    </section>
  )
}

function SessionGroup({ title, bookings, emptyText }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-2xl text-[#2D2438]">{title}</h3>
        <span className="text-sm text-[#B8A5D9]">{bookings.length}</span>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8DFF0] px-5 py-6 text-[#7A6B8A]">
          {emptyText}
        </div>
      ) : (
        bookings.map((booking) => <SessionCard key={booking.id} booking={booking} />)
      )}
    </div>
  )
}

function SessionCard({ booking }) {
  const sessionDate = getSessionDate(booking)
  const isUpcoming = booking.status === 'active' && sessionDate > new Date()
  const canCancel = booking.status === 'active'
  const cancelUrl = generateCancelUrl(booking.id, booking.booking_date, booking.slotId)

  return (
    <article className="rounded-2xl border border-[#E8DFF0] bg-[#FEFCFF] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="font-semibold text-[#2D2438]">{formatDateDisplay(booking.booking_date)}</h4>
            <StatusBadge booking={booking} sessionDate={sessionDate} />
          </div>
          <p className="text-lg text-[#8B6FB8] font-medium">{booking.slotLabel}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-[#7A6B8A]">
            <span>Booking ID: <span className="font-mono text-xs text-[#2D2438]">{booking.id}</span></span>
            <span>Created {format(parseISO(booking.created_at), 'MMM d, yyyy')}</span>
            {booking.cancelled_at && (
              <span>Cancelled {format(parseISO(booking.cancelled_at), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>

        {booking.status === 'active' && (
          <div className="sm:text-right">
            {canCancel ? (
              <a
                href={cancelUrl}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#E8DFF0] text-[#7A6B8A] hover:text-[#8B6FB8] hover:border-[#B8A5D9] transition-colors"
              >
                Cancel Session
              </a>
            ) : (
              <p className="text-sm text-[#B8A5D9] max-w-44">
                This session can no longer be cancelled.
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function StatusBadge({ booking, sessionDate }) {
  let label = 'Upcoming'
  let className = 'bg-green-50 text-green-700'

  if (booking.status === 'cancelled') {
    label = 'Cancelled'
    className = 'bg-red-50 text-red-600'
  } else if (sessionDate <= new Date()) {
    label = 'Completed'
    className = 'bg-[#F5F0F8] text-[#7A6B8A]'
  }

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}

function getSessionDate(booking) {
  return parseISO(`${booking.booking_date}T${booking.booking_time}`)
}
