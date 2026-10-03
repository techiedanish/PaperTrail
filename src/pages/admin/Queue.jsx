import { useState } from 'react'
import { Link } from 'react-router-dom'
import { adminQueue, subjectById } from '../../mock/data'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { RowSkeleton } from '../../components/Skeleton'
import { useEffect } from 'react'

export default function AdminQueue() {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const rows = adminQueue.filter((p) => (filter === 'all' ? true : p.status === filter))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl">Review queue</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">Approve, reject, extract and verify — admin role is set in the database, not chosen here.</p>

      <div className="my-6 flex gap-2">
        {['pending', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-sm border px-3 py-1.5 text-sm capitalize transition ${
              filter === f ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]' : 'border-[var(--color-rule)] text-[var(--color-ink-soft)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div>{Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState icon="✅" title="Nothing to review" body="The queue is empty for this filter." />
      ) : (
        <ul className="divide-y divide-[var(--color-rule)] rounded-sm border border-[var(--color-rule)]">
          {rows.map((p) => {
            const subject = subjectById(p.subjectId)
            return (
              <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-4">
                <div>
                  <p className="font-display">{subject?.code} — {p.examType === 'mid' ? 'Mid' : 'End'} Sem {p.year}</p>
                  <p className="text-xs text-[var(--color-ink-soft)]">Uploaded by {p.uploadedBy}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <Link
                    to={`/admin/${p.id}`}
                    className="rounded-sm border border-[var(--color-rule)] px-3 py-1.5 text-sm font-medium transition hover:bg-[var(--color-paper-raised)]"
                  >
                    Review
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
