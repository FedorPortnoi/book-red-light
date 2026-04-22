import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_uk0l7x9'
const TEMPLATE_ID = 'template_sms_jen'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'hqNSYN-AUE3HIaBI6'
const JEN_EMAIL = 'jen60985@gmail.com'

async function sendJenEmail(subject, message) {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      { to_email: JEN_EMAIL, subject, message, email: 'noreply@book-red-light.pages.dev' },
      PUBLIC_KEY
    )
  } catch (err) {
    console.warn('[EmailJS] Jen notification failed:', err)
  }
}

export async function sendConfirmation({ name, date, time }) {
  await sendJenEmail(
    'New Booking — Red Light Studio',
    `New booking at Red Light Studio.\n\nClient: ${name}\nDate: ${date}\nTime: ${time}`
  )
  return { success: true }
}

export async function sendCancellationNotification({ name, date, time }) {
  await sendJenEmail(
    'Booking Cancelled — Red Light Studio',
    `A booking has been cancelled at Red Light Studio.\n\nClient: ${name}\nDate: ${date}\nTime: ${time}`
  )
  return { success: true }
}

export async function sendNewAccountNotification({ fullName, username, phone, email }) {
  await sendJenEmail(
    'New Account Pending Approval — Red Light Studio',
    `A new client has registered and is awaiting your approval.\n\nName: ${fullName}\nUsername: ${username}\nPhone: ${phone}\nEmail: ${email}\n\nApprove at: https://book-red-light.pages.dev/admin`
  )
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
