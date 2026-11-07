import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  Clock3,
  FileQuestion,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import type {
  AgentEvent,
  AgentName,
  AgentStatus,
  GameRecord,
  PipelineStart,
} from '../types'
import { useI18n } from '../i18n'
import { api } from '../api'
import { cn } from '../lib/cn'
import { formatTimer } from '../lib/format'
import { toast } from '../store/toastStore'
import { Badge } from '../components/ui/Badge'
import { Button, LinkButton } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Spinner } from '../components/ui/Spinner'
import { AGENT_ORDER } from '../components/pipeline/agentMeta'
import { AgentGraph } from '../components/pipeline/AgentGraph'
import { AgentOutput } from '../components/pipeline/AgentOutput'
import { LiveLog } from '../components/pipeline/LiveLog'
import { PipelineCompletion } from '../components/pipeline/PipelineCompletion'

type Phase = 'loading' | 'running' | 'complete' | 'error' | 'notFound'

const TOTAL_EVENTS = 18

const initialStatuses: Record<AgentName, AgentStatus> = {
  analyzer: 'pending',
  planner: 'pending',
  generator: 'pending',
  builder: 'pending',
}

const completedStatuses: Record<AgentName, AgentStatus> = {
  analyzer: 'done',
  planner: 'done',
  generator: 'done',
  builder: 'done',
}

export function PipelinePage() {
  const { t } = useI18n()
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('loading')
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [statuses, setStatuses] = useState<Record<AgentName, AgentStatus>>(initialStatuses)
  const [selectedAgent, setSelectedAgent] = useState<AgentName>('analyzer')
  const [currentAgent, setCurrentAgent] = useState<AgentName | null>(null)
  const [game, setGame] = useState<GameRecord | null>(null)
  const [feedback, setFeedback] = useState('')
  const [approved, setApproved] = useState(false)
  const [approving, setApproving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [retryKey, setRetryKey] = useState(0)

  const startRef = useRef(0)
  const confettiFired = useRef(false)
  const demoPromiseRef = useRef<Promise<PipelineStart> | null>(null)

  /* `/pipeline/demo` spins up a fresh sample pipeline, then swaps the URL to a real id. */
  useEffect(() => {
    if (id !== 'demo') return
    let active = true
    if (!demoPromiseRef.current) {
      demoPromiseRef.current = api.startPipeline({
        sample: true,
        category: 'school',
        subject: 'sejarah',
        language: 'bm',
        difficulty: 'medium',
        levels: 3,
      })
    }
    demoPromiseRef.current
      .then((start) => {
        if (active) navigate(`/pipeline/${start.pipeline_id}`, { replace: true })
      })
      .catch(() => {
        if (active) setPhase('error')
      })
    return () => {
      active = false
    }
  }, [id, navigate])

  useEffect(() => {
    if (id === 'demo') return
    let active = true
    const controller = new AbortController()

    setPhase('loading')
    setEvents([])
    setStatuses(initialStatuses)
    setSelectedAgent('analyzer')
    setCurrentAgent(null)
    setGame(null)
    setFeedback('')
    setApproved(false)
    setApproving(false)
    setRegenerating(false)
    setShowJson(false)
    setElapsed(0)
    confettiFired.current = false

    const run = async () => {
      try {
        const info = await api.getPipeline(id)
        if (!active) return
        const loaded = await api.getGame(info.game_id)
        if (!active) return

        setGame(loaded)
        setApproved(loaded.status === 'published')
        setFeedback(info.feedback ?? '')
        startRef.current = Date.now()
        setPhase('running')

        for await (const event of api.streamPipeline(id, { signal: controller.signal })) {
          if (!active) return
          setEvents((previous) => [...previous, event])
          setStatuses((previous) => ({ ...previous, [event.agent]: event.status }))
          if (event.status === 'running') setCurrentAgent(event.agent)
          if (event.status === 'done') setSelectedAgent(event.agent)
        }

        if (!active) return
        setStatuses(completedStatuses)
        setCurrentAgent(null)
        const fresh = await api.getGame(info.game_id)
        if (!active) return
        setGame(fresh)
        setApproved(fresh.status === 'published')
        setPhase('complete')
      } catch (error) {
        if (!active || controller.signal.aborted) return
        const message = error instanceof Error ? error.message : String(error)
        setPhase(message.includes('PIPELINE_NOT_FOUND') ? 'notFound' : 'error')
      }
    }

    void run()
    return () => {
      active = false
      controller.abort()
    }
  }, [id, retryKey])

  useEffect(() => {
    if (phase !== 'running') return
    const tick = () =>
      setElapsed(Math.max(0, Math.floor((Date.now() - startRef.current) / 1000)))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'complete' || confettiFired.current) return
    confettiFired.current = true
    const colors = ['#22d3ee', '#a78bfa', '#f5c451', '#34d399']
    confetti({
      particleCount: 90,
      spread: 78,
      origin: { y: 0.62 },
      colors,
      disableForReducedMotion: true,
    })
    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        disableForReducedMotion: true,
      })
    }, 260)
    return () => window.clearTimeout(timer)
  }, [phase])

  const doneCount = AGENT_ORDER.filter((agent) => statuses[agent] === 'done').length
  const stepCurrent = Math.min(4, Math.max(1, doneCount + (phase === 'running' ? 1 : 0)))
  const progress =
    phase === 'complete'
      ? 100
      : Math.min(100, Math.round((events.length / TOTAL_EVENTS) * 100))
  const selectedEvent = events.find(
    (event) => event.agent === selectedAgent && event.status === 'done',
  )

  const handleApprove = async () => {
    if (!game || approving) return
    setApproving(true)
    try {
      const updated = await api.approveGame(game.id)
      setGame(updated)
      setApproved(true)
      toast(t('pipeline.approvedDesc'))
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#34d399', '#22d3ee', '#f5c451'],
        disableForReducedMotion: true,
      })
    } catch {
      toast(t('errors.generic'), 'error')
    } finally {
      setApproving(false)
    }
  }

  const handleRegenerate = async () => {
    if (!game || regenerating) return
    setRegenerating(true)
    try {
      const updated = await api.regenerateGame(game.id, {
        feedback: feedback.trim() || undefined,
      })
      setGame(updated)
      setApproved(updated.status === 'published')
      toast(t('pipeline.regeneratedDesc'))
    } catch {
      toast(t('errors.generic'), 'error')
    } finally {
      setRegenerating(false)
    }
  }

  if (phase === 'loading') {
    return (
      <section className="container-page py-16 sm:py-20">
        <div className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center">
          <Spinner className="h-8 w-8" />
          <h1 className="font-display text-xl font-semibold text-white">
            {t('pipeline.title')}
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            {t('pipeline.subtitle')}
          </p>
          <span className="mt-1 rounded-full border border-line bg-deep/80 px-3 py-1 font-mono text-[10px] text-slate-500">
            {t('pipeline.id')}: {id || '—'}
          </span>
        </div>
      </section>
    )
  }

  if (phase === 'notFound' || phase === 'error') {
    const isNotFound = phase === 'notFound'
    return (
      <section className="container-page py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mx-auto max-w-lg p-8 text-center"
        >
          <span
            className={cn(
              'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border',
              isNotFound
                ? 'border-neon/20 bg-neon/10 text-neon-soft'
                : 'border-danger/25 bg-danger/10 text-danger',
            )}
          >
            {isNotFound ? (
              <FileQuestion className="h-6 w-6" />
            ) : (
              <TriangleAlert className="h-6 w-6" />
            )}
          </span>
          <h1 className="mt-5 font-display text-xl font-semibold text-white">
            {isNotFound ? t('pipeline.notFoundTitle') : t('pipeline.errorTitle')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            {isNotFound ? t('pipeline.notFoundDesc') : t('pipeline.errorDesc')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {!isNotFound && (
              <Button
                onClick={() => setRetryKey((value) => value + 1)}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                {t('pipeline.retry')}
              </Button>
            )}
            <LinkButton
              to="/create"
              variant={isNotFound ? 'primary' : 'secondary'}
              icon={<Sparkles className="h-4 w-4" />}
            >
              {t('pipeline.backCreate')}
            </LinkButton>
            <LinkButton to="/games" variant="ghost">
              {t('nav.games')}
            </LinkButton>
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="container-page py-8 sm:py-10">
      <Link
        to="/games"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-mist transition hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('dashboard.backGames')}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-glow mt-4 p-5 sm:p-7"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="min-w-0">
            <span className="eyebrow">
              <Sparkles className="h-3 w-3" />
              {t('pipeline.eyebrow')}
            </span>
            <h1 className="mt-3 text-balance font-display text-2xl font-bold text-white sm:text-3xl">
              {t('pipeline.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
              {t('pipeline.subtitle')}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge
                tone={phase === 'complete' ? 'success' : 'neon'}
                dot
                pulse={phase === 'running'}
              >
                {phase === 'complete' ? t('pipeline.complete') : t('pipeline.running')}
              </Badge>
              <span className="rounded-full border border-line bg-deep/70 px-2.5 py-1 font-mono text-[10px] text-slate-500">
                {t('pipeline.id')}: {id}
              </span>
              {game && (
                <>
                  <Badge tone="outline">
                    {t('pipeline.version', { version: game.version })}
                  </Badge>
                  <Badge tone="neutral">{game.subject}</Badge>
                </>
              )}
            </div>
          </div>

          <div className="w-full shrink-0 lg:max-w-xs">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <span>{t('pipeline.progress')}</span>
              <span className="font-mono text-neon-soft">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="mt-1.5"
              label={t('a11y.progress')}
            />
            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3 w-3" />
                {phase === 'complete'
                  ? t('pipeline.doneIn', { time: formatTimer(elapsed) })
                  : formatTimer(elapsed)}
              </span>
              <span>
                {t('pipeline.stepOf', { current: stepCurrent, total: 4 })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {phase === 'complete' && game && (
        <div className="mt-5">
          <PipelineCompletion
            game={game}
            approved={approved}
            approving={approving}
            regenerating={regenerating}
            feedback={feedback}
            onFeedbackChange={setFeedback}
            onApprove={() => {
              void handleApprove()
            }}
            onRegenerate={() => {
              void handleRegenerate()
            }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="card mt-5 p-4 sm:p-5"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold text-white">
              {t('pipeline.graphTitle')}
            </h2>
            <p className="text-[11px] text-slate-500">{t('pipeline.graphSubtitle')}</p>
          </div>
          <Badge tone={doneCount === 4 ? 'success' : 'outline'}>
            {t('pipeline.stepOf', { current: doneCount, total: 4 })}
          </Badge>
        </div>
        <AgentGraph
          statuses={statuses}
          selected={selectedAgent}
          currentAgent={currentAgent}
          onSelect={setSelectedAgent}
        />
      </motion.div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <LiveLog
          events={events}
          running={phase === 'running'}
          className="h-[380px] sm:h-[440px]"
        />
        <AgentOutput
          agent={selectedAgent}
          status={statuses[selectedAgent]}
          event={selectedEvent}
          game={game}
          showJson={showJson}
          onToggleJson={() => setShowJson((value) => !value)}
          className="h-[380px] sm:h-[440px]"
        />
      </div>
    </section>
  )
}
