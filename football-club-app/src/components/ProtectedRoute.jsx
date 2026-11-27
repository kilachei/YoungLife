import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// <ProtectedRoute />            -> any logged-in user
// <ProtectedRoute role="coach" /> -> coach only (players are sent to their own page)
export default function ProtectedRoute({ role }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'coach' ? '/dashboard' : '/me'} replace />
  }
  return <Outlet />
}