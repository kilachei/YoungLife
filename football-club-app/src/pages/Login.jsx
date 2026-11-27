import { useState } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { MdPerson } from 'react-icons/md'
import AuthShell, { Field, TextInput, PasswordInput, submitClass } from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const justRegistered = !!location.state?.registered

  const [username, setUsername] = useState(location.state?.username || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={user.role === 'player' ? '/me' : '/dashboard'} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await login(username, password)
    setBusy(false)
    if (!res.ok) setError(res.error)
  }

  return (
    <AuthShell heading="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {justRegistered && (
          <p className="rounded-lg bg-sky-500/10 px-3 py-2 text-sm text-sky-300">
            Account created. Sign in to continue.
          </p>
        )}

        <Field id="username" label="Username">
          <TextInput id="username" icon={MdPerson} autoComplete="username" autoFocus={!justRegistered}
            value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. john.makau" />
        </Field>

        <Field id="password" label="Password">
          <PasswordInput id="password" autoComplete="current-password" autoFocus={justRegistered}
            value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
        </Field>

        {error && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

        <button type="submit" disabled={busy || !username || !password} className={submitClass}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        New player?{' '}
        <Link to="/signup" className="font-medium text-sky-400 transition-colors hover:text-sky-300">Create an account</Link>
      </p>

      <Link to="/dashboard" className="mt-4 block text-center text-sm text-slate-500 transition-colors hover:text-slate-300">
        ← Back to website
      </Link>
    </AuthShell>
  )
}