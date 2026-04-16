import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Cancel from './pages/Cancel.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Pending from './pages/Pending.jsx'
import Admin from './pages/Admin.jsx'

function Spinner() {
  return (
    <div className="min-h-screen bg-[#FEFCFF] flex items-center justify-center">
      <div className="text-[#B8A5D9] font-serif text-lg">Loading…</div>
    </div>
  )
}

function RequireApproved({ children }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  if (!profile) return <Spinner />
  if (profile.status === 'pending' || profile.status === 'rejected') return <Navigate to="/pending" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user || !profile?.is_admin) return <Navigate to="/" replace />
  return children
}

function GuestOnly({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <Spinner />
  if (user && profile) {
    return profile.status === 'approved'
      ? <Navigate to="/" replace />
      : <Navigate to="/pending" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/" element={<RequireApproved><Home /></RequireApproved>} />
          <Route path="/confirmation" element={<RequireApproved><Confirmation /></RequireApproved>} />
          <Route path="/cancel" element={<RequireApproved><Cancel /></RequireApproved>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
