import { addDays, format, parseISO } from 'date-fns'

export function getAvailableDates(daysAhead = 14) {
  const dates = []
  const today = new Date()
  let current = new Date(today)

  while (dates.length < daysAhead) {
    dates.push(new Date(current))
    current = addDays(current, 1)
  }

  return dates
}

export function generateSlots() {
  const slots = []
  // 9:30 AM to 8:00 PM, 30-min increments (last slot 8:00-8:30pm)
  const startHour = 9
  const startMinute = 30
  const endHour = 20 // last slot starts at 20:00

  let hour = startHour
  let minute = startMinute

  while (hour < endHour || (hour === endHour && minute === 0)) {
    const label = formatTime(hour, minute)
    const endMinute = minute + 30
    const endH = endMinute >= 60 ? hour + 1 : hour
    const endM = endMinute >= 60 ? endMinute - 60 : endMinute
    const endLabel = formatTime(endH, endM)
    slots.push({
      id: `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}`,
      label: `${label} - ${endLabel}`,
      startLabel: label,
      endLabel,
      hour,
      minute,
    })
    minute += 30
    if (minute >= 60) {
      minute = 0
      hour++
    }
  }

  return slots
}

function formatTime(hour, minute) {
  const period = hour < 12 ? 'am' : 'pm'
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${h}:${String(minute).padStart(2, '0')}${period}`
}

export function isSlotCancellable(dateStr, timeId) {
  const hour = parseInt(timeId.slice(0, 2))
  const minute = parseInt(timeId.slice(2))
  const slotDate = parseISO(dateStr)
  slotDate.setHours(hour, minute, 0, 0)
  return slotDate > new Date()
}

export function formatDateDisplay(dateStr) {
  const d = parseISO(dateStr)
  return format(d, 'EEEE, MMMM d, yyyy')
}

// slot id '0930' → postgres time '09:30:00'
export function slotToTime(slotId) {
  return `${slotId.slice(0, 2)}:${slotId.slice(2)}:00`
}

// postgres time '09:30:00' → slot id '0930'
export function timeToSlot(time) {
  return time.slice(0, 5).replace(':', '')
}
