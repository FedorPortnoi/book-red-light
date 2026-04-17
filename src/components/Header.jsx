import { useNavigate } from 'react-router-dom'
import { signOut } from '../utils/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="w-full py-6 px-6 flex items-center justify-between border-b border-[#E8DFF0]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#B8A5D9] flex items-center justify-center">
          <span className="text-white text-xs font-semibold">RL</span>
        </div>
        <span className="font-serif text-lg text-[#2D2438] tracking-wide">Red Light Studio</span>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden sm:flex items-center gap-5 text-sm text-[#7A6B8A]">
          {profile && (
            <a href="/#sessions" className="hover:text-[#8B6FB8] transition-colors">My Sessions</a>
          )}
          <a href="/#about" className="hover:text-[#8B6FB8] transition-colors">About</a>
          {profile?.is_admin && (
            <button onClick={() => navigate('/admin')} className="hover:text-[#8B6FB8] transition-colors cursor-pointer">
              Admin
            </button>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {profile && (
            <span className="hidden sm:block text-sm text-[#B8A5D9] font-mono">@{profile.username}</span>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-[#7A6B8A] hover:text-[#8B6FB8] transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
