export default function ErrorState({ title, body, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-sm border border-[var(--color-mark)] bg-[var(--color-mark-soft)] px-6 py-10 text-center">
      <h3 className="font-display text-lg text-[var(--color-mark)]">{title}</h3>
      {body && <p className="max-w-sm text-sm text-[var(--color-ink)]">{body}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-sm border border-[var(--color-mark)] px-4 py-1.5 text-sm font-medium text-[var(--color-mark)] transition hover:bg-[var(--color-mark)] hover:text-[var(--color-paper)]"
        >
          Try again
        </button>
      )}
    </div>
  )
}
