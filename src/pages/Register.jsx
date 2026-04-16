import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../utils/auth.js'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', fullName: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(field) {
    return (v) => setForm((f) => ({ ...f, [field]: v }))
  }

  function validate() {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    else if (!/^[a-z0-9_]{3,20}$/.test(form.username)) e.username = 'Lowercase letters, numbers, underscores. 3–20 chars.'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      await signUp({
        username: form.username.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      })
      navigate('/pending', { replace: true })
    } catch (err) {
      if (err.message?.includes('already registered') || err.message?.includes('unique')) {
        setErrors({ submit: 'Username or email already in use.' })
      } else {
        setErrors({ submit: err.message || 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FEFCFF] flex flex-col">
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#2D2438] mb-2">Create an account</h1>
            <p className="text-[#7A6B8A] text-sm">You'll be able to book once your account is approved</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-[#E8DFF0] rounded-2xl p-6 flex flex-col gap-4">
            <Field label="Username" type="text" value={form.username} placeholder="your_username" error={errors.username} onChange={set('username')} />
            <Field label="Password" type="password" value={form.password} placeholder="••••••••" error={errors.password} onChange={set('password')} />
            <Field label="Full Name" type="text" value={form.fullName} placeholder="Your full name" error={errors.fullName} onChange={set('fullName')} />
            <Field label="Phone Number" type="tel" value={form.phone} placeholder="+7 999 123 4567" error={errors.phone} onChange={set('phone')} />
            <Field label="Email Address" type="email" value={form.email} placeholder="you@example.com" error={errors.email} onChange={set('email')} />

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 bg-[#8B6FB8] hover:bg-[#7A5FA8] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A6B8A] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8B6FB8] hover:text-[#7A5FA8] font-medium">
              Sign in
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

function Field({ label, type, value, placeholder, error, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2D2438] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border text-[#2D2438] placeholder-[#B8A5D9] bg-[#FEFCFF] focus:outline-none focus:ring-2 focus:ring-[#B8A5D9] focus:border-transparent transition-all ${error ? 'border-red-400' : 'border-[#E8DFF0]'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
