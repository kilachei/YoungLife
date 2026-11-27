import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  MdPeople, MdSportsFootball, MdEmojiEvents, MdTrendingUp,
  MdCalendarToday, MdAdd, MdArrowForward, MdPersonAdd,
} from 'react-icons/md'
import { usePlayers } from '../context/PlayersContext'
import { useAuth } from '../context/AuthContext'

// Static until Matches / Training pages share their data. Dates are ISO strings.
const CLUB = 'YLC'
const recentSessions = [
  { date: '2026-11-10', type: 'Tactical',  attendance: 20, duration: 90 },
  { date: '2026-11-08', type: 'Fitness',   attendance: 22, duration: 60 },
  { date: '2026-11-06', type: 'Scrimmage', attendance: 18, duration: 90 },
  { date: '2026-11-04', type: 'Technical', attendance: 21, duration: 75 },
]
const upcomingMatches = [
  { date: '2026-11-15', opponent: 'Nairobi FC',    type: 'League',   venue: 'Home' },
  { date: '2026-11-22', opponent: 'Mombasa Stars', type: 'Friendly', venue: 'Away' },
  { date: '2026-11-29', opponent: 'Kisumu United', type: 'League',   venue: 'Home' },
]
const recentForm = ['W', 'W', 'D', 'W', 'L']
const matchesPlayed = 8
const winRate = 75

// Palette: slate base, sky as the single accent, amber + rose used sparingly.
const GROUPS = [
  { label: 'Goalkeepers', positions: ['GK'],               hex: '#fbbf24' },
  { label: 'Defenders',   positions: ['CB', 'LB', 'RB'],   hex: '#38bdf8' },
  { label: 'Midfielders', positions: ['CDM', 'CM', 'CAM'], hex: '#818cf8' },
  { label: 'Forwards',    positions: ['RW', 'LW', 'ST'],   hex: '#fb7185' },
]

// Local style tokens so the page doesn't depend on the old green-tinted global classes.
const ui = {
  card: 'rounded-xl border border-slate-800 bg-slate-900 p-5',
  h2: 'text-sm font-semibold text-slate-100',
  th: 'py-2 px-3 text-left text-xs font-medium text-slate-500',
  td: 'py-3 px-3 text-sm',
  btnPrimary: 'inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-sky-400',
  btnSecondary: 'inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800',
}
const badgeBase = 'inline-block rounded-md px-2 py-0.5 text-xs font-medium'
const badge = {
  sky:   `${badgeBase} bg-sky-500/10 text-sky-300`,
  slate: `${badgeBase} bg-slate-700/50 text-slate-300`,
  amber: `${badgeBase} bg-amber-400/10 text-amber-300`,
  rose:  `${badgeBase} bg-rose-500/10 text-rose-300`,
}

const sessionBadge = { Tactical: badge.sky, Fitness: badge.amber, Scrimmage: badge.rose, Technical: badge.slate }
const matchTypeBadge = (t) => (t === 'League' ? badge.sky : badge.slate)
const venueBadge = (v) => (v === 'Home' ? badge.sky : badge.slate)
const formStyle = {
  W: 'bg-sky-500/15 text-sky-300',
  D: 'bg-slate-700/60 text-slate-300',
  L: 'bg-rose-500/15 text-rose-300',
}

const fmtDate = (iso, opts) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', opts)
const daysUntil = (iso) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.round((new Date(`${iso}T00:00:00`) - today) / 86400000)
}
const countdown = (n) => (n < 0 ? 'Played' : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`)
const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function Crest({ label, highlight }) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full border text-lg font-semibold
        ${highlight ? 'border-sky-400/60 bg-sky-500/15 text-sky-200' : 'border-slate-700 bg-slate-800 text-slate-200'}`}>
        {initials(label)}
      </div>
      <p className="text-xs leading-tight text-slate-400">{label}</p>
    </div>
  )
}

function Donut({ groups, total }) {
  const C = 2 * Math.PI * 40
  let offset = 0
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
        {groups.map(g => {
          if (!g.count) return null
          const len = (g.count / total) * C
          const el = (
            <circle key={g.label} cx="50" cy="50" r="40" fill="none" stroke={g.hex} strokeWidth="12"
              strokeDasharray={`${Math.max(len - 1.5, 0)} ${C - Math.max(len - 1.5, 0)}`}
              strokeDashoffset={-offset} />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-semibold leading-none text-slate-50">{total}</p>
        <p className="mt-1 text-xs text-slate-500">players</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { players } = usePlayers()
  const { user, isCoach } = useAuth()
  const canSeeTraining = !!user // training info is for logged-in players and the coach

  const { totalGoals, topScorers, groups } = useMemo(() => ({
    totalGoals: players.reduce((s, p) => s + p.goals, 0),
    topScorers: [...players].sort((a, b) => b.goals - a.goals).filter(p => p.goals > 0).slice(0, 4),
    groups: GROUPS.map(g => ({ ...g, count: players.filter(p => g.positions.includes(p.position)).length })),
  }), [players])

  const avgAttendance = Math.round(recentSessions.reduce((s, x) => s + x.attendance, 0) / recentSessions.length)

  const stats = [
    { label: 'Total Players',       value: players.length, hint: `${totalGoals} goals scored`,      icon: MdPeople,         color: 'text-sky-300' },
    { label: 'Sessions This Month', value: 12,             hint: `Avg attendance ${avgAttendance}`, icon: MdSportsFootball, color: 'text-indigo-300' },
    { label: 'Matches Played',      value: matchesPlayed,  hint: 'Season 2025/26',                  icon: MdEmojiEvents,    color: 'text-amber-300' },
    { label: 'Win Rate',            value: `${winRate}%`,  hint: `${Math.round(matchesPlayed * winRate / 100)} wins from ${matchesPlayed}`, icon: MdTrendingUp, color: 'text-rose-300' },
  ]

  const visibleStats = stats.filter(s => canSeeTraining || s.label !== 'Sessions This Month')
  const [next, ...later] = upcomingMatches
  const home = next.venue === 'Home'
  const maxGoals = topScorers[0]?.goals || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-400">{greeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-50">Club Overview</h1>
          <p className="mt-1 text-sm text-slate-400">Today's snapshot — season 2025/26</p>
        </div>
        <div className="flex items-center gap-2">
          {isCoach && <Link to="/players" className={ui.btnPrimary}><MdAdd /> Add Player</Link>}
          <Link to="/matches" className={ui.btnSecondary}>Fixtures <MdArrowForward /></Link>
        </div>
      </div>

      {/* Sign-up prompt for visitors who aren't logged in */}
      {!user && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-400/20 bg-sky-500/5 p-4">
          <div>
            <p className="text-sm font-medium text-slate-100">Play for {CLUB}?</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Create a player account to see your stats, training sessions and club updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/signup" className={ui.btnPrimary}><MdPersonAdd /> Sign up</Link>
            <Link to="/login" className={ui.btnSecondary}>Log in</Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className={`grid grid-cols-2 ${canSeeTraining ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
        {visibleStats.map(({ label, value, hint, icon: Icon, color }) => (
          <div key={label} className={ui.card}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                <Icon className={`${color} text-lg`} />
              </div>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
            <p className="mt-4 text-3xl font-semibold leading-none text-slate-50">{value}</p>
            <p className="mt-2 truncate text-xs text-slate-500">{hint}</p>
          </div>
        ))}
      </div>

      {/* Next match + squad */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className={`${ui.card} lg:col-span-2`}>
          <div className="flex items-center justify-between">
            <h2 className={ui.h2}>Next Match</h2>
            <span className={badge.amber}>{countdown(daysUntil(next.date))}</span>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 sm:gap-12">
            <Crest label={home ? CLUB : next.opponent} highlight={home} />
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-600">VS</p>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-300">
                <MdCalendarToday className="text-slate-500" /> {fmtDate(next.date, { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className={matchTypeBadge(next.type)}>{next.type}</span>
                <span className={venueBadge(next.venue)}>{next.venue}</span>
              </div>
            </div>
            <Crest label={home ? next.opponent : CLUB} highlight={!home} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500">Recent form</p>
            <div className="flex gap-1.5">
              {recentForm.map((r, i) => (
                <span key={i} className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${formStyle[r]}`}>{r}</span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-1 text-xs text-slate-500">After that</p>
            {later.map(m => (
              <div key={m.date} className="flex items-center justify-between border-b border-slate-800 py-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-100">{m.opponent}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {fmtDate(m.date, { day: 'numeric', month: 'short', year: 'numeric' })} · {countdown(daysUntil(m.date)).toLowerCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={matchTypeBadge(m.type)}>{m.type}</span>
                  <span className={venueBadge(m.venue)}>{m.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={ui.card}>
          <h2 className={`${ui.h2} mb-5`}>Squad Makeup</h2>
          {players.length === 0 ? (
            <p className="text-sm text-slate-400">Add players to see how your squad is balanced.</p>
          ) : (
            <>
              <Donut groups={groups} total={players.length} />
              <ul className="mt-6 space-y-3">
                {groups.map(g => (
                  <li key={g.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.hex }} />
                      {g.label}
                    </span>
                    <span className="font-semibold text-slate-100">{g.count}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Training + top scorers */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {canSeeTraining && (
          <div className={`${ui.card} lg:col-span-2`}>
            <h2 className={`${ui.h2} mb-3`}>Recent Training Sessions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className={`${ui.th} pl-0`}>Date</th>
                    <th className={ui.th}>Type</th>
                    <th className={ui.th}>Attendance</th>
                    <th className={ui.th}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map(s => (
                    <tr key={s.date} className="border-b border-slate-800/60 last:border-0">
                      <td className={`${ui.td} pl-0 text-slate-300`}>{fmtDate(s.date, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className={ui.td}><span className={sessionBadge[s.type] || badge.slate}>{s.type}</span></td>
                      <td className={ui.td}>
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-slate-200">{s.attendance}</span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
                            <div className="h-full rounded-full bg-sky-400"
                              style={{ width: `${Math.min(100, (s.attendance / Math.max(players.length, 1)) * 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className={`${ui.td} text-slate-400`}>{s.duration} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={`${ui.card} ${canSeeTraining ? '' : 'lg:col-span-3'}`}>
          <h2 className={`${ui.h2} mb-4`}>Top Scorers</h2>
          {topScorers.length === 0 ? (
            <p className="text-sm text-slate-400">No goals recorded yet.</p>
          ) : (
            <ul className="space-y-4">
              {topScorers.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold
                    ${i === 0 ? 'border-amber-400/40 bg-amber-400/10 text-amber-300' : 'border-slate-700 bg-slate-800 text-slate-300'}`}>
                    {initials(p.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium text-slate-100">{p.name}</span>
                      <span className="font-semibold text-sky-300">{p.goals}<span className="text-xs font-normal text-slate-500"> G</span></span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-sky-400" style={{ width: `${(p.goals / maxGoals) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{p.assists} assists · {p.position}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}