import { motion } from 'framer-motion'

export default function StatusBadge({ status }) {
  if (status === 'approved' || status === 'verified') {
    return (
      <motion.span
        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
        animate={{ opacity: 1, rotate: -6, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="stamp inline-flex items-center gap-1 rounded-sm border-2 border-[var(--color-verified)] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--color-verified)]"
      >
        Verified
      </motion.span>
    )
  }
  if (status === 'unverified') {
    return (
      <span className="inline-flex items-center gap-1 rounded-sm border border-dashed border-[var(--color-pending)] bg-[var(--color-pending-soft)] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--color-pending)]">
        Awaiting verification
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 rounded-sm border border-dashed border-[var(--color-pending)] bg-[var(--color-pending-soft)] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--color-pending)]">
        Pending review
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-sm border border-[var(--color-mark)] bg-[var(--color-mark-soft)] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mark)]">
        Rejected
      </span>
    )
  }
  return null
}
