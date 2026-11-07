import { motion } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  Gamepad2,
  LayoutDashboard,
  RefreshCw,
  Share2,
  Sparkles,
  ThumbsUp,
} from 'lucide-react'
import type { GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { shareUrl } from '../../lib/format'
import { Badge } from '../ui/Badge'
import { Button, LinkButton } from '../ui/Button'
import { CopyButton } from '../ui/CopyButton'
import { QRCard } from '../ui/QRCard'

interface PipelineCompletionProps {
  game: GameRecord
  approved: boolean
  approving: boolean
  regenerating: boolean
  feedback: string
  onFeedbackChange: (value: string) => void
  onApprove: () => void
  onRegenerate: () => void
}

export function PipelineCompletion({
  game,
  approved,
  approving,
  regenerating,
  feedback,
  onFeedbackChange,
  onApprove,
  onRegenerate,
}: PipelineCompletionProps) {
  const { t } = useI18n()
  const link = shareUrl(`/play/${game.id}`)
  const questions = game.blueprint.levels.reduce(
    (sum, level) => sum + level.questions.length,
    0,
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="card-glow p-5 sm:p-7"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-start">
        <div>
          <span className="eyebrow border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="h-3 w-3" />
            {t('pipeline.completionEyebrow')}
          </span>
          <h2 className="mt-3 text-balance font-display text-2xl font-bold text-white sm:text-3xl">
            {t('pipeline.completionTitle')}
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-mist">
            {t('pipeline.completionDesc')}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {approved && (
            <Badge tone="success" dot pulse>
              {t('pipeline.approvedBadge')}
            </Badge>
          )}
          <Badge tone="outline">{t('pipeline.version', { version: game.version })}</Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {game.subject} · {game.level}
            </p>
            <h3 className="mt-1.5 font-display text-xl font-bold text-white">
              {game.blueprint.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-mist">{game.blueprint.theme}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="neon">
                {t('common.levelsCount', { count: game.blueprint.levels.length })}
              </Badge>
              <Badge tone="violet">
                {t('common.questionsCount', { count: questions })}
              </Badge>
              <Badge tone="gold">
                {t('common.playersCount', { count: game.players })}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <LinkButton
                to={`/play/${game.id}`}
                icon={<Gamepad2 className="h-4 w-4" />}
              >
                {t('pipeline.openGame')}
              </LinkButton>
              <LinkButton
                to={`/dashboard/${game.id}`}
                variant="secondary"
                icon={<LayoutDashboard className="h-4 w-4" />}
              >
                {t('pipeline.openDashboard')}
              </LinkButton>
            </div>
          </div>

          <div className="rounded-2xl border border-plum/20 bg-plum/[0.045] p-4">
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-plum/25 bg-plum/10 text-plum-soft">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold text-white">
                  {t('pipeline.hitlTitle')}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-mist">
                  {t('pipeline.hitlDesc')}
                </p>
              </div>
            </div>

            <label
              htmlFor="pipeline-feedback"
              className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-slate-400"
            >
              {t('pipeline.feedbackLabel')}
            </label>
            <textarea
              id="pipeline-feedback"
              value={feedback}
              onChange={(event) => onFeedbackChange(event.target.value)}
              rows={3}
              placeholder={t('pipeline.feedbackPlaceholder')}
              className="input-base mt-1.5 resize-none text-xs"
            />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {approved ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-success/25 bg-success/10 px-4 py-2.5 text-xs font-semibold text-success">
                  <Check className="h-4 w-4" />
                  {t('pipeline.approved')}
                </span>
              ) : (
                <Button
                  onClick={onApprove}
                  loading={approving}
                  disabled={regenerating}
                  icon={<ThumbsUp className="h-4 w-4" />}
                >
                  {approving ? t('pipeline.approving') : t('pipeline.approve')}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={onRegenerate}
                loading={regenerating}
                disabled={approving || regenerating}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                {regenerating ? t('pipeline.regenerating') : t('pipeline.regenerate')}
              </Button>
              <span className="text-[10px] text-slate-500">
                {t('pipeline.reviewNote', { version: game.version })}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neon/20 bg-gradient-to-br from-neon/[0.07] via-transparent to-plum/[0.06] p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon/25 bg-neon/10 text-neon-soft">
              <Share2 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-white">
                {t('pipeline.shareTitle')}
              </h3>
              <p className="text-[10px] text-slate-500">{t('pipeline.shareHint')}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <QRCard value={link} size={132} />
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.08] bg-abyss/60 p-2.5">
            <p className="break-all font-mono text-[10px] leading-relaxed text-neon-soft">
              {link}
            </p>
          </div>
          <CopyButton
            value={link}
            label={t('pipeline.copyLink')}
            variant="outline"
            className="mt-2.5 w-full"
          />
        </div>
      </div>
    </motion.section>
  )
}
