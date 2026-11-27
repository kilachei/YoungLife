import { useState } from 'react'
import { MdAdd, MdCheck, MdClose } from 'react-icons/md'

const initialPlayers = [
  { id: 1,  name: 'James Otieno',   number: 1,  position: 'GK'  },
  { id: 2,  name: 'Brian Kamau',    number: 4,  position: 'CB'  },
  { id: 3,  name: 'Kevin Mwangi',   number: 5,  position: 'CB'  },
  { id: 4,  name: 'Samuel Ochieng', number: 3,  position: 'LB'  },
  { id: 5,  name: 'David Kiprop',   number: 2,  position: 'RB'  },
  { id: 6,  name: 'Peter Njoroge',  number: 6,  position: 'CM'  },
  { id: 7,  name: 'Eric Waweru',    number: 8,  position: 'CM'  },
  { id: 8,  name: 'Felix Omondi',   number: 10, position: 'CAM' },
  { id: 9,  name: 'Moses Kimani',   number: 7,  position: 'RW'  },
  { id: 10, name: 'Victor Abuya',   number: 11, position: 'LW'  },
  { id: 11, name: 'John Makau',     number: 9,  position: 'ST'  },
]

const pastSessions = [
  { date: '08 Nov 2026', type: 'Fitness',   activities: 'Sprints, Ladders, Core',  attendance: 10, notes: 'High intensity day' },
  { date: '06 Nov 2026', type: 'Scrimmage', activities: '11v11, Set pieces',        attendance: 11, notes: 'Good team shape'    },
  { date: '04 Nov 2026', type: 'Technical', activities: 'Passing drills, Crosses',  attendance: 10, notes: 'Focus on wide play' },
]

// Local style tokens (slate base, sky accent) so the page doesn't rely on old global classes.
const ui = {
  card: 'rounded-xl border border-slate-800 bg-slate-900 p-5',
  h2: 'text-sm font-semibold text-slate-100',
  label: 'mb-1.5 block text-xs font-medium text-slate-400',
  input:
    'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 [color-scheme:dark] ' +
    'placeholder:text-slate-600 transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 ' +
    'disabled:cursor-not-allowed disabled:opacity-40',
  th: 'px-3 py-2 text-left text-xs font-medium text-slate-500',
  td: 'px-3 py-3 text-sm',
  btnPrimary:
    'inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-2 text-sm font-medium text-slate-950 ' +
    'transition-colors hover:bg-sky-400',
}
const badgeBase = 'inline-block rounded-md px-2 py-0.5 text-xs font-medium'
const badge = {
  sky:   `${badgeBase} bg-sky-500/10 text-sky-300`,
  slate: `${badgeBase} bg-slate-700/50 text-slate-300`,
  amber: `${badgeBase} bg-amber-400/10 text-amber-300`,
  rose:  `${badgeBase} bg-rose-500/10 text-rose-300`,
}
const sessionBadge = {
  Tactical: badge.sky, Fitness: badge.amber, Scrimmage: badge.rose, Technical: badge.slate, Recovery: badge.slate,
}

export default function Training() {
  const [date, setDate]               = useState(new Date().toISOString().slice(0, 10))
  const [sessionType, setSessionType] = useState('Tactical')
  const [activities, setActivities]   = useState('')
  const [notes, setNotes]             = useState('')
  const [present, setPresent]         = useState({})
  const [scores, setScores]           = useState({})
  const [saved, setSaved]             = useState(false)

  const togglePresent = (id) =>
    setPresent(p => ({ ...p, [id]: !p[id] }))

  const handleScore = (id, val) =>
    setScores(s => ({ ...s, [id]: val }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const presentCount = Object.values(present).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Training Sessions</h1>
        <p className="mt-1 text-sm text-slate-400">Log today's session and mark attendance</p>
      </div>

      {/* New session form */}
      <div className={`${ui.card} space-y-5`}>
        <h2 className={ui.h2}>Today's Session</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="session-date" className={ui.label}>Date</label>
            <input id="session-date" type="date" className={ui.input} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="session-type" className={ui.label}>Session type</label>
            <select id="session-type" className={ui.input} value={sessionType} onChange={e => setSessionType(e.target.value)}>
              {['Tactical', 'Fitness', 'Technical', 'Scrimmage', 'Recovery'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="session-activities" className={ui.label}>Activities</label>
            <input id="session-activities" className={ui.input} placeholder="e.g. Passing drills, Sprints"
              value={activities} onChange={e => setActivities(e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="session-notes" className={ui.label}>Notes</label>
          <textarea id="session-notes" className={`${ui.input} h-20 resize-none`} placeholder="Session notes..."
            value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {/* Attendance register */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Attendance Register</h3>
            <span className={badge.sky}>{presentCount} / {initialPlayers.length} present</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className={`${ui.th} pl-0`}>#</th>
                  <th className={ui.th}>Player</th>
                  <th className={ui.th}>Position</th>
                  <th className={ui.th}>Present</th>
                  <th className={ui.th}>Score / Rating</th>
                </tr>
              </thead>
              <tbody>
                {initialPlayers.map(p => (
                  <tr key={p.id} className="border-b border-slate-800/60 last:border-0">
                    <td className={`${ui.td} pl-0 text-slate-500`}>{p.number}</td>
                    <td className={`${ui.td} font-medium text-slate-100`}>{p.name}</td>
                    <td className={ui.td}><span className={badge.slate}>{p.position}</span></td>
                    <td className={ui.td}>
                      <button
                        type="button"
                        onClick={() => togglePresent(p.id)}
                        aria-label={`${present[p.id] ? 'Mark absent' : 'Mark present'}: ${p.name}`}
                        aria-pressed={!!present[p.id]}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                          present[p.id]
                            ? 'bg-sky-500 text-slate-950'
                            : 'border border-slate-700 bg-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {present[p.id] ? <MdCheck className="text-sm" /> : <MdClose className="text-sm" />}
                      </button>
                    </td>
                    <td className={ui.td}>
                      <input
                        type="number"
                        min="0" max="10"
                        className={`${ui.input} w-20`}
                        placeholder="0–10"
                        value={scores[p.id] || ''}
                        onChange={e => handleScore(p.id, e.target.value)}
                        disabled={!present[p.id]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSave} className={ui.btnPrimary}>
            <MdAdd /> Save Session
          </button>
          {saved && <span className="text-sm text-sky-300">Session saved!</span>}
        </div>
      </div>

      {/* Past sessions */}
      <div className={ui.card}>
        <h2 className={`${ui.h2} mb-3`}>Past Sessions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className={`${ui.th} pl-0`}>Date</th>
                <th className={ui.th}>Type</th>
                <th className={ui.th}>Activities</th>
                <th className={ui.th}>Attendance</th>
                <th className={ui.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {pastSessions.map((s, i) => (
                <tr key={i} className="border-b border-slate-800/60 last:border-0">
                  <td className={`${ui.td} pl-0 text-slate-300`}>{s.date}</td>
                  <td className={ui.td}><span className={sessionBadge[s.type] || badge.slate}>{s.type}</span></td>
                  <td className={`${ui.td} text-slate-400`}>{s.activities}</td>
                  <td className={`${ui.td} text-slate-200`}>{s.attendance}/{initialPlayers.length}</td>
                  <td className={`${ui.td} text-slate-400`}>{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}