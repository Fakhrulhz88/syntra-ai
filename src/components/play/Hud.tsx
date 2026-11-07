import type { ReactNode } from 'react'
import { ArrowLeft, Flame, Heart, Mic, MicOff, Trophy, Volume2, VolumeX } from 'lucide-react'
import type { GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'

interface HudProps {
  game: GameRecord
  nickname: string
  hp: number
  score: number
  streak: number
  levelIndex: number
  progress?: number
  soundOn: boolean
  voiceOn: boolean
  voiceSupported: boolean
  onToggleSound: () => void
  onToggleVoice: () => void
  onExit: () => void
}

function ToggleButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'border-neon/30 bg-neon/10 text-neon-soft'
          : 'border-white/10 bg-white/[0.04] text-slate-500 hover:text-slate-200',
      )}
    >
      {children}
    </button>
  )
}

export function Hud({
  game,
  nickname,
  hp,
  score,
  streak,
  levelIndex,
  progress,
  soundOn,
  voiceOn,
  voiceSupported,
  onToggleSound,
  onToggleVoice,
  onExit,
}: HudProps) {
  const { t } = useI18n()
  const maxHp = game.blueprint.mechanics.hp
  const levelLabel =
    levelIndex >= 0
      ? `${t('common.level')} ${levelIndex + 1}/${game.blueprint.levels.length}`
      : t('play.mapTitle')

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-abyss/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 text-xs font-semibold text-mist transition hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t('play.exit')}</span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xs font-semibold leading-tight text-white sm:text-sm">
            {game.blueprint.title}
          </p>
          <p className="truncate text-[10px] leading-tight text-slate-500">
            {nickname} · {levelLabel}
          </p>
        </div>

        <div
          className="flex shrink-0 items-center gap-0.5"
          aria-label={t('a11y.hp')}
          role="img"
        >
          {Array.from({ length: maxHp }).map((_, index) => (
            <Heart
              key={index}
              className={cn(
                'h-4 w-4 transition sm:h-[18px] sm:w-[18px]',
                index < hp
                  ? 'fill-danger text-danger drop-shadow-[0_0_6px_rgba(251,113,133,0.55)]'
                  : 'text-slate-700',
              )}
            />
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/[0.07] px-2.5 py-1">
            <Trophy className="h-3.5 w-3.5 text-gold" />
            <span className="font-mono text-xs font-bold tabular-nums text-gold">
              {score}
            </span>
          </span>
          {streak > 1 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-danger/25 bg-danger/[0.08] px-2 py-1">
              <Flame className="h-3.5 w-3.5 text-danger" />
              <span className="font-mono text-xs font-bold tabular-nums text-danger">
                {streak}
              </span>
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <ToggleButton
            active={soundOn}
            label={soundOn ? t('play.soundOn') : t('play.soundOff')}
            onClick={onToggleSound}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </ToggleButton>
          <ToggleButton
            active={voiceOn && voiceSupported}
            disabled={!voiceSupported}
            label={
              !voiceSupported
                ? t('play.voiceUnsupported')
                : voiceOn
                  ? t('play.voiceOn')
                  : t('play.voiceOff')
            }
            onClick={onToggleVoice}
          >
            {voiceOn && voiceSupported ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </ToggleButton>
        </div>
      </div>

      {progress !== undefined && (
        <div className="h-0.5 w-full bg-white/[0.05]">
          <div
            className="h-full bg-gradient-to-r from-neon via-[#38bdf8] to-plum transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </header>
  )
}
