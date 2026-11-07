import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeTone =
  | 'neutral'
  | 'neon'
  | 'violet'
  | 'gold'
  | 'success'
  | 'danger'
  | 'outline'

const tones: Record<BadgeTone, string> = {
  neutral: 'border-white/10 bg-white/[0.06] text-slate-300',
  neon: 'border-neon/25 bg-neon/10 text-neon-soft',
  violet: 'border-plum/25 bg-plum/10 text-plum-soft',
  gold: 'border-gold/30 bg-gold/10 text-gold',
  success: 'border-success/25 bg-success/10 text-success',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  outline: 'border-line bg-transparent text-mist',
}

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
  dot?: boolean
  pulse?: boolean
}

export function Badge({
  children,
  tone = 'neutral',
  className,
  dot = false,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none',
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70" />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  )
}
