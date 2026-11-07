import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

type KpiTone = 'neon' | 'gold' | 'success' | 'danger' | 'violet'

const tones: Record<KpiTone, { card: string; icon: string }> = {
  neon: { card: 'border-neon/20 bg-neon/[0.045]', icon: 'border-neon/25 bg-neon/10 text-neon-soft' },
  gold: { card: 'border-gold/20 bg-gold/[0.045]', icon: 'border-gold/25 bg-gold/10 text-gold' },
  success: {
    card: 'border-success/20 bg-success/[0.045]',
    icon: 'border-success/25 bg-success/10 text-success',
  },
  danger: {
    card: 'border-danger/20 bg-danger/[0.045]',
    icon: 'border-danger/25 bg-danger/10 text-danger',
  },
  violet: {
    card: 'border-plum/20 bg-plum/[0.045]',
    icon: 'border-plum/25 bg-plum/10 text-plum-soft',
  },
}

interface KpiCardProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  tone?: KpiTone
}

export function KpiCard({ icon: Icon, label, value, sub, tone = 'neon' }: KpiCardProps) {
  const palette = tones[tone]
  return (
    <div className={cn('rounded-2xl border p-4 sm:p-5', palette.card)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border',
            palette.icon,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
        {value}
      </p>
      {sub && <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{sub}</p>}
    </div>
  )
}
