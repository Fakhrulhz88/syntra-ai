import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownToLine, Check, LoaderCircle, Terminal, TriangleAlert } from 'lucide-react'
import type { AgentEvent } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { formatClockTime } from '../../lib/format'
import { agentMeta } from './agentMeta'

interface LiveLogProps {
  events: AgentEvent[]
  running: boolean
  className?: string
}

export function LiveLog({ events, running, className }: LiveLogProps) {
  const { t } = useI18n()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [follow, setFollow] = useState(true)

  useEffect(() => {
    const body = bodyRef.current
    if (!body || !follow) return
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
  }, [events.length, follow])

  return (
    <section
      className={cn('card flex min-h-0 flex-col overflow-hidden', className)}
      aria-label={t('a11y.log')}
    >
      <header className="flex items-center justify-between gap-3 border-b border-line/70 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-neon/20 bg-neon/10 text-neon-soft">
            <Terminal className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-display text-xs font-semibold text-white">
              {t('pipeline.logTitle')}
            </h2>
            <p className="text-[10px] text-slate-500">
              {t('pipeline.logEvents', { count: events.length })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFollow((value) => !value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition',
            follow
              ? 'border-neon/30 bg-neon/10 text-neon-soft'
              : 'border-white/10 bg-white/[0.04] text-slate-500 hover:text-slate-300',
          )}
          aria-pressed={follow}
        >
          <ArrowDownToLine className="h-3 w-3" />
          {t('pipeline.autoscroll')}
        </button>
      </header>

      <div
        ref={bodyRef}
        onScroll={(event) => {
          const target = event.currentTarget
          const nearBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 48
          setFollow(nearBottom)
        }}
        className="no-scrollbar min-h-[240px] flex-1 overflow-y-auto bg-[#050915]/80 px-4 py-3 font-mono text-[11px] leading-relaxed"
      >
        {events.length === 0 ? (
          <div className="flex h-full min-h-[210px] flex-col items-center justify-center gap-3 text-center text-slate-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
              <Terminal className="h-4 w-4" />
            </span>
            <p>{t('pipeline.logEmpty')}</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon/60" />
              {t('pipeline.scanning')}
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event, index) => {
              const meta = agentMeta[event.agent]
              const time = new Date(event.timestamp)
              return (
                <motion.div
                  key={`${event.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-2.5"
                >
                  <span className="shrink-0 pt-px text-slate-700">
                    {Number.isNaN(time.getTime()) ? '--:--:--' : formatClockTime(time)}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 font-bold uppercase tracking-wide',
                      meta.soft,
                    )}
                  >
                    [{t(meta.shortKey)}]
                  </span>
                  <span
                    className={cn(
                      'min-w-0 flex-1 text-slate-400',
                      event.status === 'done' && 'text-slate-200',
                    )}
                  >
                    {event.message}
                  </span>
                  <span className="shrink-0 pt-px">
                    {event.status === 'done' ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : event.status === 'error' ? (
                      <TriangleAlert className="h-3 w-3 text-danger" />
                    ) : (
                      <LoaderCircle className="h-3 w-3 animate-spin text-slate-600" />
                    )}
                  </span>
                </motion.div>
              )
            })}
            {running && (
              <div className="flex items-center gap-2 pt-1 text-slate-600">
                <span className="h-1.5 w-3 bg-neon/70 animate-blink" />
                <span className="text-[10px]">{t('pipeline.running')}…</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
