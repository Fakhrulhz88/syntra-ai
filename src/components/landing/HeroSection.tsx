import { useId } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'
import { useI18n } from '../../i18n'
import { LinkButton } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { SongketPattern } from '../background/SongketPattern'

function HeroMapArt() {
  const skyId = useId()
  const seaId = useId()
  const glowId = useId()
  return (
    <svg
      viewBox="0 0 420 228"
      className="h-full w-full"
      role="img"
      aria-label="Stylised map of the Malacca Sultanate adventure"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080e2a" />
          <stop offset="55%" stopColor="#182a5c" />
          <stop offset="100%" stopColor="#3d355f" />
        </linearGradient>
        <linearGradient id={seaId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b3d5c" />
          <stop offset="100%" stopColor="#082033" />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#f5c451" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f5c451" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="420" height="228" fill={`url(#${skyId})`} />
      <circle cx="320" cy="78" r="68" fill={`url(#${glowId})`} opacity="0.5" />
      <circle cx="320" cy="78" r="20" fill="#f5c451" opacity="0.85" />
      <circle cx="320" cy="78" r="11" fill="#ffe8b0" />

      {[
        [42, 34],
        [90, 58],
        [150, 28],
        [214, 48],
        [368, 30],
        [260, 22],
        [122, 92],
      ].map(([cx, cy], index) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={index % 2 === 0 ? 1.4 : 1}
          fill="#c7f5ff"
          opacity={0.5 + (index % 3) * 0.15}
        />
      ))}

      <path
        d="M0 128c42-20 74-12 108-24 40-14 66 6 100-2 42-10 76 14 124 0 32-10 58-6 88-18v144H0Z"
        fill="#0b1636"
      />
      <path
        d="M0 152c50-12 96-2 140-12 42-10 68 8 110 2 46-6 98 8 170-6v92H0Z"
        fill={`url(#${seaId})`}
      />

      <g opacity="0.9">
        <path d="M262 150h48l-8 8h-32Z" fill="#f5c451" opacity="0.6" />
        <path d="M286 150v-28l20 12-20 8" fill="#e6f7ff" opacity="0.75" />
        <path d="M284 122v28" stroke="#cbd5e1" strokeWidth="1.2" />
        <path d="M92 170h36l-6 6H98Z" fill="#a78bfa" opacity="0.55" />
        <path d="M110 170v-22l16 10-16 6" fill="#e9e2ff" opacity="0.6" />
      </g>

      <path
        d="M78 190C140 186 160 142 214 136s68-40 128-50"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.4"
        strokeDasharray="3 6"
        opacity="0.5"
      />

      {[
        { x: 78, y: 190, n: '1', done: true },
        { x: 214, y: 136, n: '2', done: false },
        { x: 342, y: 86, n: '3', done: false },
      ].map((node) => (
        <g key={node.n}>
          <circle cx={node.x} cy={node.y} r="16" fill="#081226" stroke="#22d3ee" strokeOpacity="0.5" />
          <circle cx={node.x} cy={node.y} r="12" fill={node.done ? '#22d3ee' : '#0f1c3f'} />
          <text
            x={node.x}
            y={node.y + 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={node.done ? '#04060f' : '#a5f3fc'}
            fontFamily="Inter, sans-serif"
          >
            {node.done ? '✓' : node.n}
          </text>
        </g>
      ))}

      <g transform="translate(70 168)">
        <circle r="7" fill="#a78bfa" opacity="0.25" />
        <circle r="4" fill="#c4b5fd" />
        <path d="M-3 1 0-4l3 5" stroke="#1e1b4b" strokeWidth="1.4" fill="none" />
      </g>

      <text x="22" y="214" fill="#7dd3fc" fontSize="8" letterSpacing="2" fontFamily="Inter, sans-serif">
        MELAKA · 1400s
      </text>
    </svg>
  )
}

export function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-neon/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-32 h-[420px] w-[420px] rounded-full bg-plum/10 blur-[120px]" />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="eyebrow">
            <Sparkles className="h-3 w-3" />
            {t('landing.eyebrow')}
          </span>

          <h1 className="mt-6 font-display text-[2.7rem] font-bold leading-[1.03] tracking-[-0.035em] text-white sm:text-6xl xl:text-[4.4rem]">
            <span className="block">{t('landing.title1')}</span>
            <span className="relative mt-1 inline-block text-slate-400/75">
              {t('landing.title2')}
              <span className="absolute left-0 top-1/2 h-[3px] w-full -rotate-2 rounded-full bg-gradient-to-r from-danger via-gold to-danger/40" />
            </span>
            <span className="mt-1 block text-gradient">{t('landing.title3')}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-mist sm:text-lg">
            {t('landing.subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton
              to="/play/demo-malacca"
              size="lg"
              icon={<Gamepad2 className="h-4 w-4" />}
            >
              {t('landing.ctaDemo')}
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton
              to="/create"
              size="lg"
              variant="secondary"
              icon={<Upload className="h-4 w-4" />}
            >
              {t('landing.ctaUpload')}
            </LinkButton>
          </div>

          <Link
            to="/pipeline/demo"
            className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-neon-soft/90 transition hover:text-neon"
          >
            <PlayCircle className="h-4 w-4" />
            {t('landing.ctaPipeline')}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-[11px] font-medium text-slate-400">
            {[t('landing.chipPdf'), t('landing.chipAgents'), t('landing.chipReady')].map(
              (chip) => (
                <span key={chip} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success/80" />
                  {chip}
                </span>
              ),
            )}
          </div>

          <div className="mt-9 grid max-w-md grid-cols-3 gap-3 border-t border-white/[0.07] pt-5">
            {[
              [t('landing.heroStat1'), t('landing.heroStat1Label')],
              [t('landing.heroStat2'), t('landing.heroStat2Label')],
              [t('landing.heroStat3'), t('landing.heroStat3Label')],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-[520px] lg:max-w-none"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-neon/15 via-transparent to-plum/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-deep/90 p-4 shadow-[0_40px_120px_-40px_rgba(34,211,238,0.35)] backdrop-blur-xl sm:p-5">
            <SongketPattern
              className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rotate-12"
              opacity={0.15}
            />

            <div className="mb-4 flex items-center justify-between gap-3">
              <Badge tone="neon" dot pulse>
                {t('landing.heroCardLabel')}
              </Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/[0.08] px-2.5 py-1 text-[10px] font-semibold text-gold">
                <ShieldCheck className="h-3 w-3" />
                {t('landing.heroBadge')}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <div className="aspect-[420/228]">
                <HeroMapArt />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
                    {t('landing.heroCardTitle')}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-neon-soft/80">
                    {t('landing.heroCardMeta')}
                  </p>
                </div>
                <Link
                  to="/play/demo-malacca"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neon px-3 text-[11px] font-bold text-abyss transition hover:bg-neon-soft"
                >
                  <Gamepad2 className="h-3.5 w-3.5" />
                  {t('landing.heroCardPlay')}
                </Link>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                [t('landing.heroStat1'), t('landing.heroStat1Label')],
                [t('landing.heroStat2'), t('landing.heroStat2Label')],
                [t('landing.heroStat3'), t('landing.heroStat3Label')],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
                >
                  <p className="flex items-center gap-1.5 font-display text-lg font-bold text-white">
                    {index === 2 ? (
                      <span className="text-gradient text-base">BM/EN</span>
                    ) : (
                      value
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-7 -left-3 hidden w-56 rounded-2xl border border-white/10 bg-[#081127]/95 p-3.5 shadow-2xl backdrop-blur-xl sm:block"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-neon-soft">
                <Zap className="h-3 w-3" /> {t('landing.pipelineLive')}
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
            </div>
            <div className="mt-3 space-y-2">
              {[
                [t('landing.pipelineAgent1'), true],
                [t('landing.pipelineAgent2'), true],
                [t('landing.pipelineAgent3'), true],
                [t('landing.pipelineAgent4'), false],
              ].map(([label, done]) => (
                <div key={String(label)} className="flex items-center gap-2 text-[10px]">
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                      done ? 'bg-success/20 text-success' : 'bg-neon/20 text-neon'
                    }`}
                  >
                    {done ? '✓' : '•'}
                  </span>
                  <span className={done ? 'text-slate-400' : 'text-slate-200'}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-neon to-plum" />
            </div>
          </motion.div>

          <div className="absolute -right-2 top-16 hidden rotate-3 rounded-xl border border-gold/20 bg-[#1a1608]/90 px-3 py-2 text-[10px] font-semibold text-gold shadow-xl backdrop-blur sm:block">
            ★ {t('landing.heroCardObjective')}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
