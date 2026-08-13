import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../utils/auth.js'
import { sendNewAccountNotification } from '../utils/email.js'
import AuthHeader from '../components/AuthHeader.jsx'
import Field from '../components/Field.jsx'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(field) {
    return (v) => setForm((f) => ({ ...f, [field]: field === 'username' ? v.toLowerCase() : v }))
  }

  function validate() {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (!form.fullName.trim()) e.fullName = 'Name is required'
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
      const fullName = form.fullName.trim()
      const username = form.username.trim()
      const email = form.email.trim()
      await signUp({ username, password: form.password, fullName, email })
      sendNewAccountNotification({ fullName, username, email }).catch(() => {})
      navigate('/pending', { replace: true })
    } catch (err) {
      setErrors({ submit: (err.message?.includes('already registered') || err.message?.includes('unique'))
        ? 'Username or email already in use.' : err.message || 'Something went wrong.' })
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

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-7">
            <h1 className="font-serif text-3xl text-[#2C4A14] mb-2">Create an account</h1>
            <p className="text-[#7A6B8A] text-sm">You'll be able to book once your account is approved</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm border border-[#D4C4A0] rounded-2xl p-6 flex flex-col gap-4 shadow-[0_8px_40px_rgba(80,56,30,0.12)]">
            <Field label="Username" type="text" value={form.username} placeholder="your_username" error={errors.username} onChange={set('username')} />
            <Field label="Password" type="password" value={form.password} placeholder="••••••••" error={errors.password} onChange={set('password')} />
            <Field label="Name" type="text" value={form.fullName} placeholder="Your name" error={errors.fullName} onChange={set('fullName')} />
            <Field label="Email Address" type="email" value={form.email} placeholder="you@example.com" error={errors.email} onChange={set('email')} />

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

            <button type="submit" disabled={loading}
              className="mt-1 w-full py-4 bg-[#2C4A14] hover:bg-[#3A5A20] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer text-base">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A6B8A] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8B6FB8] hover:text-[#7A5FA8] font-medium">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
