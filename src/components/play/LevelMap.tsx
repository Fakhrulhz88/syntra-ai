import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Lock,
  MapPin,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react'
import type { GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { sceneMeta } from '../../game/sceneMeta'
import { Badge } from '../ui/Badge'
import { Progress } from '../ui/Progress'

interface LevelMapProps {
  game: GameRecord
  nickname: string
  score: number
  completed: number[]
  activeLevelIndex: number
  onSelect: (index: number) => void
}

export function LevelMap({
  game,
  nickname,
  score,
  completed,
  activeLevelIndex,
  onSelect,
}: LevelMapProps) {
  const { t } = useI18n()
  const total = game.blueprint.levels.length
  const progress = Math.round((completed.length / total) * 100)
  const badges = game.blueprint.mechanics.badges

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">
              <Sparkles className="h-3 w-3" />
              {nickname}
            </span>
            <h1 className="mt-3 text-balance font-display text-2xl font-bold text-white sm:text-3xl">
              {t('play.mapTitle')}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-mist">
              {t('play.mapSubtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-2xl border border-gold/20 bg-gold/[0.05] px-3.5 py-2 text-right">
              <p className="text-[9px] font-bold uppercase tracking-wider text-gold/70">
                {t('play.score')}
              </p>
              <p className="font-mono text-lg font-bold text-gold">{score}</p>
            </div>
            <div className="rounded-2xl border border-success/20 bg-success/[0.05] px-3.5 py-2 text-right">
              <p className="text-[9px] font-bold uppercase tracking-wider text-success/70">
                {t('play.badgesEarned')}
              </p>
              <p className="font-mono text-lg font-bold text-success">{completed.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <span>{t('play.progress')}</span>
            <span className="font-mono text-neon-soft">
              {completed.length}/{total} · {progress}%
            </span>
          </div>
          <Progress value={progress} className="mt-1.5" />
        </div>

        <p className="mt-5 flex items-center gap-1.5 text-[10px] text-slate-500">
          <MapPin className="h-3 w-3 text-neon/70" />
          {t('play.mapHint')}
        </p>

        <ol className="relative mt-4 space-y-3.5">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-[29px] top-8 w-px bg-gradient-to-b from-neon/40 via-plum/30 to-transparent"
          />
          {game.blueprint.levels.map((level, index) => {
            const meta = sceneMeta(level.scene)
            const done = completed.includes(index)
            const unlocked = index === 0 || completed.includes(index - 1)
            const active = index === activeLevelIndex && !done
            const badge = badges[index] ?? `#${index + 1}`

            return (
              <motion.li
                key={level.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
                className="relative flex items-stretch gap-3"
              >
                <div className="relative z-10 flex w-14 shrink-0 items-start justify-center pt-4">
                  <span
                    className={cn(
                      'relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-deep shadow-card',
                      unlocked ? meta.ring : 'border-line',
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 animate-pulse-ring rounded-2xl border border-neon/50" />
                    )}
                    {unlocked ? (
                      <meta.icon className={cn('h-6 w-6', meta.text)} />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-600" />
                    )}
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-abyss font-mono text-[9px] font-bold text-slate-400">
                      {index + 1}
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => onSelect(index)}
                  className={cn(
                    'group flex min-w-0 flex-1 items-center gap-4 rounded-2xl border p-4 text-left transition',
                    unlocked
                      ? 'border-line/80 bg-panel/75 hover:-translate-y-0.5 hover:border-neon/40 hover:bg-raised/70'
                      : 'cursor-not-allowed border-line/50 bg-panel/40 opacity-60',
                    active && 'border-neon/40 shadow-glow',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {done ? (
                        <Badge tone="success" dot>
                          {t('play.levelDone')}
                        </Badge>
                      ) : active ? (
                        <Badge tone="neon" dot pulse>
                          {t('play.levelCurrent')}
                        </Badge>
                      ) : unlocked ? (
                        <Badge tone="outline">{t('play.levelAvailable')}</Badge>
                      ) : (
                        <Badge tone="neutral">
                          <Lock className="h-2.5 w-2.5" />
                          {t('play.levelLocked')}
                        </Badge>
                      )}
                      <Badge tone="neutral">{level.difficulty}</Badge>
                    </div>
                    <h2 className="mt-1.5 truncate font-display text-sm font-semibold text-white sm:text-base">
                      {level.name}
                    </h2>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                      {level.narrative}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                      <span>{t('common.questionsCount', { count: level.questions.length })}</span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-success/70" />
                        {badge}
                      </span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition',
                      unlocked
                        ? 'border-neon/30 bg-neon/10 text-neon-soft group-hover:bg-neon/20'
                        : 'border-line bg-white/[0.02] text-slate-600',
                    )}
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : unlocked ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ol>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
          <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Trophy className="h-3.5 w-3.5 text-gold" />
            {t('play.badgeProgress', { earned: completed.length, total })}
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neon-soft">
            {completed.length === total ? t('play.levelReplay') : t('play.levelStart')}
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </motion.div>
    </div>
  )
}
