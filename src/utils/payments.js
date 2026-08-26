import { addDays, addMonths, format } from 'date-fns'
import { supabase } from './supabase.js'

// Returns the earliest unpaid payment due within 3 days (or overdue), or null.
export async function getPendingPayment(userId) {
  const windowDate = new Date()
  windowDate.setDate(windowDate.getDate() + 3)
  const windowStr = format(windowDate, 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('payments')
    .select('id, due_date')
    .eq('user_id', userId)
    .is('paid_at', null)
    .lte('due_date', windowStr)
    .order('due_date', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) return null
  return data
}

// The date a payment cycle rolls over to.
// If the client pays on time, the next cycle starts from the scheduled due date.
// If they pay past due, the next cycle starts from the day they actually paid.
export function nextDueDate(dueDateStr, paidOnStr) {
  const dueDate = new Date(dueDateStr + 'T00:00:00')
  const paidDate = new Date(paidOnStr + 'T00:00:00')
  const cycleStart = paidDate > dueDate ? paidDate : dueDate
  return format(addMonths(cycleStart, 1), 'yyyy-MM-dd')
}

export function today() {
  return format(new Date(), 'yyyy-MM-dd')
}

// Mark a payment as paid on paidOnStr (yyyy-MM-dd) and insert the next record.
export async function markPaid(paymentId, userId, dueDateStr, paidOnStr) {
  const paidOn = paidOnStr || today()

  const { error: updateError } = await supabase
    .from('payments')
    .update({ paid_at: new Date(paidOn + 'T12:00:00').toISOString() })
    .eq('id', paymentId)

  if (updateError) throw updateError

  const { error: insertError } = await supabase
    .from('payments')
    .insert({ user_id: userId, due_date: nextDueDate(dueDateStr, paidOn) })

  if (insertError) throw insertError
}

// Move an existing client's outstanding due date.
export async function setDueDate(paymentId, dueDateStr) {
  const { error } = await supabase
    .from('payments')
    .update({ due_date: dueDateStr })
    .eq('id', paymentId)

  if (error) throw error
}

export async function pausePaymentSchedule(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ payment_paused_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw error
}

export function defaultResumeDate() {
  return format(addDays(new Date(), 30), 'yyyy-MM-dd')
}

export async function resumePaymentSchedule(userId, dueDateStr) {
  const nextDueStr = dueDateStr || defaultResumeDate()

  const { data: currentPayment, error: selectError } = await supabase
    .from('payments')
    .select('id')
    .eq('user_id', userId)
    .is('paid_at', null)
    .order('due_date', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (selectError) throw selectError

  if (currentPayment) {
    const { error: updateError } = await supabase
      .from('payments')
      .update({ due_date: nextDueStr })
      .eq('id', currentPayment.id)

    if (updateError) throw updateError
  } else {
    const { error: insertError } = await supabase
      .from('payments')
      .insert({ user_id: userId, due_date: nextDueStr })

    if (insertError) throw insertError
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ payment_paused_at: null })
    .eq('id', userId)

  if (profileError) throw profileError
}

// Returns all approved non-admin profiles merged with their earliest unpaid payment.
export async function getAllClientsPayments() {
  const [{ data: profiles, error: profError }, { data: payments, error: payError }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, username, payment_paused_at')
        .eq('status', 'approved')
        .eq('is_admin', false)
        .order('full_name'),
      supabase
        .from('payments')
        .select('id, user_id, due_date')
        .is('paid_at', null)
        .order('due_date', { ascending: true }),
    ])

  if (profError) throw profError
  if (payError) throw payError

  return (profiles || []).map(profile => ({
    ...profile,
    payment: (payments || []).find(p => p.user_id === profile.id) || null,
  }))
}
