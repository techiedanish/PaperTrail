import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-[var(--color-ink-soft)]">404</p>
      <h1 className="mt-2 font-display text-2xl">This page doesn't exist</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">Maybe it was never approved.</p>
      <Link to="/" className="mt-6 rounded-sm bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-paper)]">
        Back home
      </Link>
    </div>
  )
}
