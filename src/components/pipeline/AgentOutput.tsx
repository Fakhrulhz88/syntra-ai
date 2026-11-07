import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  FileText,
  Gauge,
  Layers3,
  LayoutGrid,
  LoaderCircle,
  Sparkles,
  Target,
} from 'lucide-react'
import type { AgentEvent, AgentName, AgentStatus, GameRecord } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { shareUrl } from '../../lib/format'
import { Badge } from '../ui/Badge'
import { CopyButton } from '../ui/CopyButton'
import { agentMeta } from './agentMeta'

interface AgentOutputProps {
  agent: AgentName
  status: AgentStatus
  event?: AgentEvent
  game: GameRecord | null
  showJson: boolean
  onToggleJson: () => void
  className?: string
}

function EmptyOutput({
  status,
  message,
}: {
  status: AgentStatus
  message: string
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line/80 bg-white/[0.015] px-6 text-center">
      {status === 'running' ? (
        <LoaderCircle className="h-6 w-6 animate-spin text-neon" />
      ) : status === 'error' ? (
        <FileText className="h-6 w-6 text-danger" />
      ) : (
        <Sparkles className="h-6 w-6 text-slate-600" />
      )}
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">{message}</p>
    </div>
  )
}

export function AgentOutput({
  agent,
  status,
  event,
  game,
  showJson,
  onToggleJson,
  className,
}: AgentOutputProps) {
  const { t } = useI18n()
  const meta = agentMeta[agent]
  const Icon = meta.icon
  const preview = event?.output_preview

  const pendingMessage =
    status === 'running'
      ? t('pipeline.agentOutputRunning')
      : status === 'error'
        ? t('pipeline.agentOutputError')
        : t('pipeline.agentOutputPending')

  return (
    <section className={cn('card flex min-h-0 flex-col overflow-hidden', className)} aria-live="polite">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border',
              meta.border,
              meta.bg,
              meta.soft,
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-xs font-semibold text-white">
              {t(meta.nameKey)}
            </h2>
            <p className="truncate text-[10px] text-slate-500">{t('pipeline.outputHint')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleJson}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
        >
          {showJson ? <LayoutGrid className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
          {showJson ? t('pipeline.showCards') : t('pipeline.showJson')}
        </button>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        {!preview ? (
          <EmptyOutput status={status} message={pendingMessage} />
        ) : showJson ? (
          <motion.pre
            key="json"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-scrollbar max-h-[360px] overflow-auto rounded-2xl border border-line/70 bg-[#050915] p-4 font-mono text-[10px] leading-relaxed text-neon-soft/80"
          >
            {preview}
          </motion.pre>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {agent === 'analyzer' && game && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      {t('create.subject')}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white">
                      {game.analysis.subject}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      {t('common.level')}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white">
                      {game.analysis.level}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Target className="h-3 w-3 text-neon" />
                    {t('pipeline.analysisObjectives')}
                  </p>
                  <ul className="space-y-1.5">
                    {game.analysis.objectives.map((objective) => (
                      <li
                        key={objective.id}
                        className="flex gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2 text-[11px] leading-relaxed text-slate-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                        {objective.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('pipeline.analysisConcepts')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {game.analysis.concepts.map((concept) => (
                      <Badge key={concept} tone="violet" className="text-[9px]">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('pipeline.analysisKeywords')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {game.analysis.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-md border border-neon/15 bg-neon/[0.06] px-2 py-0.5 font-mono text-[9px] text-neon-soft"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {agent === 'planner' && game && (
              <>
                <div className="rounded-xl border border-plum/20 bg-plum/[0.06] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-plum-soft/70">
                    {t('landing.heroCardLabel')}
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold text-white">
                    {game.blueprint.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-mist">{game.blueprint.theme}</p>
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Gauge className="h-3 w-3 text-plum" />
                    {t('pipeline.blueprintMechanics')}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                      <p className="font-display text-sm font-bold text-white">
                        {game.blueprint.mechanics.hp}
                      </p>
                      <p className="text-[9px] text-slate-500">{t('common.hp')}</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                      <p className="font-display text-sm font-bold text-white">
                        {game.blueprint.mechanics.points_per_correct}
                      </p>
                      <p className="text-[9px] text-slate-500">{t('common.score')}</p>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                      <p className="font-display text-sm font-bold text-white">
                        {game.blueprint.mechanics.badges.length}
                      </p>
                      <p className="text-[9px] text-slate-500">{t('play.badgesEarned')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Layers3 className="h-3 w-3 text-plum" />
                    {t('pipeline.blueprintLevels')}
                  </p>
                  <div className="space-y-1.5">
                    {game.blueprint.levels.map((level, index) => (
                      <div
                        key={level.id}
                        className="flex items-center gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2.5 py-2"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-plum/10 font-pixel text-[8px] text-plum-soft">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-semibold text-slate-200">
                            {level.name}
                          </p>
                          <p className="truncate text-[9px] text-slate-500">
                            {level.scene} · {level.difficulty}
                          </p>
                        </div>
                        <Badge tone="neutral" className="shrink-0 text-[8px]">
                          {t('pipeline.blueprintQuestions', {
                            count: level.questions.length,
                          })}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {agent === 'generator' && game && (
              <div className="space-y-2">
                {game.blueprint.levels.map((level, levelIndex) => (
                  <details
                    key={level.id}
                    open={levelIndex === 0}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02]"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3 py-2.5 text-[11px] font-semibold text-slate-200 [&::-webkit-details-marker]:hidden">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gold/10 font-pixel text-[8px] text-gold">
                        {levelIndex + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{level.name}</span>
                      <Badge tone="gold" className="shrink-0 text-[8px]">
                        {t('pipeline.blueprintQuestions', {
                          count: level.questions.length,
                        })}
                      </Badge>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-600 transition group-open:rotate-90" />
                    </summary>
                    <ul className="space-y-2 border-t border-white/[0.05] px-3 py-2.5">
                      {level.questions.map((question, index) => (
                        <li key={question.id} className="text-[10px] leading-relaxed">
                          <div className="flex items-start gap-2">
                            <span className="mt-px font-mono text-slate-600">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-slate-300">{question.text}</p>
                              <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[9px] text-slate-600">
                                <Badge
                                  tone={question.type === 'mcq' ? 'neon' : 'violet'}
                                  className="px-1.5 py-0 text-[8px]"
                                >
                                  {question.type === 'mcq'
                                    ? t('play.questionMcq')
                                    : t('play.questionPuzzle')}
                                </Badge>
                                <span className="font-mono text-success/70">
                                  {question.answer.split('|')[0]}
                                </span>
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            )}

            {agent === 'builder' && game && (
              <>
                <div className="rounded-xl border border-success/20 bg-success/[0.05] p-3">
                  <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-success/80">
                    <CheckCircle2 className="h-3 w-3" />
                    {t('pipeline.builderReady')}
                  </p>
                  <p className="mt-1.5 break-all font-mono text-[10px] text-success">
                    {shareUrl(`/play/${game.id}`)}
                  </p>
                  <div className="mt-2.5">
                    <CopyButton
                      value={shareUrl(`/play/${game.id}`)}
                      label={t('pipeline.copyLink')}
                      size="sm"
                      variant="outline"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      {t('common.levels')}
                    </p>
                    <p className="mt-0.5 font-display text-sm font-bold text-white">
                      {game.blueprint.levels.length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      {t('common.questions')}
                    </p>
                    <p className="mt-0.5 font-display text-sm font-bold text-white">
                      {game.blueprint.levels.reduce(
                        (sum, level) => sum + level.questions.length,
                        0,
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('pipeline.builderAssets')}
                  </p>
                  <p className="text-[11px] leading-relaxed text-mist">
                    {t('pipeline.builderAssetsValue')}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
