import { addMonths, format } from 'date-fns'
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

// Mark a payment as paid and insert next month's record.
export async function markPaid(paymentId, userId, dueDateStr) {
  const { error: updateError } = await supabase
    .from('payments')
    .update({ paid_at: new Date().toISOString() })
    .eq('id', paymentId)

  if (updateError) throw updateError

  const nextDue = addMonths(new Date(dueDateStr + 'T00:00:00'), 1)
  const nextDueStr = format(nextDue, 'yyyy-MM-dd')

  const { error: insertError } = await supabase
    .from('payments')
    .insert({ user_id: userId, due_date: nextDueStr })

  if (insertError) throw insertError
}

// Returns all approved non-admin profiles merged with their earliest unpaid payment.
export async function getAllClientsPayments() {
  const [{ data: profiles, error: profError }, { data: payments, error: payError }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, username')
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
