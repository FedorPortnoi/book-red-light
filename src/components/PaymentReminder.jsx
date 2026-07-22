import { useState, useEffect } from 'react'
import { format, isBefore, startOfDay } from 'date-fns'
import { useAuth } from '../context/AuthContext.jsx'
import { getPendingPayment } from '../utils/payments.js'

export default function PaymentReminder() {
  const { profile } = useAuth()
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    if (!profile || profile.is_admin) return
    if (profile.payment_paused_at) return

    getPendingPayment(profile.id).then(data => {
      if (!data) return
      const key = `rl_pd_${data.id}`
      if (!sessionStorage.getItem(key)) setPayment(data)
    })
  }, [profile])

  function handleDismiss() {
    if (payment) sessionStorage.setItem(`rl_pd_${payment.id}`, '1')
    setPayment(null)
  }

  if (!payment) return null

  const dueDate = new Date(payment.due_date + 'T00:00:00')
  const isOverdue = isBefore(dueDate, startOfDay(new Date()))
  const dateLabel = format(dueDate, 'MMMM d')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-[#FDF8F0] rounded-2xl border border-[#D4C4A0] shadow-xl p-8 max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-full bg-[#F5EFE4] border border-[#D8CCF0] flex items-center justify-center mx-auto mb-5 text-xl">
          💛
        </div>
        <h2 className="font-serif text-xl text-[#2C4A14] mb-3">Payment Reminder</h2>
        <p className="text-[#5A4A3A] text-sm leading-relaxed mb-6">
          {isOverdue ? (
            <>Your payment was due <strong>{dateLabel}</strong> — please pay Jen when you get a chance.</>
          ) : (
            <>Your next payment will be due <strong>{dateLabel}</strong>.</>
          )}
        </p>
        <button
          onClick={handleDismiss}
          className="w-full py-2.5 rounded-full bg-[#2C4A14] text-white text-sm font-medium hover:bg-[#1e3409] transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
