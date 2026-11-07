import { motion } from 'framer-motion'
import { Boxes, PenTool, ScanSearch, Workflow } from 'lucide-react'
import { useI18n } from '../../i18n'
import { SectionHeading } from '../ui/SectionHeading'
import { Badge } from '../ui/Badge'

const agents = [
  {
    name: 'agent.analyzer.name',
    role: 'agent.analyzer.role',
    step: 'agent.step1',
    icon: ScanSearch,
    color: 'text-neon bg-neon/10 border-neon/20',
    glow: 'group-hover:shadow-[0_0_45px_-15px_rgba(34,211,238,0.7)]',
  },
  {
    name: 'agent.planner.name',
    role: 'agent.planner.role',
    step: 'agent.step2',
    icon: Workflow,
    color: 'text-plum-soft bg-plum/10 border-plum/20',
    glow: 'group-hover:shadow-[0_0_45px_-15px_rgba(167,139,250,0.7)]',
  },
  {
    name: 'agent.generator.name',
    role: 'agent.generator.role',
    step: 'agent.step3',
    icon: PenTool,
    color: 'text-gold bg-gold/10 border-gold/20',
    glow: 'group-hover:shadow-[0_0_45px_-15px_rgba(245,196,81,0.7)]',
  },
  {
    name: 'agent.builder.name',
    role: 'agent.builder.role',
    step: 'agent.step4',
    icon: Boxes,
    color: 'text-success bg-success/10 border-success/20',
    glow: 'group-hover:shadow-[0_0_45px_-15px_rgba(52,211,153,0.7)]',
  },
] as const

export function AgentsSection() {
  const { t } = useI18n()
  return (
    <section id="agents" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow={t('landing.agentsEyebrow')}
          title={t('landing.agentsTitle')}
          description={t('landing.agentsSubtitle')}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent, index) => {
            const Icon = agent.icon
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`group card relative p-5 transition duration-300 hover:-translate-y-1 ${agent.glow}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${agent.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge tone="success" dot pulse className="text-[9px]">
                    {t('landing.agentStatus')}
                  </Badge>
                </div>
                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  {t(agent.step)}
                </p>
                <h3 className="mt-1.5 font-display text-base font-semibold text-white">
                  {t(agent.name)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">{t(agent.role)}</p>
                <div className="mt-4 flex items-center gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1 flex-1 rounded-full bg-gradient-to-r from-white/15 to-white/5 transition group-hover:from-neon/50 group-hover:to-plum/30"
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neon/10 font-pixel text-[9px] text-neon">
            AI
          </span>
          <p className="text-xs leading-relaxed text-slate-400">
            {t('landing.trusted')}
          </p>
        </div>
      </div>
    </section>
  )
}
