import { cn } from '../../lib/cn'

interface ProgressProps {
  value: number
  className?: string
  barClassName?: string
  label?: string
}

export function Progress({ value, className, barClassName, label }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-white/[0.07]', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
    >
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-neon via-[#38bdf8] to-plum transition-[width] duration-500 ease-out',
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
