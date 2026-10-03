import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { papers, subjects } from '../mock/data'

const stats = [
  { label: 'Verified papers', value: papers.filter((p) => p.verified).length },
  { label: 'Subjects covered', value: subjects.length },
  { label: 'Years back', value: '2022–2024' },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <span className="inline-block rounded-sm border border-[var(--color-rule)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-ink-soft)]">
            one college · one branch · papers 2022–2024
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] sm:text-5xl">
            Every past paper,
            <br />
            checked once,
            <br />
            used all exam season.
          </h1>
          <p className="mt-5 max-w-md text-[var(--color-ink-soft)]">
            Download verified previous-year papers and the syllabus, or generate
            fresh practice questions in the style of real exams — built from
            papers an admin has actually checked, not guessed by a chatbot.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/vault"
              className="rounded-sm bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition hover:opacity-90"
            >
              Browse the vault
            </Link>
            <Link
              to="/login"
              className="rounded-sm border border-[var(--color-rule)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--color-paper-raised)]"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="ruled-top rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] p-6 shadow-[0_8px_0_0_var(--color-rule)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[11px] text-[var(--color-ink-soft)]">CS301 · MID SEM 2024</span>
            <span className="stamp inline-block rounded-sm border-2 border-[var(--color-verified)] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase text-[var(--color-verified)]">
              Verified
            </span>
          </div>
          <p className="font-display text-base leading-relaxed text-[var(--color-ink)]">
            "Explain the difference between 2NF and 3NF with an example schema."
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-dashed border-[var(--color-rule)] pt-3 text-xs text-[var(--color-ink-soft)]">
            <span>Normalisation · Unit 2</span>
            <span className="font-mono">5 marks</span>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-4 border-t border-[var(--color-rule)] pt-8 sm:gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
          >
            <p className="font-display text-2xl sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-xs text-[var(--color-ink-soft)] sm:text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
