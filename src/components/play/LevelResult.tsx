import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Map,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react'
import type { GameLevel } from '../../types'
import { useI18n } from '../../i18n'
import { sceneMeta } from '../../game/sceneMeta'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface LevelResultProps {
  level: GameLevel
  levelIndex: number
  totalLevels: number
  correct: number
  totalQuestions: number
  score: number
  hp: number
  maxHp: number
  badge: string
  completedCount: number
  hasNext: boolean
  onNext: () => void
  onMap: () => void
}

export function LevelResult({
  level,
  levelIndex,
  totalLevels,
  correct,
  totalQuestions,
  score,
  hp,
  maxHp,
  badge,
  completedCount,
  hasNext,
  onNext,
  onMap,
}: LevelResultProps) {
  const { t } = useI18n()
  const meta = sceneMeta(level.scene)
  const accuracy = totalQuestions === 0 ? 0 : Math.round((correct / totalQuestions) * 100)

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-64px)] w-full max-w-2xl items-center px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="card-glow w-full p-6 text-center sm:p-9"
      >
        <span className="eyebrow border-success/30 bg-success/10 text-success">
          <CheckCircle2 className="h-3 w-3" />
          {t('play.levelCompleteEyebrow')}
        </span>
        <h1 className="mt-4 text-balance font-display text-2xl font-bold text-white sm:text-3xl">
          {t('play.levelCompleteTitle')}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mist">
          {t('play.levelCompleteDesc', {
            level: level.name,
            correct,
            total: totalQuestions,
          })}
        </p>

        <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/[0.1] via-transparent to-gold/[0.05] p-4 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold/70">
              {t('play.badgeEarned')}
            </p>
            <p className="truncate font-display text-sm font-semibold text-white">{badge}</p>
          </div>
          <Star className="h-5 w-5 shrink-0 fill-gold/40 text-gold" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <Trophy className="mx-auto h-4 w-4 text-gold" />
            <p className="mt-1 font-mono text-lg font-bold text-white">{score}</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              {t('play.score')}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <Sparkles className="mx-auto h-4 w-4 text-neon-soft" />
            <p className="mt-1 font-mono text-lg font-bold text-white">{accuracy}%</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              {t('common.accuracy')}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <Heart className="mx-auto h-4 w-4 text-danger" />
            <p className="mt-1 font-mono text-lg font-bold text-white">
              {hp}/{maxHp}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              {t('play.hpLabel')}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <span className={`mx-auto flex h-4 w-4 items-center justify-center ${meta.text}`}>
              <meta.icon className="h-4 w-4" />
            </span>
            <p className="mt-1 font-mono text-lg font-bold text-white">
              {levelIndex + 1}/{totalLevels}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              {t('common.level')}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={onMap} icon={<Map className="h-4 w-4" />}>
            {t('play.continueMap')}
          </Button>
          <Button onClick={onNext} icon={hasNext ? <ArrowRight className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}>
            {hasNext ? t('play.nextLevel') : t('common.finish')}
          </Button>
        </div>
        <div className="mt-4 flex justify-center">
          <Badge tone="outline">
            {t('play.badgeProgress', {
              earned: completedCount,
              total: totalLevels,
            })}
          </Badge>
        </div>
      </motion.section>
    </div>
  )
}
