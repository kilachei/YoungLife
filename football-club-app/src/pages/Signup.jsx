import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { MdPerson, MdAlternateEmail } from 'react-icons/md'
import AuthShell, { Field, TextInput, PasswordInput, submitClass } from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

// "John Makau" -> "john.makau"
const suggestUsername = (name) =>
  name.trim().toLowerCase().split(/\s+/).filter(Boolean).join('.').replace(/[^a-z0-9._-]/g, '')

export default function Signup() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameEdited, setUsernameEdited] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={user.role === 'player' ? '/me' : '/dashboard'} replace />

  const handleName = (value) => {
    setName(value)
    // keep the username in step with the name until the person edits it themselves
    if (!usernameEdited) setUsername(suggestUsername(value))
  }

  const validate = () => {
    if (name.trim().length < 2) return 'Please enter your full name.'
    if (!/^[a-z0-9._-]{3,}$/.test(username)) return 'Username must be 3+ characters: lowercase letters, numbers, dots, dashes or underscores.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (password !== confirm) return 'Passwords do not match.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const problem = validate()
    if (problem) return setError(problem)

    setError('')
    setBusy(true)
    const res = await signup({ name: name.trim(), username, password })
    setBusy(false)

    if (!res.ok) return setError(res.error)
    navigate('/login', { replace: true, state: { registered: true, username } })
  }

  const ready = name && username && password && confirm

  return (
    <AuthShell heading="Create your account" subtitle="Join the club as a player">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field id="name" label="Full name">
          <TextInput id="name" icon={MdPerson} autoComplete="name" autoFocus
            value={name} onChange={e => handleName(e.target.value)} placeholder="e.g. John Makau" />
        </Field>

        <Field id="username" label="Username">
          <TextInput id="username" icon={MdAlternateEmail} autoComplete="username"
            value={username}
            onChange={e => { setUsername(e.target.value.toLowerCase()); setUsernameEdited(true) }}
            placeholder="john.makau" />
        </Field>

        <Field id="password" label="Password">
          <PasswordInput id="password" autoComplete="new-password"
            value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </Field>

        <Field id="confirm" label="Confirm password">
          <PasswordInput id="confirm" autoComplete="new-password"
            value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" />
        </Field>

        {error && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

        <button type="submit" disabled={busy || !ready} className={submitClass}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-sky-400 transition-colors hover:text-sky-300">Sign in</Link>
      </p>

      <Link to="/dashboard" className="mt-4 block text-center text-sm text-slate-500 transition-colors hover:text-slate-300">
        ← Back to website
      </Link>
    </AuthShell>
  )
}