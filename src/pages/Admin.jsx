import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase.js'
import { signOut } from '../utils/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import { format } from 'date-fns'

export default function Admin() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')

  useEffect(() => {
    loadProfiles()
  }, [])

  async function loadProfiles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProfiles(data)
    setLoading(false)
  }

  async function updateStatus(profileId, newStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({
        status: newStatus,
        approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', profileId)
    if (!error) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? { ...p, status: newStatus, approved_at: newStatus === 'approved' ? new Date().toISOString() : null }
            : p
        )
      )
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const filtered = profiles.filter((p) => {
    if (tab === 'pending') return p.status === 'pending'
    if (tab === 'approved') return p.status === 'approved'
    if (tab === 'rejected') return p.status === 'rejected'
    return true
  })

  const pendingCount = profiles.filter((p) => p.status === 'pending').length

  return (
    <div className="min-h-screen bg-[#FEFCFF]">
      <header className="w-full py-6 px-6 flex items-center justify-between border-b border-[#E8DFF0]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B8A5D9] flex items-center justify-center">
            <span className="text-white text-xs font-semibold">RL</span>
          </div>
          <span className="font-serif text-lg text-[#2D2438] tracking-wide">Red Light Studio</span>
          <span className="text-xs px-2 py-0.5 bg-[#B8A5D9]/20 text-[#8B6FB8] rounded-full font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-sm text-[#7A6B8A] hover:text-[#8B6FB8] transition-colors cursor-pointer">
            Booking App
          </button>
          <button onClick={handleSignOut} className="text-sm text-[#7A6B8A] hover:text-[#8B6FB8] transition-colors cursor-pointer">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#2D2438] mb-1">Registrations</h1>
          <p className="text-[#7A6B8A] text-sm">Approve or reject new accounts — logged in as {profile?.username}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#F5F0F8] rounded-xl p-1 w-fit">
          {[
            { id: 'pending', label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === t.id
                  ? 'bg-white text-[#8B6FB8] shadow-sm'
                  : 'text-[#7A6B8A] hover:text-[#8B6FB8]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#B8A5D9]">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#B8A5D9]">
            <p>No {tab} registrations.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((p) => (
              <ProfileCard key={p.id} profile={p} onUpdateStatus={updateStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function ProfileCard({ profile, onUpdateStatus }) {
  const [acting, setActing] = useState(false)

  async function handle(status) {
    setActing(true)
    await onUpdateStatus(profile.id, status)
    setActing(false)
  }

  return (
    <div className="bg-white border border-[#E8DFF0] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#2D2438]">{profile.full_name}</span>
            <span className="text-xs text-[#B8A5D9] font-mono">@{profile.username}</span>
            <StatusBadge status={profile.status} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-[#7A6B8A]">
            <span>{profile.email}</span>
            <span>{profile.phone}</span>
          </div>
          <span className="text-xs text-[#B8A5D9]">
            Registered {format(new Date(profile.created_at), 'MMM d, yyyy · HH:mm')}
          </span>
        </div>

        {profile.status === 'pending' && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handle('approved')}
              disabled={acting}
              className="px-4 py-2 bg-[#8B6FB8] hover:bg-[#7A5FA8] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => handle('rejected')}
              disabled={acting}
              className="px-4 py-2 border border-[#E8DFF0] hover:border-red-300 text-[#7A6B8A] hover:text-red-500 text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              Reject
            </button>
          </div>
        )}

        {profile.status !== 'pending' && (
          <button
            onClick={() => handle('pending')}
            disabled={acting}
            className="px-3 py-1.5 border border-[#E8DFF0] text-[#B8A5D9] hover:text-[#7A6B8A] text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-50 text-amber-600',
    approved: 'bg-green-50 text-green-600',
    rejected: 'bg-red-50 text-red-500',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}
