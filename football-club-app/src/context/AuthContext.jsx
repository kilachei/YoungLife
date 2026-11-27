/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { usePlayers } from './PlayersContext'

// ---------------------------------------------------------------------------
// DEMO AUTH, frontend only. Anyone can read these in the browser, so this is
// NOT secure. When the Node backend exists, replace the body of `login` with
//   POST /api/auth/login  ->  { token, user: { role, name, playerId } }
// and let the server enforce roles (see the notes in the chat).
// ---------------------------------------------------------------------------
const COACH = { username: 'coach', password: 'coach123', name: 'Coach Maina' }
const PLAYER_PASSWORD = 'player123'
const SESSION_KEY = 'fc-manager:session'

// "John Makau" -> "john.makau"
export const usernameFor = (player) =>
  player.name.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.')

const loadSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { players } = usePlayers()
  const [user, setUser] = useState(loadSession)

  const startSession = (session) => {
    setUser(session)
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch { /* ignore */ }
    return { ok: true, user: session }
  }

  // async on purpose, so swapping in a real fetch() later changes nothing for callers
  const login = async (username, password) => {
    const u = username.trim().toLowerCase()

    if (u === COACH.username && password === COACH.password) {
      return startSession({ role: 'coach', name: COACH.name })
    }

    const player = players.find(p => usernameFor(p) === u)
    if (player && password === PLAYER_PASSWORD) {
      return startSession({ role: 'player', name: player.name, playerId: player.id })
    }

    return { ok: false, error: 'Wrong username or password.' }
  }

  const logout = () => {
    setUser(null)
    try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
  }

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      isCoach: user?.role === 'coach',
      isPlayer: user?.role === 'player',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}