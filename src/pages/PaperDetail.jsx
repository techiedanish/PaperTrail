import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { papers, subjectById } from '../mock/data'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'

export default function PaperDetail() {
  const { id } = useParams()
  const paper = papers.find((p) => p.id === id)
  const { role, pushToast } = useApp()
  const [downloading, setDownloading] = useState(false)

  if (!paper) return <Navigate to="/vault" replace />
  const subject = subjectById(paper.subjectId)

  function handleDownload() {
    if (role === 'guest') {
      pushToast('Sign in to download papers.', 'error')
      return
    }
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      pushToast('This button goes live in the Samurai build — it will start a real download then.', 'success')
    }, 700)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/vault" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
        ← Back to the vault
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--color-ink-soft)]">{subject?.code}</span>
          <StatusBadge status={paper.verified ? 'verified' : 'unverified'} />
        </div>
        <h1 className="font-display text-3xl">{subject?.name}</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          {paper.examType === 'mid' ? 'Mid Semester' : 'End Semester'} · {paper.year}
        </p>

        <div className="ruled-top my-7 rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)]">
          <div className="flex h-56 items-center justify-center text-sm text-[var(--color-ink-soft)]">
            PDF preview — wired up once file storage exists (Samurai)
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-sm bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition hover:opacity-90 disabled:opacity-70"
          >
            {downloading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--color-paper)]/40 border-t-[var(--color-paper)]" />}
            {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
          {role === 'guest' && <span className="text-sm text-[var(--color-ink-soft)]">Sign in required</span>}
          <Link
            to={`/practice?subject=${paper.subjectId}`}
            className="rounded-sm border border-[var(--color-rule)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--color-paper-raised)]"
          >
            Practice this subject
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--color-rule)] pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[var(--color-ink-soft)]">Verified questions</dt>
            <dd className="mt-1 font-mono">{paper.questionCount || '—'}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-ink-soft)]">Contributed by</dt>
            <dd className="mt-1">{paper.uploadedBy}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-ink-soft)]">Status</dt>
            <dd className="mt-1 capitalize">{paper.status}</dd>
          </div>
        </dl>

        <button
          onClick={() => pushToast('Report submitted — this is a Shogun-level feature, previewed here.', 'info')}
          className="mt-6 text-sm text-[var(--color-mark)] underline-offset-2 hover:underline"
        >
          Report a problem with this paper
        </button>
      </motion.div>
    </div>
  )
}
