import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_4jkn3fn'
const CONFIRMATION_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE || 'template_confirmation'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

export async function sendConfirmation({ name, email, date, time, bookingId, cancelUrl }) {
  if (!PUBLIC_KEY) {
    console.log('[EmailJS mock] Confirmation email to:', email, { name, date, time, bookingId })
    return { success: true }
  }

  return emailjs.send(
    SERVICE_ID,
    CONFIRMATION_TEMPLATE_ID,
    {
      to_name: name,
      to_email: email,
      booking_date: date,
      booking_time: time,
      booking_id: bookingId,
      cancel_url: cancelUrl,
    },
    PUBLIC_KEY
  )
}

export function generateCancelUrl(bookingId, date, time) {
  const base = window.location.origin
  const params = new URLSearchParams({ id: bookingId, date, time })
  return `${base}/cancel?${params}`
}

export function generateICS({ name, date, time, bookingId }) {
  // date: 'YYYY-MM-DD', time: '0930' (id format)
  const hour = parseInt(time.slice(0, 2))
  const minute = parseInt(time.slice(2))
  const endHour = minute + 30 >= 60 ? hour + 1 : hour
  const endMinute = (minute + 30) % 60

  const pad = (n) => String(n).padStart(2, '0')
  const dateStr = date.replace(/-/g, '')
  const startDt = `${dateStr}T${pad(hour)}${pad(minute)}00`
  const endDt = `${dateStr}T${pad(endHour)}${pad(endMinute)}00`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Book Red Light//EN',
    'BEGIN:VEVENT',
    `DTSTART:${startDt}`,
    `DTEND:${endDt}`,
    `SUMMARY:Red Light Therapy Session`,
    `DESCRIPTION:Booking ID: ${bookingId}`,
    `UID:${bookingId}@book-red-light`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return ics
}
