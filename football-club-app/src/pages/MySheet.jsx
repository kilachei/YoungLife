import { MdSportsSoccer, MdAssistant, MdEventAvailable, MdEmojiEvents } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import { usePlayers } from '../context/PlayersContext'

const positionColors = {
  GK: 'badge-amber', CB: 'badge-blue', LB: 'badge-blue', RB: 'badge-blue',
  CM: 'badge-green', CAM: 'badge-green', CDM: 'badge-green',
  RW: 'badge-red', LW: 'badge-red', ST: 'badge-red',
}

export default function MySheet() {
  const { user } = useAuth()
  const { players } = usePlayers()

  const me = players.find(p => p.id === user.playerId)

  if (!me) {
    return (
      <div className="card text-center py-10 text-slate-400">
        Your player profile could not be found. Please ask the coach to check your registration.
      </div>
    )
  }

  const byGoals = [...players].sort((a, b) => b.goals - a.goals)
  const rank = byGoals.findIndex(p => p.id === me.id) + 1
  const initials = me.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const tiles = [
    { label: 'Goals',             value: me.goals,    icon: MdSportsSoccer,   color: 'text-green-400', bg: 'bg-green-500/15' },
    { label: 'Assists',           value: me.assists,  icon: MdAssistant,      color: 'text-blue-400',  bg: 'bg-blue-500/15'  },
    { label: 'Sessions attended', value: me.sessions, icon: MdEventAvailable, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { label: 'Scoring rank',      value: `#${rank}`,  icon: MdEmojiEvents,    color: 'text-purple-400',bg: 'bg-purple-500/15'},
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-green-400 font-medium">Player portal</p>
        <h1 className="text-3xl font-semibold text-white mt-1">My Sheet</h1>
      </div>

      <div className="rounded-2xl border border-green-500/25 p-6 bg-gradient-to-br from-green-600/25 via-green-900/20 to-transparent flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-green-500 text-white text-2xl font-bold flex items-center justify-center border-2 border-green-300/60 shadow-lg shadow-green-500/30">
          {initials}
        </div>
        <div>
          <p className="text-2xl font-semibold text-white">{me.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={positionColors[me.position] || 'badge-blue'}>{me.position}</span>
            <span className="text-sm text-slate-300">#{me.number}</span>
            <span className="text-sm text-slate-500">· {me.age} years</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`${color} text-xl`} />
            </div>
            <p className="text-4xl font-bold text-white mt-4 leading-none">{value}</p>
            <p className="text-sm text-slate-300 mt-2">{label}</p>
          </div>
        ))}
      </div>

      <div className="card text-sm text-slate-400">
        Training scores, fixtures, your lineup spot and the weekly training plan will appear here as the coach publishes them.
      </div>
    </div>
  )
}