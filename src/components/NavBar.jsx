import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const studentLinks = [
  { to: '/vault', label: 'Vault' },
  { to: '/syllabus', label: 'Syllabus' },
  { to: '/practice', label: 'Practice' },
  { to: '/upload', label: 'Upload' },
]
const adminLinks = [{ to: '/admin', label: 'Review queue' }]

function linkClass({ isActive }) {
  return `relative px-1 py-1 text-sm transition-colors ${
    isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
  }`
}

export default function NavBar() {
  const { role, setRole, dark, setDark, pushToast } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const links = role === 'admin' ? adminLinks : studentLinks

  function handleRoleChange(next) {
    setRole(next)
    setMenuOpen(false)
    if (next === 'guest') {
      pushToast('Signed out — browsing as a guest.')
      navigate('/')
    } else if (next === 'admin') {
      pushToast('Previewing the admin screens.')
      navigate('/admin')
    } else {
      pushToast('Previewing the student screens.')
      navigate('/vault')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-sm text-[13px] font-bold text-[var(--color-paper)]"
              style={{ backgroundColor: 'var(--color-verified)' }}
            >
              P
            </span>
            PaperTrail
          </NavLink>
          <nav className="hidden items-center gap-5 md:flex">
            {role !== 'guest' &&
              links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[var(--color-verified)]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="grid h-8 w-8 place-items-center rounded-sm border border-[var(--color-rule)] text-sm transition hover:bg-[var(--color-paper-raised)]"
          >
            {dark ? '☀' : '☾'}
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-sm border border-[var(--color-rule)] px-3 py-1.5 text-sm font-medium transition hover:bg-[var(--color-paper-raised)]"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: role === 'admin' ? 'var(--color-mark)' : role === 'student' ? 'var(--color-verified)' : 'var(--color-pending)' }}
              />
              {role === 'guest' ? 'Guest' : role === 'student' ? 'Student view' : 'Admin view'}
            </button>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-1 w-48 rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] p-1 shadow-sm"
              >
                <p className="px-2 pb-1 pt-1.5 text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]">Preview as (Kenshi has no real login)</p>
                {['guest', 'student', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className="block w-full rounded-sm px-2 py-1.5 text-left text-sm capitalize transition hover:bg-[var(--color-paper)]"
                  >
                    {r}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
