import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Languages,
  Map,
  Puzzle,
  QrCode,
  ShieldCheck,
} from 'lucide-react'
import { useI18n } from '../../i18n'
import { SectionHeading } from '../ui/SectionHeading'

interface Feature {
  title: 'landing.f1Title' | 'landing.f2Title' | 'landing.f3Title' | 'landing.f4Title' | 'landing.f5Title' | 'landing.f6Title'
  description:
    | 'landing.f1Desc'
    | 'landing.f2Desc'
    | 'landing.f3Desc'
    | 'landing.f4Desc'
    | 'landing.f5Desc'
    | 'landing.f6Desc'
  icon: typeof Map
  visual: ReactNode
}

function MapVisual() {
  return (
    <div className="relative h-16 w-full">
      <svg viewBox="0 0 220 64" className="h-full w-full" aria-hidden="true">
        <path
          d="M24 48C62 46 68 20 108 20s52 22 88 6"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.35"
          strokeDasharray="3 5"
        />
        {[
          [24, 48, '#22d3ee'],
          [108, 20, '#a78bfa'],
          [196, 26, '#f5c451'],
        ].map(([cx, cy, color]) => (
          <g key={String(cx)}>
            <circle cx={Number(cx)} cy={Number(cy)} r="10" fill={String(color)} opacity="0.12" />
            <circle cx={Number(cx)} cy={Number(cy)} r="4" fill={String(color)} />
          </g>
        ))}
      </svg>
    </div>
  )
}

function QuestionVisual() {
  const { t } = useI18n()
  return (
    <div className="flex h-16 flex-wrap items-center gap-2">
      <span className="rounded-lg border border-neon/20 bg-neon/10 px-2.5 py-1.5 text-[10px] font-semibold text-neon-soft">
        {t('play.questionMcq')}
      </span>
      <span className="rounded-lg border border-plum/20 bg-plum/10 px-2.5 py-1.5 text-[10px] font-semibold text-plum-soft">
        {t('play.questionPuzzle')}
      </span>
      <span className="rounded-lg border border-gold/20 bg-gold/10 px-2.5 py-1.5 font-pixel text-[8px] text-gold">
        +100 XP
      </span>
    </div>
  )
}

function ChartVisual() {
  return (
    <div className="flex h-16 items-end gap-2">
      {[78, 54, 38, 88, 66].map((height, index) => (
        <div key={index} className="flex-1">
          <div
            className={`w-full rounded-t-md ${
              height < 60 ? 'bg-danger/70' : 'bg-gradient-to-t from-neon/30 to-neon'
            }`}
            style={{ height: `${height * 0.55}px` }}
          />
        </div>
      ))}
    </div>
  )
}

function LanguageVisual() {
  const { t } = useI18n()
  return (
    <div className="flex h-16 items-center gap-2">
      <span className="flex h-10 flex-1 items-center justify-center rounded-xl border border-neon/20 bg-neon/[0.06] text-xs font-bold text-neon-soft">
        {t('common.bmShort')}
      </span>
      <span className="text-slate-600">/</span>
      <span className="flex h-10 flex-1 items-center justify-center rounded-xl border border-plum/20 bg-plum/[0.06] text-xs font-bold text-plum-soft">
        {t('common.enShort')}
      </span>
    </div>
  )
}

function QrVisual() {
  return (
    <div className="flex h-16 items-center gap-4">
      <div className="grid h-14 w-14 shrink-0 grid-cols-5 gap-[2px] rounded-lg bg-white p-1.5">
        {Array.from({ length: 25 }).map((_, index) => (
          <span
            key={index}
            className={`rounded-[1px] ${
              [0, 1, 2, 5, 7, 9, 10, 12, 14, 16, 18, 19, 20, 22, 24].includes(index)
                ? 'bg-abyss'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
      <div className="min-w-0">
        <div className="h-2 w-24 rounded-full bg-white/15" />
        <div className="mt-2 h-2 w-16 rounded-full bg-white/[0.08]" />
      </div>
    </div>
  )
}

function ReviewVisual() {
  return (
    <div className="flex h-16 items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-success/30 bg-success/10">
        <ShieldCheck className="h-5 w-5 text-success" />
      </div>
      <div className="space-y-1.5">
        <div className="h-2 w-24 rounded-full bg-white/15" />
        <div className="h-2 w-16 rounded-full bg-white/[0.08]" />
      </div>
      <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-xs text-success">
        ✓
      </span>
    </div>
  )
}

export function FeaturesSection() {
  const { t } = useI18n()

  const features: Feature[] = [
    { title: 'landing.f1Title', description: 'landing.f1Desc', icon: Map, visual: <MapVisual /> },
    {
      title: 'landing.f2Title',
      description: 'landing.f2Desc',
      icon: Puzzle,
      visual: <QuestionVisual />,
    },
    {
      title: 'landing.f3Title',
      description: 'landing.f3Desc',
      icon: BarChart3,
      visual: <ChartVisual />,
    },
    {
      title: 'landing.f4Title',
      description: 'landing.f4Desc',
      icon: Languages,
      visual: <LanguageVisual />,
    },
    { title: 'landing.f5Title', description: 'landing.f5Desc', icon: QrCode, visual: <QrVisual /> },
    {
      title: 'landing.f6Title',
      description: 'landing.f6Desc',
      icon: ShieldCheck,
      visual: <ReviewVisual />,
    },
  ]

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('landing.featuresEyebrow')}
          title={t('landing.featuresTitle')}
          description={t('landing.featuresSubtitle')}
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="card group relative p-5 transition duration-300 hover:-translate-y-1 hover:border-neon/20"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-neon-soft">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-base font-semibold text-white">
                    {t(feature.title)}
                  </h3>
                </div>
                <div className="mt-4 rounded-xl border border-white/[0.05] bg-abyss/50 px-3 py-2">
                  {feature.visual}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-mist">
                  {t(feature.description)}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
