import { useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { adminQueue, subjectById } from '../../mock/data'
import { QuestionSkeleton } from '../../components/Skeleton'
import { useApp } from '../../context/AppContext'

const STEPS = ['review', 'extract', 'verify', 'done']

export default function ReviewPaper() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pushToast } = useApp()
  const paper = adminQueue.find((p) => p.id === id)
  const [step, setStep] = useState('review')
  const [extracting, setExtracting] = useState(false)
  const [questions, setQuestions] = useState([])
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  if (!paper) return <Navigate to="/admin" replace />
  const subject = subjectById(paper.subjectId)

  function approve() {
    pushToast('Paper approved — published to the vault.', 'success')
    setStep('extract')
  }

  function reject() {
    if (!rejectReason.trim()) { pushToast('Add a reason before rejecting.', 'error'); return }
    pushToast('Paper rejected and the uploader notified.', 'info')
    navigate('/admin')
  }

  function runExtraction() {
    setExtracting(true)
    setTimeout(() => {
      setQuestions([
        { id: 'e1', number: '1a', text: 'Define a candidate key and give one example.', marks: 3, topic: subject.units[0].topics[0] },
        { id: 'e2', number: '1b', text: '[unreadable] — please check against the original scan', marks: 5, topic: subject.units[1]?.topics[0] || subject.units[0].topics[1] },
        { id: 'e3', number: '2', text: `Explain ${subject.units[1]?.topics[1] || subject.units[0].topics[0]} with a worked example.`, marks: 8, topic: subject.units[1]?.topics[1] || subject.units[0].topics[0] },
      ])
      setExtracting(false)
      setStep('verify')
      pushToast('Extraction complete — review each question before verifying.', 'success')
    }, 1100)
  }

  function updateQ(id, patch) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }
  function removeQ(id) {
    setQuestions((qs) => qs.filter((q) => q.id !== id))
  }
  function addQ() {
    setQuestions((qs) => [...qs, { id: `new-${Date.now()}`, number: '', text: '', marks: 5, topic: subject.units[0].topics[0] }])
  }

  function markVerified() {
    const hasUnreadable = questions.some((q) => q.text.includes('[unreadable]') || !q.text.trim())
    if (hasUnreadable) { pushToast('Fix or remove unreadable questions before marking verified.', 'error'); return }
    setStep('done')
    pushToast('All questions verified — this paper now feeds the practice generator.', 'success')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/admin" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
        ← Back to the queue
      </Link>

      <div className="mb-6 flex items-center gap-2 text-xs">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full font-mono ${
                STEPS.indexOf(step) >= i ? 'bg-[var(--color-verified)] text-white' : 'border border-[var(--color-rule)] text-[var(--color-ink-soft)]'
              }`}
            >
              {i + 1}
            </span>
            <span className={STEPS.indexOf(step) >= i ? '' : 'text-[var(--color-ink-soft)]'}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-1 text-[var(--color-rule)]">—</span>}
          </div>
        ))}
      </div>

      <h1 className="font-display text-2xl">{subject?.code} — {paper.examType === 'mid' ? 'Mid' : 'End'} Sem {paper.year}</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Uploaded by {paper.uploadedBy}</p>

      <div className="ruled-top my-6 flex h-40 items-center justify-center rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] text-sm text-[var(--color-ink-soft)]">
        PDF preview
      </div>

      <AnimatePresence mode="wait">
        {step === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-wrap gap-3">
              <button onClick={approve} className="rounded-sm bg-[var(--color-verified)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
                Approve
              </button>
              <button onClick={() => setShowReject((v) => !v)} className="rounded-sm border border-[var(--color-mark)] px-5 py-2.5 text-sm font-medium text-[var(--color-mark)] transition hover:bg-[var(--color-mark-soft)]">
                Reject
              </button>
            </div>
            {showReject && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason the uploader will see…"
                  rows={3}
                  className="w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] p-3 text-sm outline-none focus:border-[var(--color-mark)]"
                />
                <button onClick={reject} className="mt-2 rounded-sm bg-[var(--color-mark)] px-4 py-2 text-sm font-medium text-white">
                  Confirm rejection
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 'extract' && (
          <motion.div key="extract" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="mb-4 text-sm text-[var(--color-ink-soft)]">
              Runs once per paper. The result is stored and never re-read automatically.
            </p>
            {extracting ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <QuestionSkeleton key={i} />)}</div>
            ) : (
              <button onClick={runExtraction} className="rounded-sm bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition hover:opacity-90">
                Run extraction
              </button>
            )}
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className={`rounded-sm border p-4 ${q.text.includes('[unreadable]') ? 'border-[var(--color-mark)] bg-[var(--color-mark-soft)]' : 'border-[var(--color-rule)]'}`}>
                <div className="mb-2 flex items-center gap-3 text-xs">
                  <input value={q.number} onChange={(e) => updateQ(q.id, { number: e.target.value })} placeholder="No." className="w-14 rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper)] px-2 py-1 font-mono" />
                  <input type="number" value={q.marks} onChange={(e) => updateQ(q.id, { marks: Number(e.target.value) })} className="w-16 rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper)] px-2 py-1 font-mono" />
                  <span className="text-[var(--color-ink-soft)]">marks</span>
                  <button onClick={() => removeQ(q.id)} className="ml-auto text-[var(--color-mark)] hover:underline">Delete</button>
                </div>
                <textarea
                  value={q.text}
                  onChange={(e) => updateQ(q.id, { text: e.target.value })}
                  rows={2}
                  className="w-full rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper)] p-2 text-sm outline-none focus:border-[var(--color-verified)]"
                />
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <button onClick={addQ} className="rounded-sm border border-[var(--color-rule)] px-4 py-2 text-sm transition hover:bg-[var(--color-paper-raised)]">
                + Add question manually
              </button>
              <button onClick={markVerified} className="rounded-sm bg-[var(--color-verified)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                Mark all verified
              </button>
            </div>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-sm border border-[var(--color-verified)] bg-[var(--color-verified-soft)] p-6 text-center">
            <p className="font-display text-lg text-[var(--color-verified)]">Paper live and verified</p>
            <p className="mt-1 text-sm text-[var(--color-ink)]">Students can now generate practice questions from this paper's unit.</p>
            <Link to="/admin" className="mt-4 inline-block rounded-sm bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-paper)]">
              Back to the queue
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
