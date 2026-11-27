import { useState } from 'react'
import { MdAdd, MdClose, MdSportsScore } from 'react-icons/md'

const initialMatches = [
  {
    id: 1, date: '01 Nov 2026', opponent: 'Kisumu United', type: 'League',
    venue: 'Home', goalsFor: 3, goalsAgainst: 1,
    scorers: ['John Makau (23\')', 'Felix Omondi (45\')', 'Victor Abuya (78\')'],
  },
  {
    id: 2, date: '25 Oct 2026', opponent: 'Eldoret City', type: 'Friendly',
    venue: 'Away', goalsFor: 2, goalsAgainst: 2,
    scorers: ['John Makau (12\')', 'Moses Kimani (67\')'],
  },
  {
    id: 3, date: '18 Oct 2026', opponent: 'Mombasa Stars', type: 'League',
    venue: 'Home', goalsFor: 1, goalsAgainst: 0,
    scorers: ['Eric Waweru (55\')'],
  },
]

const upcoming = [
  { date: '15 Nov 2026', opponent: 'Nairobi FC',    type: 'League',   venue: 'Home' },
  { date: '22 Nov 2026', opponent: 'Mombasa Stars', type: 'Friendly', venue: 'Away' },
  { date: '29 Nov 2026', opponent: 'Kisumu United', type: 'League',   venue: 'Home' },
]

const empty = { date: '', opponent: '', type: 'League', venue: 'Home', goalsFor: 0, goalsAgainst: 0, scorers: [] }

export default function Matches() {
  const [matches, setMatches]       = useState(initialMatches)
  const [modal, setModal]           = useState(false)
  const [form, setForm]             = useState(empty)
  const [scorerInput, setScorerInput] = useState('')
  const [expanded, setExpanded]     = useState(null)

  const addScorer = () => {
    if (!scorerInput) return
    setForm(f => ({ ...f, scorers: [...f.scorers, scorerInput] }))
    setScorerInput('')
  }

  const handleSave = () => {
    if (!form.date || !form.opponent) return
    setMatches(ms => [{ ...form, id: Date.now() }, ...ms])
    setModal(false)
    setForm(empty)
  }

  const result = (m) => {
    if (m.goalsFor > m.goalsAgainst) return { label: 'W', cls: 'badge-green' }
    if (m.goalsFor < m.goalsAgainst) return { label: 'L', cls: 'badge-red'   }
    return { label: 'D', cls: 'badge-amber' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Matches</h1>
          <p className="text-slate-400 text-sm mt-1">Results, scorers and upcoming fixtures</p>
        </div>
        <button onClick={() => { setForm(empty); setModal(true) }} className="btn-primary flex items-center gap-2">
          <MdAdd /> Log Result
        </button>
      </div>

      {/* Upcoming fixtures */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Upcoming Fixtures</h2>
        <div className="space-y-3">
          {upcoming.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">vs {m.opponent}</p>
                <p className="text-xs text-slate-400 mt-0.5">{m.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={m.type === 'League' ? 'badge-green' : 'badge-amber'}>{m.type}</span>
                <span className={m.venue === 'Home' ? 'badge-blue' : 'badge-red'}>{m.venue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match results */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Match Results</h2>
        <div className="space-y-2">
          {matches.map(m => {
            const r = result(m)
            return (
              <div key={m.id} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={r.cls}>{r.label}</span>
                    <div>
                      <p className="text-sm font-medium text-white">vs {m.opponent}</p>
                      <p className="text-xs text-slate-400">{m.date} · {m.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-white">
                      {m.goalsFor} – {m.goalsAgainst}
                    </span>
                    <span className={m.type === 'League' ? 'badge-green' : 'badge-amber'}>{m.type}</span>
                  </div>
                </button>
                {expanded === m.id && (
                  <div className="px-4 py-3 border-t border-white/10 bg-black/20">
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                      <MdSportsScore /> Goal scorers
                    </p>
                    {m.scorers.length > 0
                      ? <div className="flex flex-wrap gap-2">
                          {m.scorers.map((s, i) => <span key={i} className="badge-green">{s}</span>)}
                        </div>
                      : <p className="text-xs text-slate-500">No scorers recorded</p>
                    }
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#0f2b18] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Log Match Result</h3>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-200"><MdClose /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Date</label>
                <input type="date" className="input" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Opponent</label>
                <input className="input" placeholder="e.g. Nairobi FC" value={form.opponent} onChange={e => setForm(f => ({...f, opponent: e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                  {['League','Friendly','Cup','Tournament'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Venue</label>
                <select className="input" value={form.venue} onChange={e => setForm(f => ({...f, venue: e.target.value}))}>
                  <option>Home</option><option>Away</option><option>Neutral</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Our goals</label>
                <input type="number" className="input" min="0" value={form.goalsFor} onChange={e => setForm(f => ({...f, goalsFor: +e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Their goals</label>
                <input type="number" className="input" min="0" value={form.goalsAgainst} onChange={e => setForm(f => ({...f, goalsAgainst: +e.target.value}))} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Add goal scorer</label>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="e.g. John Makau (23')"
                  value={scorerInput}
                  onChange={e => setScorerInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addScorer()}
                />
                <button onClick={addScorer} className="btn-secondary px-3">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.scorers.map((s, i) => (
                  <span key={i} className="badge-green flex items-center gap-1">
                    {s}
                    <button onClick={() => setForm(f => ({...f, scorers: f.scorers.filter((_, j) => j !== i)}))} className="ml-1 hover:text-red-400">
                      <MdClose className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="btn-primary flex-1">Save Result</button>
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}