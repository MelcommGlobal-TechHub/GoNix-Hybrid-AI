import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute() {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="edu-page">Loading your NEXORA account...</div>
  }

  if (!configured) {
    return (
      <div className="edu-page">
        <h1>Authentication unavailable</h1>
        <p>Firebase Authentication is not configured.</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return <Outlet />
}
