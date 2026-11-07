import { ArrowRight, Gamepad2, Sparkles } from 'lucide-react'
import { useI18n } from '../../i18n'
import { LinkButton } from '../ui/Button'
import { QRCard } from '../ui/QRCard'
import { SongketPattern } from '../background/SongketPattern'
import { shareUrl } from '../../lib/format'

export function DemoCta() {
  const { t } = useI18n()
  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] border border-neon/20 bg-gradient-to-br from-[#0a1735] via-[#0b1029] to-[#160f30] p-7 shadow-[0_40px_120px_-50px_rgba(34,211,238,0.55)] sm:p-12">
          <SongketPattern className="absolute -right-16 -top-16 h-72 w-72 rotate-12" opacity={0.16} />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-plum/20 blur-[100px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_auto]">
            <div>
              <span className="eyebrow">
                <Sparkles className="h-3 w-3" />
                {t('landing.demoEyebrow')}
              </span>
              <h2 className="mt-5 max-w-xl text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {t('landing.demoTitle')}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-mist sm:text-base">
                {t('landing.demoDesc')}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <LinkButton
                  to="/create?sample=1"
                  size="lg"
                  icon={<Sparkles className="h-4 w-4" />}
                >
                  {t('landing.demoPrimary')}
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <LinkButton
                  to="/play/demo-malacca"
                  size="lg"
                  variant="secondary"
                  icon={<Gamepad2 className="h-4 w-4" />}
                >
                  {t('landing.demoSecondary')}
                </LinkButton>
              </div>
              <p className="mt-7 border-l-2 border-gold/40 pl-4 font-display text-sm italic text-slate-400">
                “{t('landing.quote')}”
              </p>
            </div>

            <div className="mx-auto w-fit rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <QRCard value={shareUrl('/play/demo-malacca')} size={144} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
