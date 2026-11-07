import { BookOpen, Lightbulb, ShieldCheck, Sparkles } from 'lucide-react'
import { useI18n } from '../../i18n'
import { Badge } from '../ui/Badge'

export function CreateSidebar() {
  const { t } = useI18n()
  const steps = [
    { icon: '01', text: 'create.sidebar1' },
    { icon: '02', text: 'create.sidebar2' },
    { icon: '03', text: 'create.sidebar3' },
  ] as const

  return (
    <aside className="space-y-4">
      <div className="card p-5">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
          <Sparkles className="h-4 w-4 text-neon" />
          {t('create.sidebarTitle')}
        </h2>
        <ol className="mt-4 space-y-4">
          {steps.map((step, index) => (
            <li key={step.icon} className="relative flex gap-3">
              {index < steps.length - 1 && (
                <span className="absolute left-[13px] top-7 h-[calc(100%-4px)] w-px bg-gradient-to-b from-neon/30 to-transparent" />
              )}
              <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neon/20 bg-[#08132a] font-pixel text-[8px] text-neon-soft">
                {step.icon}
              </span>
              <p className="pt-1 text-xs leading-relaxed text-mist">{t(step.text)}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.09] to-transparent p-5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-gold">
          <Lightbulb className="h-4 w-4" />
          {t('create.tipTitle')}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-gold/80">{t('create.tipText')}</p>
      </div>

      <div className="card p-5">
        <h2 className="font-display text-sm font-semibold text-white">
          {t('create.supportedTitle')}
        </h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
          {t('create.supportedDesc')}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 text-neon-soft">
              <BookOpen className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-slate-200">
              {t('create.subjectSejarah')}
            </span>
            <span className="flex gap-1">
              <Badge tone="neon" className="px-1.5 py-0.5 text-[8px]">
                {t('common.bmShort')}
              </Badge>
              <Badge tone="violet" className="px-1.5 py-0.5 text-[8px]">
                {t('common.enShort')}
              </Badge>
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-plum/10 text-plum-soft">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-slate-200">
              {t('create.subjectCyber')}
            </span>
            <span className="flex gap-1">
              <Badge tone="neon" className="px-1.5 py-0.5 text-[8px]">
                {t('common.bmShort')}
              </Badge>
              <Badge tone="violet" className="px-1.5 py-0.5 text-[8px]">
                {t('common.enShort')}
              </Badge>
            </span>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="h-1 w-1 rounded-full bg-gold" />
          {t('create.autoLangNote')}
        </p>
      </div>
    </aside>
  )
}
