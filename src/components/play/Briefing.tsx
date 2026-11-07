import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Mic,
  ShieldCheck,
  Sparkles,
  Square,
  Target,
} from 'lucide-react'
import type { GameLevel, GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { sceneMeta } from '../../game/sceneMeta'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface BriefingProps {
  game: GameRecord
  level: GameLevel
  levelIndex: number
  totalLevels: number
  speaking: boolean
  voiceSupported: boolean
  onRead: () => void
  onStart: () => void
  onBack: () => void
}

export function Briefing({
  game,
  level,
  levelIndex,
  totalLevels,
  speaking,
  voiceSupported,
  onRead,
  onStart,
  onBack,
}: BriefingProps) {
  const { t } = useI18n()
  const meta = sceneMeta(level.scene)
  const badge = game.blueprint.mechanics.badges[levelIndex] ?? `#${levelIndex + 1}`
  const objectives = game.analysis.objectives.filter((objective) =>
    level.objective_ids.includes(objective.id),
  )

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-glow overflow-hidden"
      >
        <div
          className={`relative border-b border-line/60 bg-gradient-to-br p-6 sm:p-8 ${meta.gradient}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow">
              <Sparkles className="h-3 w-3" />
              {t('play.briefingEyebrow', { index: levelIndex + 1, total: totalLevels })}
            </span>
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-abyss/40 ${meta.ring} ${meta.text}`}
            >
              <meta.icon className="h-6 w-6" />
            </span>
          </div>

          <h1 className="mt-4 text-balance font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
            {level.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="outline">{level.difficulty}</Badge>
            <Badge tone="neon">
              {t('common.questionsCount', { count: level.questions.length })}
            </Badge>
            <Badge tone="gold">
              <ShieldCheck className="h-3 w-3" />
              {badge}
            </Badge>
          </div>

          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-slate-200 sm:text-base">
            {level.narrative}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRead}
              disabled={!voiceSupported}
              icon={
                speaking ? (
                  <Square className="h-3.5 w-3.5" />
                ) : (
                  <Mic className="h-3.5 w-3.5" />
                )
              }
            >
              {speaking ? t('play.introStop') : t('play.introRead')}
            </Button>
            {!voiceSupported && (
              <span className="text-[10px] text-slate-500">{t('play.voiceUnsupported')}</span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <Target className="h-3 w-3" />
            {t('play.briefingObjectives')}
          </h2>
          <ul className="mt-3 space-y-2">
            {objectives.map((objective) => (
              <li
                key={objective.id}
                className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success/80" />
                <p className="text-xs leading-relaxed text-slate-300">{objective.text}</p>
              </li>
            ))}
            {objectives.length === 0 && (
              <li className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <p className="text-xs leading-relaxed text-slate-400">
                  {t('dashboard.noObjective')}
                </p>
              </li>
            )}
          </ul>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              {t('play.briefingBack')}
            </Button>
            <Button size="lg" onClick={onStart} icon={<meta.icon className="h-4 w-4" />}>
              {t('play.briefingStart')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
