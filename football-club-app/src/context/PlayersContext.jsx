/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'fc-manager:players'

const seedPlayers = [
  { id: 1,  name: 'James Otieno',   number: 1,  position: 'GK',  age: 24, goals: 0,  assists: 0, sessions: 11 },
  { id: 2,  name: 'Brian Kamau',    number: 4,  position: 'CB',  age: 22, goals: 1,  assists: 2, sessions: 10 },
  { id: 3,  name: 'Kevin Mwangi',   number: 5,  position: 'CB',  age: 23, goals: 2,  assists: 1, sessions: 12 },
  { id: 4,  name: 'Samuel Ochieng', number: 3,  position: 'LB',  age: 21, goals: 1,  assists: 4, sessions: 9  },
  { id: 5,  name: 'David Kiprop',   number: 2,  position: 'RB',  age: 22, goals: 0,  assists: 3, sessions: 11 },
  { id: 6,  name: 'Peter Njoroge',  number: 6,  position: 'CM',  age: 25, goals: 3,  assists: 5, sessions: 12 },
  { id: 7,  name: 'Eric Waweru',    number: 8,  position: 'CM',  age: 23, goals: 4,  assists: 3, sessions: 10 },
  { id: 8,  name: 'Felix Omondi',   number: 10, position: 'CAM', age: 24, goals: 7,  assists: 8, sessions: 11 },
  { id: 9,  name: 'Moses Kimani',   number: 7,  position: 'RW',  age: 20, goals: 5,  assists: 6, sessions: 9  },
  { id: 10, name: 'Victor Abuya',   number: 11, position: 'LW',  age: 21, goals: 6,  assists: 4, sessions: 10 },
  { id: 11, name: 'John Makau',     number: 9,  position: 'ST',  age: 26, goals: 12, assists: 2, sessions: 12 },
]

function loadPlayers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seedPlayers
  } catch {
    return seedPlayers
  }
}

const PlayersContext = createContext(null)

export function PlayersProvider({ children }) {
  const [players, setPlayers] = useState(loadPlayers)

  // Save every change so the roster survives a page refresh
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
    } catch {
      /* storage full or blocked: the app still works in memory */
    }
  }, [players])

  const addPlayer = (data) =>
    setPlayers(ps => [...ps, { ...data, id: Date.now() }])

  const updatePlayer = (id, data) =>
    setPlayers(ps => ps.map(p => (p.id === id ? { ...data, id } : p)))

  const deletePlayer = (id) =>
    setPlayers(ps => ps.filter(p => p.id !== id))

  return (
    <PlayersContext.Provider value={{ players, addPlayer, updatePlayer, deletePlayer }}>
      {children}
    </PlayersContext.Provider>
  )
}

export function usePlayers() {
  const ctx = useContext(PlayersContext)
  if (!ctx) throw new Error('usePlayers must be used inside <PlayersProvider>')
  return ctx
}