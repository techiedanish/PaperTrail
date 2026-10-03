import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { subjects } from '../mock/data'

export default function Syllabus() {
  const [subjectId, setSubjectId] = useState(subjects[0].id)
  const [openUnit, setOpenUnit] = useState(subjects[0].units[0].id)
  const subject = subjects.find((s) => s.id === subjectId)

  function pick(id) {
    setSubjectId(id)
    setOpenUnit(subjects.find((s) => s.id === id).units[0].id)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl">Syllabus</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        Loaded once per subject — this is what the practice generator draws its units and topics from.
      </p>

      <div className="my-6 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => pick(s.id)}
            className={`rounded-sm border px-3 py-1.5 text-sm transition ${
              s.id === subjectId
                ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]'
                : 'border-[var(--color-rule)] text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-raised)]'
            }`}
          >
            {s.code}
          </button>
        ))}
      </div>

      <motion.div
        key={subjectId}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="divide-y divide-[var(--color-rule)] rounded-sm border border-[var(--color-rule)]"
      >
        {subject.units.map((u) => {
          const open = openUnit === u.id
          return (
            <div key={u.id}>
              <button
                onClick={() => setOpenUnit(open ? null : u.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-display text-base">{u.title}</span>
                <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-xl text-[var(--color-ink-soft)]">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <ul className="mb-4 space-y-1.5">
                        {u.topics.map((t) => (
                          <li key={t} className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
                            <span className="h-1 w-1 rounded-full bg-[var(--color-ink-soft)]" /> {t}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/practice?subject=${subjectId}&unit=${u.id}`}
                        className="inline-block rounded-sm border border-[var(--color-verified)] px-3 py-1.5 text-sm font-medium text-[var(--color-verified)] transition hover:bg-[var(--color-verified-soft)]"
                      >
                        Practice from this unit →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
