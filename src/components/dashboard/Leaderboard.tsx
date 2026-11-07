import { Crown, Medal, Trophy } from 'lucide-react'
import type { LeaderboardEntry } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

const rankStyles = [
  'border-gold/35 bg-gold/10 text-gold',
  'border-slate-300/25 bg-slate-300/10 text-slate-200',
  'border-[#c98a5a]/30 bg-[#c98a5a]/10 text-[#e0a577]',
]

export function Leaderboard({ entries }: LeaderboardProps) {
  const { t } = useI18n()

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-white">
            {t('dashboard.leaderboardTitle')}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {t('dashboard.leaderboardSubtitle')}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <Trophy className="h-4 w-4" />
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="mt-6 text-center text-xs text-slate-500">
          {t('dashboard.noSessions')}
        </p>
      ) : (
        <ol className="mt-4 space-y-1.5">
          {entries.map((entry, index) => {
            const style = rankStyles[index] ?? 'border-line bg-white/[0.02] text-slate-400'
            return (
              <li
                key={`${entry.nickname}-${index}`}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border px-2.5 py-2',
                  index < 3 ? style : 'border-line/70 bg-white/[0.02]',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-[10px] font-bold',
                    style,
                  )}
                >
                  {index === 0 ? (
                    <Crown className="h-3.5 w-3.5" />
                  ) : index === 1 || index === 2 ? (
                    <Medal className="h-3.5 w-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-deep/80 text-[10px] font-bold text-slate-300">
                  {entry.nickname.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">
                    {entry.nickname}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    {t('dashboard.targetLevel', { level: entry.level_reached })}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-gold">
                  {entry.score}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
