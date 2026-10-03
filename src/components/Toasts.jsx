import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:pr-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto rounded-sm border px-4 py-2.5 text-sm shadow-sm ${
              t.kind === 'error'
                ? 'border-[var(--color-mark)] bg-[var(--color-mark-soft)] text-[var(--color-mark)]'
                : t.kind === 'success'
                ? 'border-[var(--color-verified)] bg-[var(--color-verified-soft)] text-[var(--color-verified)]'
                : 'border-[var(--color-rule)] bg-[var(--color-paper-raised)] text-[var(--color-ink)]'
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
