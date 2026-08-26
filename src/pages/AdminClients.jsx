import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isBefore, isAfter, addDays, startOfDay } from 'date-fns'
import { useSignOut } from '../hooks/useSignOut.js'
import {
  getAllClientsPayments,
  markPaid,
  setDueDate,
  pausePaymentSchedule,
  resumePaymentSchedule,
  nextDueDate,
  defaultResumeDate,
  today as todayStr,
} from '../utils/payments.js'

export default function AdminClients() {
  const navigate = useNavigate()
  const handleSignOut = useSignOut()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setClients(await getAllClientsPayments())
    } catch (e) {
      setError('Failed to load clients.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Runs one admin action for one client, then refreshes the list.
  async function run(clientId, message, action) {
    if (busy) return false
    setBusy(clientId)
    setError(null)
    try {
      await action()
      await load()
      return true
    } catch (e) {
      setError(message)
      return false
    } finally {
      setBusy(null)
    }
  }

  const today = startOfDay(new Date())
  const soonCutoff = addDays(today, 3)

  return (
    <div className="min-h-screen bg-[#F5EFE4]">
      <header className="w-full py-3 px-4 sm:px-6 flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-[#E0D8C8] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/images/jens-logo.png" alt="Jen's LLC" className="h-11 w-auto object-contain" />
          <span className="text-xs px-2 py-0.5 bg-[#F5F0F8] text-[#8B6FB8] rounded-full font-semibold">Admin</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => navigate('/')}
            className="text-sm px-3 py-1.5 rounded-full border border-[#D4C4A0] text-[#5A4A3A] hover:bg-[#F0E8D8] transition-colors cursor-pointer font-medium hidden sm:block">
            Schedule
          </button>
          <button onClick={() => navigate('/admin')}
            className="text-sm px-3 py-1.5 rounded-full border border-[#D4C4A0] text-[#5A4A3A] hover:bg-[#F0E8D8] transition-colors cursor-pointer font-medium hidden sm:block">
            Registrations
          </button>
          <button onClick={handleSignOut}
            className="text-sm px-4 py-1.5 rounded-full border border-[#D4C4A0] text-[#5A4A3A] hover:bg-[#F0E8D8] transition-colors cursor-pointer font-medium">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="font-serif text-3xl text-[#2D2438] mb-2">Clients</h1>
        <p className="text-[#7A6B8A] text-sm mb-8">Mark a payment received, change when the next one is due, or pause someone while they are not coming.</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[#B8A5D9] font-serif italic">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16 text-[#B8A5D9] font-serif italic">No approved clients yet.</div>
        ) : (
          <div className="bg-[#FDF8F0] rounded-2xl border border-[#D4C4A0] divide-y divide-[#EDE5D8]">
            {clients.map(client => (
              <ClientRow
                key={client.id}
                client={client}
                busy={busy}
                today={today}
                soonCutoff={soonCutoff}
                run={run}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function ClientRow({ client, busy, today, soonCutoff, run }) {
  // editing: null | 'paid' (record a payment) | 'due' (move the due date) | 'start' (begin a schedule)
  const [editing, setEditing] = useState(null)
  const [date, setDate] = useState('')

  const p = client.payment
  const paused = !!client.payment_paused_at
  const dueDate = p ? new Date(p.due_date + 'T00:00:00') : null
  const overdue = !paused && dueDate && isBefore(dueDate, today)
  const soon = !paused && dueDate && !overdue && !isAfter(dueDate, soonCutoff)
  const working = busy === client.id

  function open(mode) {
    setDate(mode === 'paid' ? todayStr() : p ? p.due_date : defaultResumeDate())
    setEditing(mode)
  }

  async function save() {
    if (!date) return
    const ok = await run(client.id, saveError[editing], () => {
      if (editing === 'paid') return markPaid(p.id, client.id, p.due_date, date)
      if (editing === 'due') return setDueDate(p.id, date)
      return resumePaymentSchedule(client.id, date)
    })
    if (ok) setEditing(null)
  }

  return (
    <div className="px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="font-medium text-[#2C4A14] truncate">{client.full_name}</p>
          <p className="text-xs text-[#7A6B8A] mt-0.5">@{client.username}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {paused ? (
            <>
              <span className="text-sm font-medium text-[#7A6B8A] whitespace-nowrap">Off schedule</span>
              <button
                onClick={() => open('start')}
                disabled={!!busy}
                className="px-4 py-1.5 rounded-full bg-[#8B6FB8] text-white text-sm font-semibold hover:bg-[#7A5FA8] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {working ? '...' : 'Resume'}
              </button>
            </>
          ) : p ? (
            <>
              <span className={`text-sm font-medium whitespace-nowrap ${
                overdue ? 'text-red-500' : soon ? 'text-amber-600' : 'text-[#5A4A3A]'
              }`}>
                {overdue ? 'Overdue - ' : 'Due '}{format(dueDate, 'MMM d')}
              </span>
              <button
                onClick={() => open('paid')}
                disabled={!!busy}
                className="px-5 py-1.5 rounded-full bg-[#2C4A14] text-white text-sm font-semibold hover:bg-[#1e3409] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {working ? '...' : 'PAID'}
              </button>
              <button
                onClick={() => open('due')}
                disabled={!!busy}
                className="px-4 py-1.5 rounded-full border border-[#D4C4A0] text-[#5A4A3A] text-sm font-semibold hover:bg-[#F0E8D8] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                Change date
              </button>
              <button
                onClick={() => run(client.id, 'Failed to pause payment schedule.', () => pausePaymentSchedule(client.id))}
                disabled={!!busy}
                className="px-4 py-1.5 rounded-full border border-[#D4C4A0] text-[#5A4A3A] text-sm font-semibold hover:bg-[#F0E8D8] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                Pause
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-[#C0B4A0] italic">No schedule</span>
              <button
                onClick={() => open('start')}
                disabled={!!busy}
                className="px-4 py-1.5 rounded-full bg-[#8B6FB8] text-white text-sm font-semibold hover:bg-[#7A5FA8] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {working ? '...' : 'Start'}
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl bg-[#F5EFE4] border border-[#E0D8C8] px-4 py-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#7A6B8A]">{editLabel[editing]}</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#D4C4A0] bg-white text-sm text-[#2D2438] focus:outline-none focus:border-[#8B6FB8]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={working || !date}
              className="px-4 py-2 rounded-full bg-[#2C4A14] text-white text-sm font-semibold hover:bg-[#1e3409] transition-colors cursor-pointer disabled:opacity-50"
            >
              {working ? '...' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(null)}
              disabled={working}
              className="px-4 py-2 rounded-full border border-[#D4C4A0] text-[#5A4A3A] text-sm font-medium hover:bg-[#F0E8D8] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
          {editing === 'paid' && date && p && (
            <p className="text-xs text-[#7A6B8A] basis-full sm:basis-auto">
              Next payment due {format(new Date(nextDueDate(p.due_date, date) + 'T00:00:00'), 'MMM d, yyyy')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

const editLabel = {
  paid: 'Paid on',
  due: 'Payment due',
  start: 'First payment due',
}

const saveError = {
  paid: 'Failed to mark as paid.',
  due: 'Failed to change the due date.',
  start: 'Failed to start payment schedule.',
}
