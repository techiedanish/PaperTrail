import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'
import { subjectById } from '../mock/data'

const EXAM_LABEL = { mid: 'Mid Semester', end: 'End Semester' }

export default function PaperCard({ paper, index = 0 }) {
  const subject = subjectById(paper.subjectId)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        to={`/paper/${paper.id}`}
        className="ruled-top group block rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-rule)]"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="font-mono text-[11px] text-[var(--color-ink-soft)]">{subject?.code}</span>
          <StatusBadge status={paper.verified ? 'verified' : 'unverified'} />
        </div>
        <h3 className="font-display text-lg leading-snug">{subject?.name}</h3>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          {EXAM_LABEL[paper.examType]} · {paper.year}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[var(--color-ink-soft)]">
            {paper.questionCount > 0 ? `${paper.questionCount} questions` : 'Not yet digitised'}
          </span>
          <span className="font-medium text-[var(--color-verified)] opacity-0 transition group-hover:opacity-100">
            View paper →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
