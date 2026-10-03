import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [submitting, setSubmitting] = useState(false)
  const { setRole, pushToast } = useApp()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setRole('student')
      pushToast(mode === 'login' ? 'Signed in.' : 'Account created — signed in.', 'success')
      navigate('/vault')
    }, 700)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="mb-6 flex rounded-sm border border-[var(--color-rule)] p-1 text-sm">
        {['login', 'register'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-sm py-1.5 capitalize transition ${
              mode === m ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-ink-soft)]'
            }`}
          >
            {m === 'login' ? 'Sign in' : 'Register'}
          </button>
        ))}
      </div>

      <motion.form
        key={mode}
        initial={{ opacity: 0, x: mode === 'login' ? -8 : 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <h1 className="font-display text-2xl">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Kenshi has no real backend yet — this form previews the flow and signs you in as a student.
        </p>

        {mode === 'register' && (
          <Field label="Name" type="text" placeholder="Your full name" required />
        )}
        <Field label="Email" type="email" placeholder="you@example.edu" required />
        <Field label="Password" type="password" placeholder="At least 8 characters" required minLength={8} />

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-ink)] py-2.5 text-sm font-medium text-[var(--color-paper)] transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--color-paper)]/40 border-t-[var(--color-paper)]" />
              {mode === 'login' ? 'Signing in…' : 'Creating account…'}
            </>
          ) : mode === 'login' ? (
            'Sign in'
          ) : (
            'Create account'
          )}
        </button>
      </motion.form>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-[var(--color-ink-soft)]">{label}</span>
      <input
        {...props}
        className="w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-verified)]"
      />
    </label>
  )
}
