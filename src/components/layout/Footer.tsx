import { Link } from 'react-router-dom'
import { ExternalLink, Mail, Sparkles } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { SongketBand } from '../background/SongketPattern'
import { useI18n } from '../../i18n'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-abyss/60">
      <SongketBand className="opacity-60" />
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
              {t('footer.tagline')}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold/90">
              <Sparkles className="h-3 w-3" />
              {t('brand.badge')}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t('footer.product')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mist">
              <li>
                <Link className="transition hover:text-neon-soft" to="/create">
                  {t('nav.create')}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-neon-soft" to="/games">
                  {t('nav.games')}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-neon-soft" to="/play/demo-malacca">
                  {t('landing.heroCardPlay')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t('footer.resources')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mist">
              <li>
                <Link className="transition hover:text-neon-soft" to="/pipeline/demo">
                  {t('nav.demo')} · {t('pipeline.title')}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-neon-soft" to="/dashboard/demo-malacca">
                  {t('nav.dashboard')}
                </Link>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-1.5 transition hover:text-neon-soft"
                  href="mailto:hello@syntra.ai"
                >
                  <Mail className="h-3.5 w-3.5" /> hello@syntra.ai
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t('footer.contact')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-mist">
              <li className="leading-relaxed">{t('footer.builtFor')}</li>
              <li className="text-xs text-slate-500">{t('footer.theme')}</li>
              <li>
                <a
                  className="inline-flex items-center gap-1.5 transition hover:text-neon-soft"
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-slate-500 sm:flex-row">
          <p>{t('footer.rights')}</p>
          <p>{t('footer.note')}</p>
        </div>
      </div>
    </footer>
  )
}
