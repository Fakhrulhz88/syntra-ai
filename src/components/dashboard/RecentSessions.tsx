import { Activity, Heart, Users } from 'lucide-react'
import type { GameSession } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'

interface RecentSessionsProps {
  sessions: GameSession[]
  levels: number
  totalQuestions: number
  filter: number | 'all'
  onFilter: (value: number | 'all') => void
}

export function RecentSessions({
  sessions,
  levels,
  totalQuestions,
  filter,
  onFilter,
}: RecentSessionsProps) {
  const { t } = useI18n()
  const options: Array<{ value: number | 'all'; label: string }> = [
    { value: 'all', label: t('dashboard.filterAll') },
    ...Array.from({ length: levels }).map((_, index) => ({
      value: index + 1,
      label: t('dashboard.filterLevel', { level: index + 1 }),
    })),
  ]

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-white">
            {t('dashboard.recentTitle')}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {t('dashboard.recentSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge tone="success" dot pulse>
            {t('dashboard.live')}
          </Badge>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon-soft">
            <Activity className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onFilter(option.value)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition',
              filter === option.value
                ? 'border-neon/40 bg-neon/10 text-neon-soft'
                : 'border-line bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-300',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-line px-4 py-8 text-center">
          <Users className="h-6 w-6 text-slate-600" />
          <p className="mt-2 text-xs font-semibold text-slate-300">
            {t('dashboard.noSessions')}
          </p>
          <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-slate-500">
            {t('dashboard.noSessionsDesc')}
          </p>
        </div>
      ) : (
        <ul className="mt-3 max-h-[420px] space-y-1.5 overflow-y-auto pr-0.5">
          {sessions.map((session, index) => {
            const correct = session.answers.filter((answer) => answer.correct).length
            return (
              <li
                key={`${session.nickname}-${index}`}
                className="flex items-center gap-2.5 rounded-xl border border-line/70 bg-white/[0.02] px-2.5 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-deep/80 text-[10px] font-bold text-slate-300">
                  {session.nickname.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">
                    {session.nickname}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-slate-500">
                    <span>
                      {t('dashboard.correctShort', {
                        correct,
                        total: totalQuestions,
                      })}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 text-danger/70" />
                      {t('dashboard.hpLeft', { hp: session.hp })}
                    </span>
                    <span>{t('dashboard.answered')}: {session.answers.length}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-xs font-bold tabular-nums text-gold">
                    {session.score}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    {t('dashboard.targetLevel', { level: session.level_reached })}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
