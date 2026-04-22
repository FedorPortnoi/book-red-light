import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signIn, getProfile } from '../utils/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import AuthHeader from '../components/AuthHeader.jsx'
import Field from '../components/Field.jsx'

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
      navigate(profile.status === 'approved' ? from : '/pending', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <img src="/images/hero-bg.jpg" alt="" aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover object-center -z-10 pointer-events-none select-none" />
      <div className="fixed inset-0 bg-white/60 -z-10 pointer-events-none" />

      <AuthHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-7">
            <h1 className="font-serif text-3xl text-[#2C4A14] mb-2">Welcome back</h1>
            <p className="text-[#7A6B8A] text-sm">Sign in to your account to book a session</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm border border-[#D4C4A0] rounded-2xl p-6 flex flex-col gap-4 shadow-[0_8px_40px_rgba(80,56,30,0.12)]">
            <Field label="Username" type="text" value={form.username} placeholder="your_username"
              onChange={(v) => setForm({ ...form, username: v })} />
            <Field label="Password" type="password" value={form.password} placeholder="••••••••"
              onChange={(v) => setForm({ ...form, password: v })} />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="mt-1 w-full py-4 bg-[#2C4A14] hover:bg-[#3A5A20] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer text-base">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A6B8A] mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#8B6FB8] hover:text-[#7A5FA8] font-medium">Register</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
