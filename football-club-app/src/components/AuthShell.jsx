import { useState } from 'react'
import {
  MdPeople, MdEmojiEvents, MdSportsFootball, MdLock, MdVisibility, MdVisibilityOff,
} from 'react-icons/md'
import Logo from './Logo'

export const BRAND = { title: 'FC Manager', watermark: 'YLC', season: 'Season 2025/26' }

const FEATURES = [
  { icon: MdPeople,         title: 'Squad & stats',      text: 'Player profiles, goals and assists.' },
  { icon: MdEmojiEvents,    title: 'Fixtures & results', text: 'Upcoming matches and recent form.' },
  { icon: MdSportsFootball, title: 'Training updates',   text: 'Sessions and attendance at a glance.' },
]

// Same shield as Logo.jsx / Layout.jsx
const SHIELD = 'M24 3 L42 9 V23 C42 33 34 41 24 45 C14 41 6 33 6 23 V9 Z'

// Large, faint club badge used as artwork on the brand panel
function ShieldArt({ text, className = '' }) {
  const label = String(text).slice(0, 3).toUpperCase()
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" role="presentation">
      <defs>
        <linearGradient id="auth-shield-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill="#38bdf8" fillOpacity="0.03" stroke="url(#auth-shield-fade)"
        strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={SHIELD} fill="none" stroke="#38bdf8" strokeOpacity="0.1" strokeWidth="1"
        strokeLinejoin="round" vectorEffect="non-scaling-stroke"
        transform="translate(24 24) scale(0.84) translate(-24 -24)" />
      <text x="24" y="25" textAnchor="middle" dominantBaseline="central"
        fontFamily="'Barlow Condensed', Impact, 'Arial Narrow', sans-serif"
        fontWeight="800" fontSize={label.length > 2 ? 14 : 17} letterSpacing="0.4"
        fill="#e0f2fe" fillOpacity="0.05"
        stroke="#7dd3fc" strokeOpacity="0.22" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {label}
      </text>
      <path d="M16 31 H32" stroke="#38bdf8" strokeOpacity="0.2" strokeWidth="1"
        strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/* ---------- shared form pieces ---------- */

const inputBase =
  'w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 text-sm text-slate-100 ' +
  'placeholder:text-slate-600 transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400'

export const inputClass = `${inputBase} px-3`

export const submitClass =
  'w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition-colors ' +
  'hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50'

export function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  )
}

export function TextInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500" />}
      <input {...props} className={`${inputBase} ${Icon ? 'pl-10 pr-3' : 'px-3'}`} />
    </div>
  )
}

export function PasswordInput(props) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <MdLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500" />
      <input {...props} type={show ? 'text' : 'password'} className={`${inputBase} pl-10 pr-10`} />
      <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-slate-200">
        {show ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
      </button>
    </div>
  )
}

/* ---------- page shell ---------- */

export default function AuthShell({ heading, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-slate-950 text-slate-200 lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-12 lg:flex">
        <ShieldArt text={BRAND.watermark} className="pointer-events-none absolute -bottom-36 -right-28 h-[640px] w-auto" />

        <div className="relative flex items-center gap-3">
          <Logo size={44} text={BRAND.watermark} />
          <p className="text-lg font-semibold text-slate-50">{BRAND.title}</p>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight text-slate-50">Your club, all in one place.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Fixtures, squad stats and training updates, kept up to date for the whole team.
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                  <Icon className="text-lg text-sky-300" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-slate-100">{title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">{BRAND.watermark} · {BRAND.season}</p>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* logo shows here on mobile, where the brand panel is hidden */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo size={40} text={BRAND.watermark} />
            <p className="text-lg font-semibold text-slate-50">{BRAND.title}</p>
          </div>

          <h1 className="text-2xl font-semibold text-slate-50">{heading}</h1>
          <p className="mb-6 mt-1 text-sm text-slate-400">{subtitle}</p>

          {children}
        </div>
      </main>
    </div>
  )
}