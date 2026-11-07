import { motion } from 'framer-motion'
import { Check, LoaderCircle, TriangleAlert } from 'lucide-react'
import type { AgentName, AgentStatus } from '../../types'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { AGENT_ORDER, agentMeta } from './agentMeta'

interface AgentGraphProps {
  statuses: Record<AgentName, AgentStatus>
  selected: AgentName
  currentAgent: AgentName | null
  onSelect: (agent: AgentName) => void
}

function statusLabelKey(status: AgentStatus) {
  if (status === 'running') return 'pipeline.agentRunning' as const
  if (status === 'done') return 'pipeline.agentDone' as const
  if (status === 'error') return 'pipeline.agentError' as const
  return 'pipeline.agentPending' as const
}

export function AgentGraph({
  statuses,
  selected,
  currentAgent,
  onSelect,
}: AgentGraphProps) {
  const { t } = useI18n()

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-[7%] right-[7%] top-[46px] hidden h-px bg-gradient-to-r from-neon/30 via-plum/30 to-success/30 lg:block" />
      <div className="grid gap-3 lg:grid-cols-4">
        {AGENT_ORDER.map((agent, index) => {
          const meta = agentMeta[agent]
          const status = statuses[agent]
          const Icon = meta.icon
          const isSelected = selected === agent
          const isCurrent = currentAgent === agent && status === 'running'

          return (
            <motion.button
              key={agent}
              type="button"
              onClick={() => onSelect(agent)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className={cn(
                'group relative z-10 overflow-hidden rounded-2xl border p-4 text-left transition duration-300',
                isSelected
                  ? cn('border-white/20 bg-white/[0.07]', meta.glow)
                  : 'border-line/80 bg-deep/70 hover:border-white/15 hover:bg-white/[0.045]',
                status === 'pending' && 'opacity-70',
              )}
              aria-pressed={isSelected}
            >
              {isCurrent && (
                <motion.span
                  layoutId="agent-scan"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border',
                    meta.border,
                    meta.bg,
                    meta.soft,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                    status === 'done' && 'border-success/25 bg-success/10 text-success',
                    status === 'running' && cn(meta.border, meta.bg, meta.soft),
                    status === 'error' && 'border-danger/30 bg-danger/10 text-danger',
                    status === 'pending' && 'border-white/10 bg-white/[0.04] text-slate-500',
                  )}
                >
                  {status === 'running' && <LoaderCircle className="h-2.5 w-2.5 animate-spin" />}
                  {status === 'done' && <Check className="h-2.5 w-2.5" />}
                  {status === 'error' && <TriangleAlert className="h-2.5 w-2.5" />}
                  {t(statusLabelKey(status))}
                </span>
              </div>
              <p className="mt-3 font-pixel text-[8px] tracking-wider text-slate-600">
                STEP {meta.step}
              </p>
              <p className="mt-1.5 font-display text-sm font-semibold leading-snug text-white">
                {t(meta.nameKey)}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                {t(meta.shortKey)}
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    status === 'done' && 'bg-success',
                    status === 'running' && 'bg-gradient-to-r from-neon to-plum',
                    status === 'error' && 'bg-danger',
                    status === 'pending' && 'bg-transparent',
                  )}
                  initial={false}
                  animate={{
                    width:
                      status === 'done' ? '100%' : status === 'running' ? '62%' : '0%',
                  }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
