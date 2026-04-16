import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signIn, getProfile } from '../utils/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setProfile } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await signIn({ username: form.username.trim(), password: form.password })
      const profile = await getProfile(data.user.id)
      setProfile(profile)
      if (profile.status === 'approved') {
        navigate(from, { replace: true })
      } else {
        navigate('/pending', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FEFCFF] flex flex-col">
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#2D2438] mb-2">Welcome back</h1>
            <p className="text-[#7A6B8A] text-sm">Sign in to your account to book a session</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-[#E8DFF0] rounded-2xl p-6 flex flex-col gap-4">
            <Field
              label="Username"
              type="text"
              value={form.username}
              placeholder="your_username"
              onChange={(v) => setForm({ ...form, username: v })}
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              placeholder="••••••••"
              onChange={(v) => setForm({ ...form, password: v })}
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 bg-[#8B6FB8] hover:bg-[#7A5FA8] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A6B8A] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#8B6FB8] hover:text-[#7A5FA8] font-medium">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

function AuthHeader() {
  return (
    <header className="w-full py-6 px-6 flex items-center border-b border-[#E8DFF0]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#B8A5D9] flex items-center justify-center">
          <span className="text-white text-xs font-semibold">RL</span>
        </div>
        <span className="font-serif text-lg text-[#2D2438] tracking-wide">Red Light Studio</span>
      </div>
    </header>
  )
}

function Field({ label, type, value, placeholder, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2D2438] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[#E8DFF0] text-[#2D2438] placeholder-[#B8A5D9] bg-[#FEFCFF] focus:outline-none focus:ring-2 focus:ring-[#B8A5D9] focus:border-transparent transition-all"
      />
    </div>
  )
}
