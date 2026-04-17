import { Link } from 'react-router-dom'
import { signOut } from '../utils/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import DangerZone from '../components/DangerZone.jsx'

export default function Pending() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const isRejected = profile?.status === 'rejected'

  return (
    <div className="min-h-screen bg-[#FEFCFF] flex flex-col">
      <header className="w-full py-3 px-4 sm:px-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-[#E0D8C8]">
        <img src="/images/jens-logo.png" alt="Jen's LLC" className="h-11 w-auto object-contain" />
        <button onClick={handleSignOut}
          className="text-sm px-4 py-1.5 rounded-full border border-[#D4C4A0] text-[#5A4A3A] hover:bg-[#F0E8D8] transition-colors cursor-pointer font-medium">
          Sign out
        </button>
      </header>

      <main className="flex-1 px-6 py-16">
        <div className="w-full max-w-sm text-center mx-auto mb-12">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isRejected ? 'bg-red-50' : 'bg-[#F5F0F8]'}`}>
            {isRejected ? (
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-[#B8A5D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          {isRejected ? (
            <>
              <h1 className="font-serif text-3xl text-[#2D2438] mb-3">Account Not Approved</h1>
              <p className="text-[#7A6B8A] leading-relaxed mb-8">
                Unfortunately your registration was not approved. Please contact us if you believe this is a mistake.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-3xl text-[#2D2438] mb-3">Account Pending</h1>
              <p className="text-[#7A6B8A] leading-relaxed mb-8">
                Your account is pending approval.{profile?.full_name ? ` Hi ${profile.full_name.split(' ')[0]}! ` : ' '}
                You'll be able to book sessions as soon as an admin approves your registration.
              </p>
            </>
          )}

          <div className="bg-white border border-[#E8DFF0] rounded-2xl p-4 mb-6 text-sm text-[#7A6B8A]">
            <span className="font-medium text-[#2D2438]">Username: </span>{profile?.username}
          </div>

          <button
            onClick={handleSignOut}
            className="text-sm text-[#B8A5D9] hover:text-[#8B6FB8] transition-colors"
          >
            Sign out and use a different account
          </button>
        </div>

        <DangerZone />
      </main>
    </div>
  )
}
