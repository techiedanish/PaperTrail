import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { myUploads as initialUploads, myGeneratedSets as initialSets } from '../mock/data'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [role, setRole] = useState('guest') // guest | student | admin
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('papertrail-theme') === 'dark' } catch { return false }
  })
  const [toasts, setToasts] = useState([])
  const [uploads, setUploads] = useState(initialUploads)
  const [history, setHistory] = useState(initialSets)
  const [generationsToday, setGenerationsToday] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('papertrail-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  const pushToast = useCallback((message, kind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const addUpload = useCallback((upload) => {
    setUploads((u) => [upload, ...u])
  }, [])

  const addGeneratedSet = useCallback((set) => {
    setHistory((h) => [set, ...h])
    setGenerationsToday((n) => n + 1)
  }, [])

  const value = {
    role, setRole,
    dark, setDark,
    toasts, pushToast,
    uploads, addUpload,
    history, addGeneratedSet,
    generationsToday,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
