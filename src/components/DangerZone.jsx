import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteOwnAccount, signOut } from '../utils/auth.js'

export default function DangerZone() {
  const navigate = useNavigate()
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDeleteAccount() {
    if (confirmText !== 'DELETE') return

    setDeleting(true)
    setError('')

    try {
      await deleteOwnAccount()
      await signOut().catch(() => {})
      navigate('/register', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not delete account. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-6 pb-24">
      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 sm:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Danger Zone
          </div>
          <h2 className="font-serif text-3xl text-[#2D2438]">Delete account and booking history</h2>
          <p className="max-w-2xl text-[#7A6B8A]">
            This permanently removes your profile, all sessions tied to your account, and your ability to sign in with this account again.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#2D2438]">Type <span className="font-mono">DELETE</span> to confirm</span>
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="DELETE"
              className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-[#2D2438] placeholder-[#D8A7A7] focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#7A6B8A]">
              This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={confirmText !== 'DELETE' || deleting}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? 'Deleting account…' : 'Delete My Account'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
