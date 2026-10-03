import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { subjects, verifiedQuestions } from '../mock/data'
import { QuestionSkeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'

const DAILY_LIMIT = 5

export default function Practice() {
  const [params] = useSearchParams()
  const { history, addGeneratedSet, generationsToday, pushToast } = useApp()
  const [tab, setTab] = useState('generate')
  const [subjectId, setSubjectId] = useState(params.get('subject') || subjects[0].id)
  const [unitId, setUnitId] = useState(params.get('unit') || subjects[0].units[0].id)
  const [count, setCount] = useState(5)
  const [status, setStatus] = useState('idle') // idle | loading | error-limit | error-insufficient | done
  const [result, setResult] = useState(null)

  const subject = subjects.find((s) => s.id === subjectId)

  useEffect(() => {
    const first = subjects.find((s) => s.id === subjectId)?.units[0]?.id
    if (first && !subject?.units.some((u) => u.id === unitId)) setUnitId(first)
  }, [subjectId]) // eslint-disable-line react-hooks/exhaustive-deps

  function pool() {
    const unit = subject.units.find((u) => u.id === unitId)
    const all = verifiedQuestions[subjectId] || []
    return all.filter((q) => unit?.topics.includes(q.topic))
  }

  function generate() {
    if (generationsToday >= DAILY_LIMIT) {
      setStatus('error-limit')
      return
    }
    setStatus('loading')
    setResult(null)
    setTimeout(() => {
      const source = pool()
      if (source.length < 2) {
        setStatus('error-insufficient')
        return
      }
      const picked = [...source].sort(() => Math.random() - 0.5).slice(0, Math.min(count, source.length))
      const set = {
        id: `g${Date.now()}`,
        subjectId,
        unitId,
        createdAt: new Date().toISOString().slice(0, 10),
        questions: picked.map((q, i) => ({ ...q, id: `${q.id}-${i}` })),
      }
      setResult(set)
      addGeneratedSet(set)
      setStatus('done')
    }, 900)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl">Practice generator</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        Built only from verified past questions — never reads a PDF when you click Generate.
      </p>

      <div className="my-6 flex gap-1 rounded-sm border border-[var(--color-rule)] p-1 text-sm">
        {['generate', 'history'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-sm py-1.5 capitalize transition ${
              tab === t ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-ink-soft)]'
            }`}
          >
            {t === 'generate' ? 'Generate' : `History (${history.length})`}
          </button>
        ))}
      </div>

      {tab === 'generate' ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Subject">
              <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={selectCls}>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.code}</option>)}
              </select>
            </Field>
            <Field label="Unit">
              <select value={unitId} onChange={(e) => setUnitId(e.target.value)} className={selectCls}>
                {subject.units.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}
              </select>
            </Field>
            <Field label={`How many? (max 10)`}>
              <input
                type="number" min={1} max={10} value={count}
                onChange={(e) => setCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                className={selectCls}
              />
            </Field>
          </div>

          <button
            onClick={generate}
            disabled={status === 'loading'}
            className="mt-5 flex items-center gap-2 rounded-sm bg-[var(--color-verified)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition hover:opacity-90 disabled:opacity-70"
          >
            {status === 'loading' && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {status === 'loading' ? 'Generating…' : 'Generate practice set'}
          </button>
          <p className="mt-2 text-xs text-[var(--color-ink-soft)]">{DAILY_LIMIT - generationsToday} of {DAILY_LIMIT} left today</p>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {status === 'loading' && (
                <motion.div key="loading" exit={{ opacity: 0 }} className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => <QuestionSkeleton key={i} />)}
                </motion.div>
              )}
              {status === 'error-limit' && (
                <ErrorState
                  title="Daily limit reached"
                  body={`You've used all ${DAILY_LIMIT} practice sets for today. This resets tomorrow — it keeps the free AI quota available for everyone.`}
                />
              )}
              {status === 'error-insufficient' && (
                <ErrorState
                  title="Not enough verified questions yet"
                  body="This unit doesn't have enough checked past questions to generate from safely. Try another unit, or help by uploading a missing paper."
                  onRetry={generate}
                />
              )}
              {status === 'done' && result && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
                    Preview — Kenshi uses mock data; the real model runs from Samurai onward
                  </p>
                  {result.questions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-l-2 border-[var(--color-verified)] py-2 pl-4"
                    >
                      <div className="mb-1 flex items-center justify-between font-mono text-xs text-[var(--color-ink-soft)]">
                        <span>{q.topic}</span>
                        <span>{q.marks} marks</span>
                      </div>
                      <p>{q.text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <HistoryList history={history} />
      )}
    </div>
  )
}

function HistoryList({ history }) {
  if (history.length === 0) {
    return <EmptyState icon="🗂" title="No generated sets yet" body="Generate your first practice set and it will be saved here." />
  }
  return (
    <div className="space-y-6">
      {history.map((set) => {
        const subject = subjects.find((s) => s.id === set.subjectId)
        return (
          <div key={set.id} className="rounded-sm border border-[var(--color-rule)] p-5">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-display">{subject?.code} · {subject?.units.find((u) => u.id === set.unitId)?.title}</span>
              <span className="text-[var(--color-ink-soft)]">{set.createdAt}</span>
            </div>
            <ul className="space-y-2 text-sm">
              {set.questions.map((q) => (
                <li key={q.id} className="flex items-start justify-between gap-3 border-t border-dashed border-[var(--color-rule)] pt-2">
                  <span>{q.text}</span>
                  <span className="shrink-0 font-mono text-xs text-[var(--color-ink-soft)]">{q.marks}m</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

const selectCls = 'w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-verified)]'

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-[var(--color-ink-soft)]">{label}</span>
      {children}
    </label>
  )
}
