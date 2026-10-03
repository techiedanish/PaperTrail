function shimmer(extra = '') {
  return `animate-pulse rounded-sm bg-[var(--color-ink)]/8 ${extra}`
}

export function CardSkeleton() {
  return (
    <div className="ruled-top rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] p-5">
      <div className={shimmer('h-3 w-16 mb-3')} />
      <div className={shimmer('h-5 w-3/4 mb-2')} />
      <div className={shimmer('h-3 w-1/2 mb-5')} />
      <div className={shimmer('h-8 w-28')} />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-rule)] py-4">
      <div className="space-y-2">
        <div className={shimmer('h-4 w-40')} />
        <div className={shimmer('h-3 w-24')} />
      </div>
      <div className={shimmer('h-6 w-20')} />
    </div>
  )
}

export function QuestionSkeleton() {
  return (
    <div className="border-l-2 border-[var(--color-rule)] py-3 pl-4">
      <div className={shimmer('h-3 w-12 mb-2')} />
      <div className={shimmer('h-4 w-full mb-1.5')} />
      <div className={shimmer('h-4 w-2/3')} />
    </div>
  )
}
