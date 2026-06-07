import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isBefore, isAfter, addDays, startOfDay } from 'date-fns'
import { useSignOut } from '../hooks/useSignOut.js'
import { getAllClientsPayments, markPaid } from '../utils/payments.js'

export default function AdminClients() {
  const navigate = useNavigate()
  const handleSignOut = useSignOut()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(null)
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

  async function handleMarkPaid(client) {
    if (!client.payment || paying) return
    setPaying(client.payment.id)
    try {
      await markPaid(client.payment.id, client.id, client.payment.due_date)
      await load()
    } catch (e) {
      setError('Failed to mark as paid.')
    } finally {
      setPaying(null)
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
        <p className="text-[#7A6B8A] text-sm mb-8">Mark a payment received to clear the client's reminder until next month.</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[#B8A5D9] font-serif italic">Loading…</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16 text-[#B8A5D9] font-serif italic">No approved clients yet.</div>
        ) : (
          <div className="bg-[#FDF8F0] rounded-2xl border border-[#D4C4A0] divide-y divide-[#EDE5D8]">
            {clients.map(client => {
              const p = client.payment
              const dueDate = p ? new Date(p.due_date + 'T00:00:00') : null
              const overdue = dueDate && isBefore(dueDate, today)
              const soon = dueDate && !overdue && !isAfter(dueDate, soonCutoff)

              return (
                <div key={client.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[#2C4A14] truncate">{client.full_name}</p>
                    <p className="text-xs text-[#7A6B8A] mt-0.5">@{client.username}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {p ? (
                      <>
                        <span className={`text-sm font-medium whitespace-nowrap ${
                          overdue ? 'text-red-500' : soon ? 'text-amber-600' : 'text-[#5A4A3A]'
                        }`}>
                          {overdue ? 'Overdue · ' : 'Due '}{format(dueDate, 'MMM d')}
                        </span>
                        <button
                          onClick={() => handleMarkPaid(client)}
                          disabled={!!paying}
                          className="px-5 py-1.5 rounded-full bg-[#2C4A14] text-white text-sm font-semibold hover:bg-[#1e3409] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                          {paying === p.id ? '…' : 'PAID'}
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-[#C0B4A0] italic">No schedule</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
