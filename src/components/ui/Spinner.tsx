import { cn } from '../../lib/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-neon/25 border-t-neon',
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-sm text-mist">
      <Spinner className="h-7 w-7" />
      <p>{label}</p>
    </div>
  )
}
