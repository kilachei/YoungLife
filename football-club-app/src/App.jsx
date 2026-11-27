import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Training from './pages/Training'
import Players from './pages/Players'
import Matches from './pages/Matches'
import Activities from './pages/Activities'
import MySheet from './pages/MySheet'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Public: anyone can view (edit buttons only show for the coach) */}
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="matches"    element={<Matches />} />
          <Route path="players"    element={<Players />} />
          <Route path="activities" element={<Activities />} />

          {/* Coach login required */}
          <Route element={<ProtectedRoute role="coach" />}>
            <Route path="training" element={<Training />} />
          </Route>

          {/* Player login required */}
          <Route element={<ProtectedRoute role="player" />}>
            <Route path="me" element={<MySheet />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}