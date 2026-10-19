import { useState, useEffect, useMemo } from 'react'
import { format, parseISO, addWeeks, addMonths, differenceInCalendarDays } from 'date-fns'
import { generateSlots } from '../utils/slots.js'
import { getActiveBookingsInRange, blockSlots, cancelBookings } from '../utils/bookings.js'
import { useAuth } from '../context/AuthContext.jsx'

const REPEATS = [
  { id: 'once', label: 'Just this day' },
  { id: 'weekly', label: 'Every week' },
  { id: 'biweekly', label: 'Every other week' },
]

const MAX_DAYS = 366

// Every possible slot start / end across the week (weekdays open earliest).
const ALL_SLOTS = generateSlots()
const START_OPTIONS = ALL_SLOTS.map((s) => ({ value: s.hour * 60 + s.minute, label: s.startLabel }))
const END_OPTIONS = ALL_SLOTS.map((s) => ({ value: s.hour * 60 + s.minute + 30, label: s.endLabel }))

export default function BlockTimeForm({ initialDate, onClose, onDone }) {
  const { profile } = useAuth()
  const [mode, setMode] = useState('block')
  const [startDate, setStartDate] = useState(() => format(initialDate, 'yyyy-MM-dd'))
  const [fromMin, setFromMin] = useState(9 * 60)
  const [toMin, setToMin] = useState(12 * 60)
  const [repeat, setRepeat] = useState('once')
  const [untilDate, setUntilDate] = useState(() => format(addMonths(initialDate, 3), 'yyyy-MM-dd'))
  const [existing, setExisting] = useState([])
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const rangeEnd = repeat === 'once' ? startDate : untilDate
  const rangeError = getRangeError(startDate, rangeEnd, fromMin, toMin)

  const dates = useMemo(
    () => (rangeError ? [] : planDates(startDate, repeat, untilDate)),
    [startDate, repeat, untilDate, rangeError]
  )

  useEffect(() => {
    if (rangeError) return
    let stale = false
    setLoadingExisting(true)
    getActiveBookingsInRange(startDate, rangeEnd)
      .then((rows) => { if (!stale) setExisting(rows) })
      .catch(() => { if (!stale) setError('Could not load existing bookings.') })
      .finally(() => { if (!stale) setLoadingExisting(false) })
    return () => { stale = true }
  }, [startDate, rangeEnd, rangeError])

  const plan = useMemo(() => {
    const byKey = new Map(existing.map((b) => [`${b.booking_date}|${b.slotId}`, b]))
    const toBlock = []
    const alreadyBlocked = []
    const clientBookings = []
    for (const date of dates) {
      const dateStr = format(date, 'yyyy-MM-dd')
      for (const slot of generateSlots(date)) {
        const start = slot.hour * 60 + slot.minute
        if (start < fromMin || start >= toMin) continue
        const booking = byKey.get(`${dateStr}|${slot.id}`)
        if (!booking) toBlock.push({ date: dateStr, slotId: slot.id })
        else if (booking.user_id === profile.id) alreadyBlocked.push(booking)
        else clientBookings.push({ ...booking, dateObj: date, slot })
      }
    }
    return { toBlock, alreadyBlocked, clientBookings }
  }, [dates, existing, fromMin, toMin, profile.id])

  const actionCount = mode === 'block' ? plan.toBlock.length : plan.alreadyBlocked.length
  const timeLabel = `${labelFor(START_OPTIONS, fromMin)} – ${labelFor(END_OPTIONS, toMin)}`

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      if (mode === 'block') {
        const { blocked, skipped } = await blockSlots({ slots: plan.toBlock, userId: profile.id })
        onDone(`Blocked ${blocked} slot${blocked === 1 ? '' : 's'}${skipped ? ` (${skipped} got booked by a client just now and were skipped)` : ''}.`)
      } else {
        const { cancelled } = await cancelBookings(plan.alreadyBlocked.map((b) => b.id))
        onDone(`Unblocked ${cancelled} slot${cancelled === 1 ? '' : 's'}.`)
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fade-in-up w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-[0_24px_80px_rgba(45,36,56,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#B8A5D9] via-[#8B6FB8] to-[#C4B3D9]" />

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl text-[#2D2438]">
              {mode === 'block' ? 'Block off time' : 'Unblock time'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F0F8] flex items-center justify-center text-[#7A6B8A] hover:bg-[#EDE6F5] hover:text-[#2D2438] transition-colors cursor-pointer text-lg leading-none"
            >
              ×
            </button>
          </div>

          <Segmented
            options={[{ id: 'block', label: 'Block' }, { id: 'unblock', label: 'Unblock' }]}
            value={mode}
            onChange={setMode}
          />

          <div className="flex flex-col gap-4 mt-5">
            <Labeled label={repeat === 'once' ? 'Date' : 'Starting'}>
              <input
                type="date"
                value={startDate}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </Labeled>

            <div className="grid grid-cols-2 gap-3">
              <Labeled label="From">
                <select value={fromMin} onChange={(e) => setFromMin(Number(e.target.value))} className={inputClass}>
                  {START_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Labeled>
              <Labeled label="Until">
                <select value={toMin} onChange={(e) => setToMin(Number(e.target.value))} className={inputClass}>
                  {END_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Labeled>
            </div>

            <Labeled label="Repeat">
              <Segmented options={REPEATS} value={repeat} onChange={setRepeat} />
            </Labeled>

            {repeat !== 'once' && (
              <Labeled label="Keep repeating through">
                <input
                  type="date"
                  value={untilDate}
                  min={startDate}
                  onChange={(e) => setUntilDate(e.target.value)}
                  className={inputClass}
                />
              </Labeled>
            )}
          </div>

          {/* Preview */}
          <div className="mt-6 rounded-2xl bg-[#F5F0F8] p-4">
            {rangeError ? (
              <p className="text-sm text-red-600">{rangeError}</p>
            ) : loadingExisting ? (
              <p className="text-sm text-[#7A6B8A]">Checking the calendar…</p>
            ) : (
              <>
                <p className="text-sm text-[#2D2438] font-medium mb-2">
                  {timeLabel} on {dates.length} day{dates.length === 1 ? '' : 's'}:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {dates.map((d) => (
                    <span key={d.toISOString()} className="px-2.5 py-1 rounded-full bg-white border border-[#D8CCF0] text-xs text-[#5A4A6A]">
                      {format(d, 'EEE MMM d')}
                    </span>
                  ))}
                </div>

                {mode === 'block' && plan.alreadyBlocked.length > 0 && (
                  <p className="text-xs text-[#7A6B8A] mt-3">
                    {plan.alreadyBlocked.length} of these slots are already blocked.
                  </p>
                )}
                {mode === 'block' && plan.clientBookings.length > 0 && (
                  <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                    <p className="text-xs font-semibold text-amber-700 mb-1">
                      Already booked by clients (these stay as they are):
                    </p>
                    <ul className="text-xs text-amber-700 space-y-0.5">
                      {plan.clientBookings.map((b) => (
                        <li key={b.id}>
                          {format(b.dateObj, 'EEE MMM d')}, {b.slot.startLabel} · {b.profiles?.full_name ?? 'client'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {mode === 'unblock' && plan.alreadyBlocked.length === 0 && (
                  <p className="text-xs text-[#7A6B8A] mt-3">Nothing is blocked in these times.</p>
                )}
              </>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mt-4">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || loadingExisting || !!rangeError || actionCount === 0}
            className="w-full mt-5 py-4 bg-[#8B6FB8] hover:bg-[#7A5FA8] active:bg-[#6B4F98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all shadow-[0_4px_16px_rgba(139,111,184,0.35)] cursor-pointer text-base"
          >
            {submitting
              ? (mode === 'block' ? 'Blocking…' : 'Unblocking…')
              : `${mode === 'block' ? 'Block' : 'Unblock'} ${actionCount} slot${actionCount === 1 ? '' : 's'}`}
          </button>
          <p className="text-center text-xs text-[#9B8AAB] mt-3">
            {mode === 'block'
              ? 'Clients will see these times as taken. No emails are sent.'
              : 'These times open up for clients again right away.'}
          </p>
        </div>
      </div>
    </div>
  )
}

const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-[#D8CCF0] bg-white text-sm text-[#2D2438] focus:outline-none focus:border-[#8B6FB8]'

function planDates(startDate, repeat, untilDate) {
  const start = parseISO(startDate)
  if (repeat === 'once') return [start]
  const step = repeat === 'weekly' ? 1 : 2
  const end = parseISO(untilDate)
  const dates = []
  for (let d = start; d <= end; d = addWeeks(d, step)) dates.push(d)
  return dates
}

function getRangeError(startDate, endDate, fromMin, toMin) {
  if (!startDate || !endDate) return 'Pick a date.'
  if (toMin <= fromMin) return 'The end time has to be after the start time.'
  if (differenceInCalendarDays(parseISO(startDate), new Date()) < 0) return 'That date has already passed.'
  const span = differenceInCalendarDays(parseISO(endDate), parseISO(startDate))
  if (span < 0) return 'The repeat-through date is before the start date.'
  if (span > MAX_DAYS) return 'Please keep it within one year.'
  return ''
}

function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label ?? ''
}

function Labeled({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6B8A]">{label}</span>
      {children}
    </div>
  )
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex gap-1 bg-[#F5F0F8] rounded-xl p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            value === o.id ? 'bg-white text-[#8B6FB8] shadow-sm' : 'text-[#7A6B8A] hover:text-[#8B6FB8]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
