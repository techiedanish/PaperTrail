import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { papers, subjects, subjectById } from '../mock/data'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'

export default function Upload() {
  const [tab, setTab] = useState('upload')
  const { uploads } = useApp()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl">Upload a missing paper</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        Goes to an admin for review before it appears in the vault.
      </p>

      <div className="my-6 flex gap-1 rounded-sm border border-[var(--color-rule)] p-1 text-sm">
        {['upload', 'mine'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-sm py-1.5 transition ${
              tab === t ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-ink-soft)]'
            }`}
          >
            {t === 'upload' ? 'Upload' : `My uploads (${uploads.length})`}
          </button>
        ))}
      </div>

      {tab === 'upload' ? <UploadForm onDone={() => setTab('mine')} /> : <MyUploads />}
    </div>
  )
}

function UploadForm({ onDone }) {
  const [subjectId, setSubjectId] = useState(subjects[0].id)
  const [examType, setExamType] = useState('mid')
  const [year, setYear] = useState(new Date().getFullYear())
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [duplicate, setDuplicate] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { addUpload, pushToast } = useApp()

  function checkDuplicate(sid, type, yr) {
    return papers.find((p) => p.subjectId === sid && p.examType === type && p.year === Number(yr) && p.status !== 'rejected')
  }

  function handleFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const errs = {}
    if (!f.name.toLowerCase().endsWith('.pdf')) errs.file = 'Only PDF files are accepted.'
    else if (f.size > 10 * 1024 * 1024) errs.file = 'File is larger than 10 MB.'
    setErrors((prev) => ({ ...prev, file: errs.file }))
    if (!errs.file) setFile(f)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const dup = checkDuplicate(subjectId, examType, year)
    if (dup) { setDuplicate(dup); return }
    if (!file) { setErrors((p) => ({ ...p, file: 'Please attach a PDF.' })); return }

    setSubmitting(true)
    setTimeout(() => {
      addUpload({ id: `local-${Date.now()}`, subjectId, examType, year: Number(year), status: 'pending' })
      setSubmitting(false)
      pushToast('Submitted for review — you can track its status under My uploads.', 'success')
      onDone()
    }, 700)
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
      <Field label="Subject">
        <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setDuplicate(null) }} className={inputCls}>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Exam type">
          <select value={examType} onChange={(e) => { setExamType(e.target.value); setDuplicate(null) }} className={inputCls}>
            <option value="mid">Mid semester</option>
            <option value="end">End semester</option>
          </select>
        </Field>
        <Field label="Year">
          <input type="number" value={year} min={2018} max={2026} onChange={(e) => { setYear(e.target.value); setDuplicate(null) }} className={inputCls} />
        </Field>
      </div>

      {duplicate && (
        <div className="rounded-sm border border-[var(--color-pending)] bg-[var(--color-pending-soft)] px-4 py-3 text-sm">
          A paper for this subject, exam type and year already exists.{' '}
          <Link to={`/paper/${duplicate.id}`} className="font-medium underline">View the existing paper</Link>
        </div>
      )}

      <label className="block text-sm">
        <span className="mb-1.5 block text-[var(--color-ink-soft)]">PDF file (max 10 MB)</span>
        <div className="rounded-sm border border-dashed border-[var(--color-rule)] bg-[var(--color-paper-raised)] px-4 py-8 text-center">
          <input type="file" accept="application/pdf" onChange={handleFile} className="block w-full text-sm" />
          {file && <p className="mt-2 text-xs text-[var(--color-verified)]">{file.name} ready to submit</p>}
        </div>
        {errors.file && <p className="mt-1 text-xs text-[var(--color-mark)]">{errors.file}</p>}
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-sm bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition hover:opacity-90 disabled:opacity-70"
      >
        {submitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--color-paper)]/40 border-t-[var(--color-paper)]" />}
        {submitting ? 'Submitting…' : 'Submit for review'}
      </button>
    </motion.form>
  )
}

function MyUploads() {
  const { uploads } = useApp()
  if (uploads.length === 0) {
    return <EmptyState icon="📤" title="You haven't uploaded anything yet" body="Missing a paper? Switch to the Upload tab." />
  }
  return (
    <ul className="divide-y divide-[var(--color-rule)] rounded-sm border border-[var(--color-rule)]">
      {uploads.map((u) => {
        const subject = subjectById(u.subjectId)
        return (
          <li key={u.id} className="flex items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="font-display">{subject?.code} — {u.examType === 'mid' ? 'Mid' : 'End'} Sem {u.year}</p>
              {u.rejectReason && <p className="mt-1 text-xs text-[var(--color-mark)]">{u.rejectReason}</p>}
            </div>
            <StatusBadge status={u.status} />
          </li>
        )
      })}
    </ul>
  )
}

const inputCls = 'w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-verified)]'

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-[var(--color-ink-soft)]">{label}</span>
      {children}
    </label>
  )
}
