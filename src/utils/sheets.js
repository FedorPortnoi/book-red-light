// Replace with your deployed Google Apps Script Web App URL
const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || ''

// Mock data for development (used when SHEETS_URL is not set)
const mockBookings = new Map()

async function callSheets(payload) {
  if (!SHEETS_URL) {
    return mockCall(payload)
  }

  const res = await fetch(SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`)
  return res.json()
}

// Mock implementation for local dev
function mockCall(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (payload.action === 'getBookings') {
        const key = payload.date
        const booked = mockBookings.get(key) || []
        resolve({ success: true, bookedSlots: booked })
      } else if (payload.action === 'book') {
        const key = payload.date
        const existing = mockBookings.get(key) || []
        const bookingId = `BRL-${Date.now()}`
        mockBookings.set(key, [...existing, payload.time])
        resolve({ success: true, bookingId })
      } else if (payload.action === 'cancel') {
        // Find and remove the booking
        for (const [date, slots] of mockBookings.entries()) {
          const idx = slots.indexOf(payload.time)
          if (idx !== -1) {
            slots.splice(idx, 1)
            mockBookings.set(date, slots)
          }
        }
        resolve({ success: true })
      }
    }, 400)
  })
}

export async function getBookings(date) {
  return callSheets({ action: 'getBookings', date })
}

export async function createBooking({ date, time, name, phone, email }) {
  return callSheets({ action: 'book', date, time, name, phone, email })
}

export async function cancelBooking({ bookingId, date, time }) {
  return callSheets({ action: 'cancel', bookingId, date, time })
}
