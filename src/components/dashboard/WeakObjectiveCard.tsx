import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import type { ObjectiveStat } from '../../types'
import { useI18n } from '../../i18n'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface WeakObjectiveCardProps {
  objective?: ObjectiveStat
  onRegenerate: () => void
}

export function WeakObjectiveCard({ objective, onRegenerate }: WeakObjectiveCardProps) {
  const { t } = useI18n()

  if (!objective) {
    return (
      <div className="rounded-2xl border border-success/25 bg-success/[0.06] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              {t('dashboard.weakNone')}
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-mist">
              {t('dashboard.weakNoneDesc')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-danger/25 bg-gradient-to-br from-danger/[0.08] via-transparent to-plum/[0.05] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-danger/30 bg-danger/10 text-danger">
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-display text-sm font-semibold text-white">
              {t('dashboard.weakTitle')}
            </h3>
            <Badge tone="danger">{objective.accuracy}%</Badge>
            <Badge tone="outline">{t('dashboard.suggested')}</Badge>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-mist">
            {t('dashboard.weakDesc', {
              objective: objective.text,
              accuracy: objective.accuracy,
            })}
          </p>
        </div>
      </div>
      <Button
        variant="danger"
        size="sm"
        onClick={onRegenerate}
        className="mt-3 w-full"
        icon={<Sparkles className="h-3.5 w-3.5" />}
      >
        {t('dashboard.weakAction')}
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
