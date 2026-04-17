import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase.js'
import { getProfile } from '../utils/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function clearBrokenSession() {
      await supabase.auth.signOut().catch(() => {})
      setUser(null)
      setProfile(null)
    }

    function isMissingProfileError(error) {
      return error?.code === 'PGRST116'
    }

    async function syncSession(session) {
      setUser(session?.user ?? null)

      if (!session?.user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const nextProfile = await getProfile(session.user.id)
        setProfile(nextProfile)
      } catch (error) {
        console.error(error)
        if (isMissingProfileError(error)) {
          await clearBrokenSession()
        } else {
          setProfile(null)
        }
      } finally {
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true)
      syncSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, setProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
