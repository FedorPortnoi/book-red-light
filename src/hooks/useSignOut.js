import { useNavigate } from 'react-router-dom'
import { signOut } from '../utils/auth.js'

export function useSignOut() {
  const navigate = useNavigate()
  return async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }
}
