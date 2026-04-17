import { supabase } from './supabase.js'

export async function signUp({ username, password, fullName, phone, email }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username,
    full_name: fullName,
    phone,
    email,
  })
  if (profileError) throw profileError

  return data
}

export async function signIn({ username, password }) {
  const { data: email, error: lookupError } = await supabase
    .rpc('get_email_by_username', { p_username: username })
  if (lookupError || !email) throw new Error('Username not found')

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function deleteOwnAccount() {
  const { error } = await supabase.rpc('delete_own_account')
  if (error) throw error
}
