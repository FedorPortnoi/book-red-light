import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useSignOut } from '../hooks/useSignOut.js'

export default function Header() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const handleSignOut = useSignOut()

  return (
    <header className="w-full py-3 px-6 flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-[#E0D8C8] sticky top-0 z-40">
      <button
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 cursor-pointer"
      >
        <img
          src="/images/jens-logo.png"
          alt="Jen's LLC"
          className="h-12 w-auto object-contain"
        />
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-5 text-sm text-[#7A6B8A]">
          {profile?.is_admin && (
            <button onClick={() => navigate('/admin')} className="hover:text-[#2C4A14] transition-colors cursor-pointer font-medium">
              Admin
            </button>
          )}
          {profile?.is_admin && (
            <button onClick={() => navigate('/admin/clients')} className="hover:text-[#2C4A14] transition-colors cursor-pointer font-medium">
              Clients
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {profile && (
            <button
              onClick={() => navigate('/account')}
              className="text-sm text-[#8B6FB8] font-medium hover:text-[#2C4A14] transition-colors cursor-pointer"
            >
              @{profile.username}
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm px-4 py-1.5 rounded-full border border-[#D4C4A0] text-[#5A4A3A] hover:bg-[#F0E8D8] transition-colors cursor-pointer font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
