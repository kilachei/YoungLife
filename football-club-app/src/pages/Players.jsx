import { useMemo, useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdClose, MdSearch } from 'react-icons/md'
import { usePlayers } from '../context/PlayersContext'
import { useAuth } from '../context/AuthContext'

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST']

const positionColors = {
  GK: 'badge-amber', CB: 'badge-blue', LB: 'badge-blue', RB: 'badge-blue',
  CM: 'badge-green', CAM: 'badge-green', CDM: 'badge-green',
  RW: 'badge-red', LW: 'badge-red', ST: 'badge-red',
}

const empty = { name: '', number: '', position: 'CM', age: '', goals: 0, assists: 0, sessions: 0 }

export default function Players() {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayers()
  const { isCoach } = useAuth()

  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(empty)
  const [editId, setEditId] = useState(null)
  const [errors, setErrors] = useState({})
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState('ALL')

  // Sort a copy (never sort state in place) and apply search + position filter
  const ranked = useMemo(
    () => [...players].sort((a, b) => b.goals - a.goals),
    [players]
  )
  const topScorerId = ranked[0]?.id

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ranked.filter(p =>
      (filter === 'ALL' || p.position === filter) &&
      (!q || p.name.toLowerCase().includes(q) || String(p.number) === q)
    )
  }, [ranked, query, filter])

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const openAdd = () => {
    setForm(empty); setEditId(null); setErrors({}); setModal(true)
  }
  const openEdit = (p) => {
    setForm(p); setEditId(p.id); setErrors({}); setModal(true)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter the player’s name.'
    const num = Number(form.number)
    if (!form.number && form.number !== 0) e.number = 'Enter a jersey number.'
    else if (num < 1 || num > 99) e.number = 'Use a number from 1 to 99.'
    else if (players.some(p => p.number === num && p.id !== editId))
      e.number = `#${num} is already taken.`
    const age = Number(form.age)
    if (!form.age) e.age = 'Enter an age.'
    else if (age < 14 || age > 50) e.age = 'Age must be between 14 and 50.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    // Convert everything numeric once, here, so the stored data is always clean
    const clean = {
      name: form.name.trim(),
      position: form.position,
      number: Number(form.number),
      age: Number(form.age),
      goals: Number(form.goals) || 0,
      assists: Number(form.assists) || 0,
      sessions: Number(form.sessions) || 0,
    }
    if (editId) updatePlayer(editId, clean)
    else addPlayer(clean)
    setModal(false)
  }

  const handleDelete = (p) => {
    if (window.confirm(`Remove ${p.name} from the squad?`)) deletePlayer(p.id)
  }

  const fieldError = (key) =>
    errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Players</h1>
          <p className="text-slate-400 text-sm mt-1">{players.length} registered players</p>
        </div>
        {isCoach && (
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <MdAdd /> Add Player
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-white">Player Scores & Stats</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-9"
                placeholder="Search name or number"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <select className="input" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="ALL">All positions</option>
              {POSITIONS.map(pos => <option key={pos}>{pos}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th pl-0">#</th>
                <th className="th">Name</th>
                <th className="th">Pos</th>
                {isCoach && <th className="th">Age</th>}
                <th className="th">Goals</th>
                <th className="th">Assists</th>
                {isCoach && <th className="th">Sessions</th>}
                {isCoach && <th className="th">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="td pl-0 text-slate-400">{p.number}</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      {p.id === topScorerId && p.goals > 0 && (
                        <span className="text-amber-400 text-xs" title="Top scorer">⭐</span>
                      )}
                      <span className="font-medium text-slate-100">{p.name}</span>
                    </div>
                  </td>
                  <td className="td">
                    <span className={positionColors[p.position] || 'badge-blue'}>{p.position}</span>
                  </td>
                  {isCoach && <td className="td text-slate-400">{p.age}</td>}
                  <td className="td font-semibold text-indigo-400">{p.goals}</td>
                  <td className="td text-cyan-400">{p.assists}</td>
                  {isCoach && <td className="td text-slate-400">{p.sessions}</td>}
                  {isCoach && (
                  <td className="td">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        aria-label={`Edit ${p.name}`}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <MdEdit className="text-base" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        aria-label={`Remove ${p.name}`}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <MdDelete className="text-base" />
                      </button>
                    </div>
                  </td>
                  )}
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={isCoach ? 8 : 5} className="td text-center text-slate-400 py-10">
                    {players.length === 0
                      ? 'No players yet. Add your first player to build the squad.'
                      : 'No players match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#111a3a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editId ? 'Edit Player' : 'Add Player'}</h3>
              <button onClick={() => setModal(false)} aria-label="Close" className="text-slate-400 hover:text-slate-200">
                <MdClose />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Full name</label>
                <input className="input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. John Makau" />
                {fieldError('name')}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Jersey #</label>
                <input type="number" className="input" value={form.number} onChange={e => setField('number', e.target.value)} />
                {fieldError('number')}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Position</label>
                <select className="input" value={form.position} onChange={e => setField('position', e.target.value)}>
                  {POSITIONS.map(pos => <option key={pos}>{pos}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Age</label>
                <input type="number" className="input" value={form.age} onChange={e => setField('age', e.target.value)} />
                {fieldError('age')}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Sessions attended</label>
                <input type="number" min="0" className="input" value={form.sessions} onChange={e => setField('sessions', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Goals</label>
                <input type="number" min="0" className="input" value={form.goals} onChange={e => setField('goals', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Assists</label>
                <input type="number" min="0" className="input" value={form.assists} onChange={e => setField('assists', e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="btn-primary flex-1">Save</button>
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}