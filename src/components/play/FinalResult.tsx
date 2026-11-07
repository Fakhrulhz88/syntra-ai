import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Gamepad2,
  Heart,
  HeartCrack,
  LayoutDashboard,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react'
import type { GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { shareUrl } from '../../lib/format'
import { Badge } from '../ui/Badge'
import { Button, LinkButton } from '../ui/Button'
import { CopyButton } from '../ui/CopyButton'
import { Spinner } from '../ui/Spinner'

export type SessionSaveState = 'idle' | 'saving' | 'saved' | 'error'

interface FinalResultProps {
  game: GameRecord
  nickname: string
  won: boolean
  score: number
  hp: number
  maxHp: number
  correct: number
  totalQuestions: number
  levelReached: number
  badges: string[]
  saveState: SessionSaveState
  onPlayAgain: () => void
}

export function FinalResult({
  game,
  nickname,
  won,
  score,
  hp,
  maxHp,
  correct,
  totalQuestions,
  levelReached,
  badges,
  saveState,
  onPlayAgain,
}: FinalResultProps) {
  const { t } = useI18n()
  const totalLevels = game.blueprint.levels.length
  const accuracy = totalQuestions === 0 ? 0 : Math.round((correct / totalQuestions) * 100)
  const link = shareUrl(`/play/${game.id}`)

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-64px)] w-full max-w-2xl items-center px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card-glow w-full overflow-hidden"
      >
        <div
          className={`relative border-b border-line/60 p-6 text-center sm:p-9 ${
            won
              ? 'bg-gradient-to-br from-gold/[0.12] via-transparent to-neon/[0.08]'
              : 'bg-gradient-to-br from-danger/[0.12] via-transparent to-plum/[0.08]'
          }`}
        >
          <span
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${
              won
                ? 'border-gold/35 bg-gold/10 text-gold shadow-[0_0_45px_-12px_rgba(245,196,81,0.9)]'
                : 'border-danger/35 bg-danger/10 text-danger shadow-[0_0_45px_-12px_rgba(251,113,133,0.9)]'
            }`}
          >
            {won ? <Crown className="h-8 w-8" /> : <HeartCrack className="h-8 w-8" />}
          </span>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {nickname}
          </p>
          <h1 className="mt-2 text-balance font-display text-2xl font-bold text-white sm:text-4xl">
            {won ? t('play.winTitle') : t('play.gameOverTitle')}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mist">
            {won ? t('play.winDesc') : t('play.gameOverDesc')}
          </p>

          <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-white/10 bg-abyss/50 px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {t('play.finalScore')}
            </p>
            <p className="font-mono text-4xl font-bold tabular-nums text-gold">{score}</p>
            <p className="mt-1 text-[10px] text-slate-500">{accuracy}% {t('common.accuracy').toLowerCase()}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-center">
              <CheckCircle2 className="mx-auto h-4 w-4 text-success" />
              <p className="mt-1 font-mono text-lg font-bold text-white">
                {correct}/{totalQuestions}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                {t('play.correctAnswers')}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-center">
              <Trophy className="mx-auto h-4 w-4 text-gold" />
              <p className="mt-1 font-mono text-lg font-bold text-white">
                {levelReached}/{totalLevels}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                {t('play.levelReached')}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-center">
              <Heart className="mx-auto h-4 w-4 text-danger" />
              <p className="mt-1 font-mono text-lg font-bold text-white">
                {hp}/{maxHp}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                {t('play.hpLabel')}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-center">
              <ShieldCheck className="mx-auto h-4 w-4 text-plum-soft" />
              <p className="mt-1 font-mono text-lg font-bold text-white">
                {badges.length}/{totalLevels}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                {t('play.badgesEarned')}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {t('play.badgesEarned')}
            </p>
            {badges.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {badges.map((badge) => (
                  <Badge key={badge} tone="gold">
                    <Sparkles className="h-3 w-3" />
                    {badge}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">{t('play.noBadges')}</p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px]">
            {saveState === 'saving' && (
              <>
                <Spinner className="h-3.5 w-3.5" />
                <span className="text-mist">{t('play.sessionSaving')}</span>
              </>
            )}
            {saveState === 'saved' && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-success">{t('play.sessionSaved')}</span>
              </>
            )}
            {saveState === 'error' && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-danger" />
                <span className="text-danger">{t('play.sessionError')}</span>
              </>
            )}
            {saveState === 'idle' && <span className="text-slate-500">{t('play.sessionOffline')}</span>}
          </div>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-line/60 pt-5 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={onPlayAgain} icon={<Gamepad2 className="h-4 w-4" />}>
              {t('play.playAgain')}
            </Button>
            <LinkButton
              to={`/dashboard/${game.id}`}
              size="lg"
              variant="secondary"
              icon={<LayoutDashboard className="h-4 w-4" />}
            >
              {t('play.viewDashboard')}
            </LinkButton>
            <LinkButton to="/games" size="lg" variant="ghost">
              {t('play.backToGames')}
            </LinkButton>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <CopyButton
              value={link}
              label={t('play.finalCta')}
              variant="outline"
              iconOnly={false}
              className="w-full sm:w-auto"
            />
            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-600">
              <Share2 className="h-3 w-3" />
              {t('play.reviewNote')}
            </span>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
