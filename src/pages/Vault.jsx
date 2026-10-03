import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { papers, subjects } from '../mock/data'
import PaperCard from '../components/PaperCard'
import { CardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

const approvedPapers = papers.filter((p) => p.status === 'approved')
const years = [...new Set(approvedPapers.map((p) => p.year))].sort((a, b) => b - a)

export default function Vault() {
  const [loading, setLoading] = useState(true)
  const [subjectId, setSubjectId] = useState('all')
  const [examType, setExamType] = useState('all')
  const [year, setYear] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return approvedPapers.filter((p) => {
      if (subjectId !== 'all' && p.subjectId !== subjectId) return false
      if (examType !== 'all' && p.examType !== examType) return false
      if (year !== 'all' && String(p.year) !== year) return false
      if (query) {
        const subj = subjects.find((s) => s.id === p.subjectId)
        const haystack = `${subj?.name} ${subj?.code}`.toLowerCase()
        if (!haystack.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [subjectId, examType, year, query])

  const activeFilterCount = [subjectId, examType, year].filter((v) => v !== 'all').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-3xl">The vault</h1>
        <p className="text-[var(--color-ink-soft)]">
          Only papers an admin has approved appear here. {approvedPapers.length} papers · {years.length} years covered.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 border-b border-[var(--color-rule)] pb-6 sm:flex-row sm:items-center sm:gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by subject or code…"
          className="w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-verified)] sm:max-w-xs"
        />
        <Select value={subjectId} onChange={setSubjectId} label="Subject">
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.code}</option>
          ))}
        </Select>
        <Select value={examType} onChange={setExamType} label="Exam">
          <option value="all">Mid + End sem</option>
          <option value="mid">Mid semester</option>
          <option value="end">End semester</option>
        </Select>
        <Select value={year} onChange={setYear} label="Year">
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </Select>
        {activeFilterCount > 0 && (
          <button
            onClick={() => { setSubjectId('all'); setExamType('all'); setYear('all') }}
            className="text-sm text-[var(--color-mark)] underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No papers match those filters"
          body="Try a different subject or year, or upload the paper you're looking for."
          action={
            <Link to="/upload" className="mt-1 rounded-sm bg-[var(--color-ink)] px-4 py-1.5 text-sm font-medium text-[var(--color-paper)]">
              Upload a missing paper
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => <PaperCard key={p.id} paper={p} index={i} />)}
        </div>
      )}
    </div>
  )
}

function Select({ value, onChange, label, children }) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-verified)]"
      >
        {children}
      </select>
    </label>
  )
}
