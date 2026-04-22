import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_4jkn3fn'
const SMS_TEMPLATE_ID = 'template_sms_jen'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const JEN_SMS = '7652300564@txt.att.net'

export async function sendConfirmation({ name, date, time }) {
  if (!PUBLIC_KEY) {
    console.log('[EmailJS mock] SMS to Jen:', JEN_SMS, { name, date, time })
    return { success: true }
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      SMS_TEMPLATE_ID,
      {
        to_email: JEN_SMS,
        booking_date: date,
        booking_time: time,
        client_name: name,
      },
      PUBLIC_KEY
    )
  } catch (err) {
    console.warn('[EmailJS] Jen SMS notification failed:', err)
  }

  return { success: true }
}

export function generateCancelUrl(bookingId, date, time) {
  const base = window.location.origin
  const params = new URLSearchParams({ id: bookingId, date, time })
  return `${base}/cancel?${params}`
}

export function generateICS({ name, date, time, bookingId }) {
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
