import { motion } from 'framer-motion'
import { Bot, Gamepad2, UploadCloud } from 'lucide-react'
import { useI18n } from '../../i18n'
import { SectionHeading } from '../ui/SectionHeading'

const steps = [
  {
    tag: 'landing.step1Tag',
    title: 'landing.step1Title',
    description: 'landing.step1Desc',
    icon: UploadCloud,
    accent: 'from-neon/20 to-neon/[0.02] text-neon',
  },
  {
    tag: 'landing.step2Tag',
    title: 'landing.step2Title',
    description: 'landing.step2Desc',
    icon: Bot,
    accent: 'from-plum/20 to-plum/[0.02] text-plum-soft',
  },
  {
    tag: 'landing.step3Tag',
    title: 'landing.step3Title',
    description: 'landing.step3Desc',
    icon: Gamepad2,
    accent: 'from-gold/20 to-gold/[0.02] text-gold',
  },
] as const

export function StepsSection() {
  const { t } = useI18n()
  return (
    <section id="how" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('landing.stepsEyebrow')}
          title={t('landing.stepsTitle')}
          description={t('landing.stepsSubtitle')}
        />

        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-neon/30 via-plum/40 to-gold/30 md:block" />
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.article
                key={step.tag}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card card-glow group relative p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${step.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-pixel text-[10px] leading-relaxed text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {t(step.tag)}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">
                  {t(step.title)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">
                  {t(step.description)}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
