import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  Gamepad2,
  RefreshCw,
  Share2,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react'
import type { GameRecord, TeacherStats } from '../types'
import { useI18n, type Translate } from '../i18n'
import { api } from '../api'
import { formatDate, shareUrl } from '../lib/format'
import { toast } from '../store/toastStore'
import { Badge, type BadgeTone } from '../components/ui/Badge'
import { Button, LinkButton } from '../components/ui/Button'
import { CopyButton } from '../components/ui/CopyButton'
import { QRCard } from '../components/ui/QRCard'
import { Spinner } from '../components/ui/Spinner'
import { KpiCard } from '../components/dashboard/KpiCard'
import { Leaderboard } from '../components/dashboard/Leaderboard'
import { ObjectiveChart } from '../components/dashboard/ObjectiveChart'
import { RecentSessions } from '../components/dashboard/RecentSessions'
import { RegenerateModal } from '../components/dashboard/RegenerateModal'
import { WeakObjectiveCard } from '../components/dashboard/WeakObjectiveCard'

type Phase = 'loading' | 'ready' | 'error' | 'notFound'

function statusMeta(
  status: GameRecord['status'],
  t: Translate,
): { tone: BadgeTone; label: string } {
  if (status === 'published') return { tone: 'success', label: t('games.statusPublished') }
  if (status === 'ready') return { tone: 'neon', label: t('games.statusReady') }
  return { tone: 'gold', label: t('games.statusGenerating') }
}

export function DashboardPage() {
  const { t, lang } = useI18n()
  const { gameId = '' } = useParams()

  const [phase, setPhase] = useState<Phase>('loading')
  const [game, setGame] = useState<GameRecord | null>(null)
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [filter, setFilter] = useState<number | 'all'>('all')
  const [retryKey, setRetryKey] = useState(0)
  const [regenOpen, setRegenOpen] = useState(false)
  const [regenKey, setRegenKey] = useState(0)
  const [regenLoading, setRegenLoading] = useState(false)
  const [regenFeedback, setRegenFeedback] = useState('')

  useEffect(() => {
    let active = true

    const run = async () => {
      setPhase('loading')
      try {
        const [gameRecord, statsRecord] = await Promise.all([
          api.getGame(gameId),
          api.getTeacherStats(gameId),
        ])
        if (!active) return
        setGame(gameRecord)
        setStats(statsRecord)
        setFilter('all')
        setPhase('ready')
      } catch (error) {
        if (!active) return
        const message = error instanceof Error ? error.message : String(error)
        setPhase(message.includes('GAME_NOT_FOUND') ? 'notFound' : 'error')
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [gameId, retryKey])

  const totalQuestions = useMemo(
    () =>
      game
        ? game.blueprint.levels.reduce((sum, level) => sum + level.questions.length, 0)
        : 0,
    [game],
  )

  const weakObjectives = useMemo(() => {
    if (!stats) return []
    return [...stats.per_objective]
      .filter((objective) => objective.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
  }, [stats])

  const recentSessions = useMemo(() => {
    if (!stats) return []
    if (filter === 'all') return stats.recent_sessions
    return stats.recent_sessions.filter((session) => session.level_reached === filter)
  }, [stats, filter])

  const completionCount = useMemo(() => {
    if (!stats || totalQuestions === 0) return 0
    return stats.recent_sessions.filter(
      (session) => session.answers.length >= totalQuestions,
    ).length
  }, [stats, totalQuestions])

  const completionRate =
    stats && stats.recent_sessions.length > 0
      ? Math.round((completionCount / stats.recent_sessions.length) * 100)
      : 0

  const maxScore = game
    ? totalQuestions * game.blueprint.mechanics.points_per_correct
    : 0

  const openRegenerate = () => {
    const weakest = weakObjectives[0]
    setRegenFeedback(
      weakest ? t('dashboard.focusPrefill', { objective: weakest.text }) : '',
    )
    setRegenKey((value) => value + 1)
    setRegenOpen(true)
  }

  const handleRegenerate = async (feedback: string) => {
    if (!game) return
    setRegenLoading(true)
    try {
      const updated = await api.regenerateGame(game.id, {
        feedback: feedback || undefined,
      })
      setGame(updated)
      setRegenOpen(false)
      toast(t('dashboard.regeneratedDesc'))
    } catch {
      toast(t('errors.generic'), 'error')
    } finally {
      setRegenLoading(false)
    }
  }

  if (phase === 'loading') {
    return (
      <section className="container-page py-16 sm:py-20">
        <div className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center">
          <Spinner className="h-8 w-8" />
          <h1 className="font-display text-xl font-semibold text-white">
            {t('dashboard.title')}
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            {t('dashboard.loading')}
          </p>
        </div>
      </section>
    )
  }

  if (phase === 'notFound' || phase === 'error' || !game || !stats) {
    const isNotFound = phase === 'notFound'
    return (
      <section className="container-page py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mx-auto max-w-lg p-8 text-center"
        >
          <span
            className={
              isNotFound
                ? 'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-neon/20 bg-neon/10 text-neon-soft'
                : 'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/25 bg-danger/10 text-danger'
            }
          >
            {isNotFound ? (
              <Target className="h-6 w-6" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </span>
          <h1 className="mt-5 font-display text-xl font-semibold text-white">
            {isNotFound ? t('dashboard.notFound') : t('dashboard.errorTitle')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            {isNotFound ? t('dashboard.notFoundDesc') : t('dashboard.errorDesc')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {!isNotFound && (
              <Button
                onClick={() => {
                  setPhase('loading')
                  setRetryKey((value) => value + 1)
                }}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                {t('dashboard.retry')}
              </Button>
            )}
            <LinkButton
              to="/games"
              variant={isNotFound ? 'primary' : 'secondary'}
              icon={<Gamepad2 className="h-4 w-4" />}
            >
              {t('dashboard.backGames')}
            </LinkButton>
            <LinkButton to="/" variant="ghost">
              {t('dashboard.backHome')}
            </LinkButton>
          </div>
        </motion.div>
      </section>
    )
  }

  const link = shareUrl(`/play/${game.id}`)
  const status = statusMeta(game.status, t)
  const levels = game.blueprint.levels.length
  const isEmpty = stats.total_players === 0

  return (
    <section className="container-page py-8 sm:py-10">
      <Link
        to="/games"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-mist transition hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('dashboard.backGames')}
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-glow mt-4 p-5 sm:p-7"
      >
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <span className="eyebrow">
              <Sparkles className="h-3 w-3" />
              {t('dashboard.eyebrow')}
            </span>
            <h1 className="mt-3 text-balance font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              {game.blueprint.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
              {t('dashboard.subtitle')}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone={status.tone} dot pulse={game.status === 'generating'}>
                {status.label}
              </Badge>
              <Badge tone="outline">{t('common.version', { version: game.version })}</Badge>
              <Badge tone="neutral">{game.subject}</Badge>
              <Badge tone="neutral">{game.level}</Badge>
              <Badge tone="violet">
                {t('common.levelsCount', { count: levels })}
              </Badge>
              <Badge tone="neon">
                {t('common.questionsCount', { count: totalQuestions })}
              </Badge>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <LinkButton to={`/play/${game.id}`} icon={<Gamepad2 className="h-4 w-4" />}>
              {t('common.play')}
            </LinkButton>
            <Button
              variant="secondary"
              onClick={openRegenerate}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              {t('dashboard.regenerate')}
            </Button>
            <CopyButton
              value={link}
              label={t('dashboard.copyLink')}
              variant="outline"
            />
          </div>
        </div>
      </motion.header>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="card mt-5 flex flex-col items-center p-8 text-center sm:p-12"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon/20 bg-neon/10 text-neon-soft">
            <Users className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold text-white">
            {t('dashboard.emptyTitle')}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
            {t('dashboard.emptyDesc')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <CopyButton
              value={link}
              label={t('dashboard.shareNow')}
              variant="primary"
            />
            <LinkButton
              to={`/play/${game.id}`}
              variant="secondary"
              icon={<Gamepad2 className="h-4 w-4" />}
            >
              {t('common.play')}
            </LinkButton>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
          >
            <KpiCard
              icon={Users}
              label={t('dashboard.kpiPlayers')}
              value={String(stats.total_players)}
              sub={t('dashboard.kpiPlayersSub')}
              tone="neon"
            />
            <KpiCard
              icon={Trophy}
              label={t('dashboard.kpiAvg')}
              value={String(stats.avg_score)}
              sub={t('dashboard.kpiAvgSub', { max: maxScore })}
              tone="gold"
            />
            <KpiCard
              icon={Target}
              label={t('dashboard.kpiCompletion')}
              value={`${completionRate}%`}
              sub={t('dashboard.kpiCompletionSub', { count: completionCount })}
              tone="success"
            />
            <KpiCard
              icon={AlertTriangle}
              label={t('dashboard.kpiWeak')}
              value={t('dashboard.kpiWeakValue', {
                count: weakObjectives.length,
                total: stats.per_objective.length,
              })}
              sub={t('dashboard.kpiWeakSub')}
              tone="danger"
            />
          </motion.div>

          <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1.55fr_0.9fr]">
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-sm font-semibold text-white">
                    {t('dashboard.chartTitle')}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {t('dashboard.chartSubtitle')}
                  </p>
                </div>
                <Badge tone="outline">
                  {t('dashboard.playersLabel', { count: stats.total_players })}
                </Badge>
              </div>

              <div className="mt-4">
                {stats.per_objective.length > 0 ? (
                  <ObjectiveChart objectives={stats.per_objective} />
                ) : (
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-line px-4 py-8 text-center">
                    <Target className="h-6 w-6 text-slate-600" />
                    <p className="mt-2 text-xs font-semibold text-slate-300">
                      {t('dashboard.noObjective')}
                    </p>
                    <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-slate-500">
                      {t('dashboard.emptyDesc')}
                    </p>
                  </div>
                )}
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                <Sparkles className="h-3 w-3 text-gold/70" />
                {t('dashboard.mockNote')}
              </p>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-4"
            >
              <WeakObjectiveCard
                objective={weakObjectives[0]}
                onRegenerate={openRegenerate}
              />

              <section className="card p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon/25 bg-neon/10 text-neon-soft">
                    <Share2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-display text-sm font-semibold text-white">
                      {t('dashboard.shareTitle')}
                    </h2>
                    <p className="text-[10px] text-slate-500">
                      {t('dashboard.shareDesc')}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <QRCard value={link} size={124} />
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.08] bg-abyss/60 p-2.5">
                  <p className="break-all font-mono text-[10px] leading-relaxed text-neon-soft">
                    {link}
                  </p>
                </div>
                <CopyButton
                  value={link}
                  label={t('dashboard.copyLink')}
                  variant="outline"
                  className="mt-2.5 w-full"
                />
                <LinkButton
                  to={`/play/${game.id}`}
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  icon={<Gamepad2 className="h-3.5 w-3.5" />}
                >
                  {t('dashboard.viewGame')}
                </LinkButton>
              </section>
            </motion.div>
          </div>

          <div className="mt-5 grid items-start gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Leaderboard entries={stats.leaderboard} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <RecentSessions
                sessions={recentSessions}
                levels={levels}
                totalQuestions={totalQuestions}
                filter={filter}
                onFilter={setFilter}
              />
            </motion.div>
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-500">
            {t('dashboard.exportNote')} ·{' '}
            {t('games.created', { date: formatDate(game.created_at, lang) })}
          </p>
        </>
      )}

      <RegenerateModal
        key={regenKey}
        open={regenOpen}
        loading={regenLoading}
        initialFeedback={regenFeedback}
        onClose={() => setRegenOpen(false)}
        onConfirm={(feedback) => {
          void handleRegenerate(feedback)
        }}
      />
    </section>
  )
}
