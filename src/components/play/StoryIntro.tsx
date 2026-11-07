import { motion } from 'framer-motion'
import {
  ArrowRight,
  Heart,
  Map,
  Mic,
  ShieldCheck,
  Sparkles,
  Square,
  Trophy,
} from 'lucide-react'
import type { GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { sceneMeta } from '../../game/sceneMeta'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface StoryIntroProps {
  game: GameRecord
  nickname: string
  speaking: boolean
  voiceSupported: boolean
  onRead: () => void
  onStart: () => void
}

export function StoryIntro({
  game,
  nickname,
  speaking,
  voiceSupported,
  onRead,
  onStart,
}: StoryIntroProps) {
  const { t } = useI18n()
  const mechanics = game.blueprint.mechanics
  const firstScene = sceneMeta(game.blueprint.levels[0]?.scene ?? 'map')

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="card-glow overflow-hidden"
      >
        <div className="relative border-b border-line/60 bg-gradient-to-br from-neon/[0.08] via-transparent to-plum/[0.08] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">
              <Sparkles className="h-3 w-3" />
              {t('play.introEyebrow')}
            </span>
            <Badge tone="outline">{nickname}</Badge>
            <Badge tone="violet">{game.analysis.subject}</Badge>
            <Badge tone="neutral">{game.analysis.level}</Badge>
          </div>
          <h1 className="mt-4 text-balance font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
            {game.blueprint.title}
          </h1>
          <p className="mt-2 text-sm text-mist">{game.blueprint.theme}</p>
          <p className="mt-5 max-w-3xl text-pretty text-sm leading-relaxed text-slate-200 sm:text-base">
            {game.blueprint.story_intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
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
              <span className="inline-flex items-center text-[10px] text-slate-500">
                {t('play.voiceUnsupported')}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {t('play.introMechanics')}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-danger/20 bg-danger/[0.05] p-3.5">
              <Heart className="h-4 w-4 text-danger" />
              <p className="mt-2 font-display text-lg font-bold text-white">{mechanics.hp}</p>
              <p className="text-[10px] leading-tight text-slate-500">{t('play.hpLabel')}</p>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-3.5">
              <Trophy className="h-4 w-4 text-gold" />
              <p className="mt-2 font-display text-lg font-bold text-white">
                {mechanics.points_per_correct}
              </p>
              <p className="text-[10px] leading-tight text-slate-500">
                {t('play.introPoints', { points: mechanics.points_per_correct })}
              </p>
            </div>
            <div className="rounded-2xl border border-success/20 bg-success/[0.05] p-3.5">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="mt-2 font-display text-lg font-bold text-white">
                {mechanics.badges.length}
              </p>
              <p className="text-[10px] leading-tight text-slate-500">
                {t('play.introBadges', { count: mechanics.badges.length })}
              </p>
            </div>
            <div className="rounded-2xl border border-neon/20 bg-neon/[0.05] p-3.5">
              <Map className="h-4 w-4 text-neon-soft" />
              <p className="mt-2 font-display text-lg font-bold text-white">
                {game.blueprint.levels.length}
              </p>
              <p className="text-[10px] leading-tight text-slate-500">
                {t('play.introLevels', { count: game.blueprint.levels.length })}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {t('play.introMission')}
            </h3>
            <ul className="mt-3 space-y-2">
              {game.blueprint.levels.map((level, index) => {
                const meta = sceneMeta(level.scene)
                return (
                  <li key={level.id} className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${meta.ring} ${meta.chip}`}
                    >
                      <meta.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">
                        {index + 1}. {level.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {t('common.questionsCount', { count: level.questions.length })} ·{' '}
                        {level.difficulty}
                      </p>
                    </div>
                    <Badge tone={index === 0 ? 'neon' : 'outline'} className="shrink-0">
                      {mechanics.badges[index] ?? `#${index + 1}`}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className={`flex h-5 w-5 items-center justify-center rounded-md ${firstScene.chip}`}>
                <firstScene.icon className="h-3 w-3" />
              </span>
              {t('play.reviewNote')}
            </p>
            <Button size="lg" onClick={onStart} icon={<Map className="h-4 w-4" />}>
              {t('play.introStart')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
