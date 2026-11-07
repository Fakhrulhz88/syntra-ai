import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface SegmentOption<T extends string> {
  value: T
  label: string
  hint?: string
  icon?: ReactNode
  disabled?: boolean
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: SegmentOption<T>[]
  onChange: (value: T) => void
  columns?: 2 | 3
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  columns = 2,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={option.disabled}
            aria-pressed={selected}
            className={cn(
              'group relative flex items-start gap-2.5 rounded-xl border p-3 text-left transition',
              selected
                ? 'border-neon/50 bg-neon/[0.08] shadow-[inset_0_0_24px_-12px_rgba(34,211,238,0.7)]'
                : 'border-line bg-deep/60 hover:border-white/20 hover:bg-white/[0.04]',
              option.disabled && 'cursor-not-allowed opacity-40',
            )}
          >
            {option.icon && (
              <span
                className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
                  selected
                    ? 'border-neon/30 bg-neon/10 text-neon-soft'
                    : 'border-white/10 bg-white/[0.03] text-mist',
                )}
              >
                {option.icon}
              </span>
            )}
            <span className="min-w-0">
              <span
                className={cn(
                  'block text-xs font-semibold',
                  selected ? 'text-white' : 'text-slate-200',
                )}
              >
                {option.label}
              </span>
              {option.hint && (
                <span className="mt-0.5 block text-[10px] leading-tight text-slate-500">
                  {option.hint}
                </span>
              )}
            </span>
            {selected && (
              <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-neon text-[8px] font-bold text-abyss">
                ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
