export default function EmptyState({ title, body, action, icon }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-[var(--color-rule)] px-6 py-14 text-center">
      {icon && <div className="text-3xl opacity-60">{icon}</div>}
      <h3 className="font-display text-lg">{title}</h3>
      {body && <p className="max-w-sm text-sm text-[var(--color-ink-soft)]">{body}</p>}
      {action}
    </div>
  )
}
