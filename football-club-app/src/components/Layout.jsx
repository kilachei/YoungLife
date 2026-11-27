import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  MdDashboard, MdSportsFootball, MdPeople, MdEmojiEvents, MdCalendarToday,
  MdMenu, MdClose, MdLogout, MdLogin, MdPerson, MdAnnouncement,
} from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

// Change these to rebrand the app
const BRAND = { title: 'FC Manager', watermark: 'YLC', season: 'Season 2025/26' }

const publicNav = [
  { to: '/dashboard',  label: 'Dashboard', icon: MdDashboard },
  { to: '/matches',    label: 'Matches',   icon: MdEmojiEvents },
  { to: '/players',    label: 'Squad',     icon: MdPeople },
  { to: '/activities', label: 'Updates',   icon: MdAnnouncement },
]
const playerNav = [{ to: '/me', label: 'My Sheet', icon: MdPerson }, ...publicNav]
const coachNav = [
  { to: '/dashboard',  label: 'Dashboard',  icon: MdDashboard },
  { to: '/training',   label: 'Training',   icon: MdSportsFootball },
  { to: '/players',    label: 'Players',    icon: MdPeople },
  { to: '/matches',    label: 'Matches',    icon: MdEmojiEvents },
  { to: '/activities', label: 'Activities', icon: MdCalendarToday },
]

// Large, faint version of the club badge (same shield as Logo.jsx) behind the content
const SHIELD = 'M24 3 L42 9 V23 C42 33 34 41 24 45 C14 41 6 33 6 23 V9 Z'

function Watermark({ text }) {
  const label = String(text).slice(0, 3).toUpperCase()
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden lg:left-64" aria-hidden="true">
      <svg viewBox="0 0 48 48" className="h-[80vh] max-h-[680px] w-auto" role="presentation">
        <defs>
          {/* fades the badge out toward the bottom so it never competes with content */}
          <linearGradient id="wm-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0.16" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* outer shield */}
        <path d={SHIELD} fill="#38bdf8" fillOpacity="0.025" stroke="url(#wm-fade)"
          strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

        {/* inner shield */}
        <path d={SHIELD} fill="none" stroke="#38bdf8" strokeOpacity="0.07" strokeWidth="1"
          strokeLinejoin="round" vectorEffect="non-scaling-stroke"
          transform="translate(24 24) scale(0.84) translate(-24 -24)" />

        {/* initials */}
        <text x="24" y="25" textAnchor="middle" dominantBaseline="central"
          fontFamily="'Barlow Condensed', Impact, 'Arial Narrow', sans-serif"
          fontWeight="800" fontSize={label.length > 2 ? 14 : 17} letterSpacing="0.4"
          fill="#e0f2fe" fillOpacity="0.045"
          stroke="#7dd3fc" strokeOpacity="0.16" strokeWidth="1" vectorEffect="non-scaling-stroke">
          {label}
        </text>

        {/* thin rule under the initials, like a badge banner */}
        <path d="M16 31 H32" stroke="#38bdf8" strokeOpacity="0.14" strokeWidth="1"
          strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { user, isCoach, logout } = useAuth()

  const nav = isCoach ? coachNav : user ? playerNav : publicNav
  const subtitle = isCoach ? 'Coach Admin' : user ? 'Player Portal' : 'Club Website'
  const initials = user ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : ''
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200">
      <Watermark text={BRAND.watermark} />

      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-900
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between gap-3 border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <Logo size={38} text={BRAND.watermark} />
            <div className="leading-tight">
              <p className="font-semibold text-slate-50">{BRAND.title}</p>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-slate-400 hover:text-slate-100 lg:hidden">
            <MdClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-sky-300'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-r-full bg-sky-400" />}
                  <Icon className="text-xl" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">{BRAND.season}</div>
      </aside>

      <div className="relative z-10 flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-slate-300 hover:text-slate-50 lg:hidden">
              <MdMenu className="text-2xl" />
            </button>
            <p className="text-sm text-slate-400">{today}</p>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-sm text-slate-200">{user.name}</p>
                <p className="text-xs capitalize text-slate-500">{user.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-sky-300">
                {initials}
              </div>
              <button onClick={logout} aria-label="Log out"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300">
                <MdLogout className="text-xl" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signup"
                className="hidden rounded-lg border border-slate-700 px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 sm:inline-flex">
                Sign up
              </Link>
              <Link to="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-sky-400">
                <MdLogin /> Login
              </Link>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}