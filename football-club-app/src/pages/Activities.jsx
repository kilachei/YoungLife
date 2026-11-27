import { useEffect, useMemo, useState } from 'react'
import {
  MdAdd, MdClose, MdEdit, MdDelete,
  MdAnnouncement, MdSportsFootball, MdCalendarMonth, MdPeople,
} from 'react-icons/md'

import { useAuth } from '../context/AuthContext'

const STORAGE_KEY = 'fc-manager:activities'

const typeConfig = {
  Announcement: { icon: MdAnnouncement,   cls: 'badge-amber', bg: 'bg-amber-500/10', color: 'text-amber-400', bar: 'bg-amber-400' },
  Game:         { icon: MdSportsFootball, cls: 'badge-green', bg: 'bg-green-500/10', color: 'text-green-400', bar: 'bg-green-400' },
  Event:        { icon: MdCalendarMonth,  cls: 'badge-blue',  bg: 'bg-blue-500/10',  color: 'text-blue-400',  bar: 'bg-blue-400'  },
  Meeting:      { icon: MdPeople,         cls: 'badge-red',   bg: 'bg-red-500/10',   color: 'text-red-400',   bar: 'bg-red-400'   },
}
const TYPES = Object.keys(typeConfig)

// Dates are ISO (YYYY-MM-DD) so they sort and compare correctly
const seed = [
  { id: 1, type: 'Game',         date: '2026-11-15', title: 'League Match vs Nairobi FC',
    description: 'Home game at our ground. Kickoff at 3:00 PM. All players must arrive by 1:30 PM.', postedBy: 'Coach Maina' },
  { id: 2, type: 'Announcement', date: '2026-11-10', title: 'New Training Kit Available',
    description: 'New season kits have arrived. Players can collect from the club office after training.', postedBy: 'Club Admin' },
  { id: 3, type: 'Event',        date: '2026-11-20', title: 'Club Annual Gala',
    description: 'Annual end-of-year dinner and awards night. Venue: Nairobi Safari Club. RSVP by 14 Nov.', postedBy: 'Club Secretary' },
  { id: 4, type: 'Meeting',      date: '2026-11-12', title: 'Team Tactics Meeting',
    description: 'Pre-match tactics briefing. Venue: Club meeting room. Attendance mandatory.', postedBy: 'Coach Maina' },
  { id: 5, type: 'Game',         date: '2026-11-22', title: 'Friendly vs Mombasa Stars',
    description: 'Away friendly. Bus departs from club at 8:00 AM. Report by 7:30 AM.', postedBy: 'Coach Maina' },
]

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

const empty = { type: 'Announcement', date: '', title: '', description: '', postedBy: '' }

const todayISO = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, local time
const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
const daysUntil = (iso) => {
  const t = new Date(); t.setHours(0, 0, 0, 0)
  return Math.round((new Date(`${iso}T00:00:00`) - t) / 86400000)
}
const when = (n) => (n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n > 1 ? `In ${n} days` : '')

export default function Activities() {
  const { isCoach } = useAuth()
  const [activities, setActivities] = useState(load)
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(empty)
  const [editId, setEditId] = useState(null)
  const [errors, setErrors] = useState({})
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(activities)) } catch { /* ignore */ }
  }, [activities])

  const today = todayISO()

  const counts = useMemo(() => {
    const c = { All: activities.length }
    TYPES.forEach(t => { c[t] = activities.filter(a => a.type === t).length })
    return c
  }, [activities])

  const { upcoming, earlier } = useMemo(() => {
    const list = filter === 'All' ? activities : activities.filter(a => a.type === filter)
    return {
      upcoming: list.filter(a => a.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
      earlier:  list.filter(a => a.date <  today).sort((a, b) => b.date.localeCompare(a.date)),
    }
  }, [activities, filter, today])

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd  = () => { setForm({ ...empty, date: today }); setEditId(null); setErrors({}); setModal(true) }
  const openEdit = (a) => { setForm(a); setEditId(a.id); setErrors({}); setModal(true) }

  const handleSave = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Give the activity a title.'
    if (!form.date) e.date = 'Pick a date.'
    setErrors(e)
    if (Object.keys(e).length) return

    const clean = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      postedBy: form.postedBy.trim() || 'Club Admin',
    }
    if (editId) setActivities(as => as.map(a => (a.id === editId ? { ...clean, id: editId } : a)))
    else setActivities(as => [...as, { ...clean, id: Date.now() }])
    setModal(false)
  }

  const handleDelete = (a) => {
    if (window.confirm(`Delete "${a.title}"?`)) setActivities(as => as.filter(x => x.id !== a.id))
  }

  const err = (k) => errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>

  const ActivityCard = ({ a, past }) => {
    const cfg = typeConfig[a.type]
    const Icon = cfg.icon
    const label = when(daysUntil(a.date))
    return (
      <div className={`card relative flex gap-4 ${past ? 'opacity-70' : ''}`}>
        <span className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${cfg.bar}`} />
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon className={`${cfg.color} text-xl`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cfg.cls}>{a.type}</span>
                {label && <span className="text-xs text-green-400 font-medium">{label}</span>}
              </div>
              <h3 className="text-sm font-semibold text-white">{a.title}</h3>
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0">{fmtDate(a.date)}</span>
          </div>
          {a.description && <p className="text-sm text-slate-400 mt-1 leading-relaxed">{a.description}</p>}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">Posted by {a.postedBy}</p>
            {isCoach && (
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(a)} aria-label={`Edit ${a.title}`}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors">
                <MdEdit className="text-base" />
              </button>
              <button onClick={() => handleDelete(a)} aria-label={`Delete ${a.title}`}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                <MdDelete className="text-base" />
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Club Activities</h1>
          <p className="text-slate-400 text-sm mt-1">Announcements, games, events and meetings</p>
        </div>
        {isCoach && (
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <MdAdd /> Post Activity
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...TYPES].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === t ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            {t} <span className="opacity-60 ml-1">{counts[t]}</span>
          </button>
        ))}
      </div>

      {upcoming.length === 0 && earlier.length === 0 && (
        <div className="card text-center py-10 text-slate-500">No activities found.</div>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Upcoming</h2>
          {upcoming.map(a => <ActivityCard key={a.id} a={a} />)}
        </section>
      )}

      {earlier.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Earlier</h2>
          {earlier.map(a => <ActivityCard key={a.id} a={a} past />)}
        </section>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#0f2b18] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editId ? 'Edit Activity' : 'Post Activity'}</h3>
              <button onClick={() => setModal(false)} aria-label="Close" className="text-slate-400 hover:text-slate-200"><MdClose /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select className="input" value={form.type} onChange={e => setField('type', e.target.value)}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date</label>
                  <input type="date" className="input" value={form.date} onChange={e => setField('date', e.target.value)} />
                  {err('date')}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title</label>
                <input className="input" placeholder="Activity title" value={form.title} onChange={e => setField('title', e.target.value)} />
                {err('title')}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea className="input h-24 resize-none" placeholder="Details..." value={form.description} onChange={e => setField('description', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Posted by</label>
                <input className="input" placeholder="Your name / role" value={form.postedBy} onChange={e => setField('postedBy', e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="btn-primary flex-1">{editId ? 'Save' : 'Post'}</button>
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}