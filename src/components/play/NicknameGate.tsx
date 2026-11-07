import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Gamepad2, Heart, ShieldCheck, Sparkles, Trophy, UserRound } from 'lucide-react'
import type { GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { sceneMeta } from '../../game/sceneMeta'

interface NicknameGateProps {
  game: GameRecord
  initialNickname: string
  onStart: (nickname: string) => void
}

export function NicknameGate({ game, initialNickname, onStart }: NicknameGateProps) {
  const { t } = useI18n()
  const [nickname, setNickname] = useState(initialNickname)
  const [error, setError] = useState(false)
  const scene = sceneMeta(game.blueprint.levels[0]?.scene ?? 'map')

  const submit = () => {
    const value = nickname.trim()
    if (value.length < 2 || value.length > 16) {
      setError(true)
      return
    }
    setError(false)
    onStart(value)
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="card-glow w-full p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">
              <Sparkles className="h-3 w-3" />
              {t('play.nicknameEyebrow')}
            </span>
            <h1 className="mt-4 text-balance font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              {t('play.nicknameTitle')}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              {t('play.nicknameSubtitle')}
            </p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-neon/15 to-plum/15 text-neon-soft shadow-[0_0_35px_-12px_rgba(34,211,238,0.8)]">
            <UserRound className="h-6 w-6" />
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <p className="font-pixel text-[8px] uppercase tracking-wider text-slate-500">
            {t('landing.heroCardLabel')}
          </p>
          <h2 className="mt-1.5 font-display text-lg font-semibold leading-snug text-white">
            {game.blueprint.title}
          </h2>
          <p className="mt-1 text-[11px] leading-relaxed text-mist">{game.blueprint.theme}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="neon">
              {t('common.levelsCount', { count: game.blueprint.levels.length })}
            </Badge>
            <Badge tone="violet">{game.analysis.subject}</Badge>
            <Badge tone="outline">{game.analysis.level}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-danger" />
              {t('play.introHp', { hp: game.blueprint.mechanics.hp })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="h-3 w-3 text-gold" />
              {t('play.introPoints', {
                points: game.blueprint.mechanics.points_per_correct,
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-success" />
              {t('play.introBadges', {
                count: game.blueprint.mechanics.badges.length,
              })}
            </span>
          </div>
        </div>

        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <label
            htmlFor="student-nickname"
            className="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
          >
            {t('play.nicknameLabel')}
          </label>
          <div className="relative mt-2">
            <Gamepad2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neon/70" />
            <input
              id="student-nickname"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value)
                if (error) setError(false)
              }}
              maxLength={16}
              autoComplete="off"
              spellCheck={false}
              placeholder={t('play.nicknamePlaceholder')}
              aria-invalid={error}
              aria-describedby={error ? 'nickname-error' : 'nickname-hint'}
              className={`input-base h-14 pl-11 text-base font-semibold tracking-wide ${
                error ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : ''
              }`}
            />
          </div>
          {error && (
            <p id="nickname-error" role="alert" className="mt-2 text-[11px] text-danger">
              {t('play.nicknameError')}
            </p>
          )}
          <p id="nickname-hint" className="mt-2 text-[10px] text-slate-500">
            {t('play.nicknameHint')}
          </p>

          <Button
            type="submit"
            size="lg"
            className="mt-5 w-full"
            icon={<Gamepad2 className="h-4 w-4" />}
          >
            {t('play.nicknameStart')}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-center text-[10px] text-slate-600">
            {t('play.enterHint')}
          </p>
        </form>

        <div className="mt-5 flex items-center justify-center gap-1.5 border-t border-line/60 pt-4 text-[10px] text-slate-600">
          <span className={`flex h-5 w-5 items-center justify-center rounded-md ${scene.chip}`}>
            <scene.icon className="h-3 w-3" />
          </span>
          {t('play.sessionOffline')}
        </div>
      </motion.div>
    </div>
  )
}
