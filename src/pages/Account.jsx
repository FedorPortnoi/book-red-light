import { useState, useEffect } from 'react'
import Header from '../components/Header.jsx'
import MySessions from '../components/MySessions.jsx'
import DangerZone from '../components/DangerZone.jsx'
import { getUserBookings } from '../utils/bookings.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Account() {
  const { profile } = useAuth()
  const [myBookings, setMyBookings] = useState([])
  const [loadingMyBookings, setLoadingMyBookings] = useState(true)

  useEffect(() => {
    if (!profile?.id) return
    setLoadingMyBookings(true)
    getUserBookings(profile.id)
      .then(setMyBookings)
      .catch(console.error)
      .finally(() => setLoadingMyBookings(false))
  }, [profile?.id])

  return (
    <div className="min-h-screen relative">
      {/* hero photo as fixed page background */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover object-center -z-10 pointer-events-none select-none"
      />
      <div className="fixed inset-0 bg-white/55 -z-10 pointer-events-none" />

      <Header />

      <div className="py-12 flex flex-col gap-8">
        <MySessions bookings={myBookings} loading={loadingMyBookings} />
        <DangerZone />
      </div>
    </div>
  )
}
