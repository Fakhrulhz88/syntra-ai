import { Languages } from 'lucide-react'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1',
        compact && 'p-0.5',
      )}
      role="group"
      aria-label={t('a11y.langToggle')}
    >
      <Languages className="ml-1.5 h-3.5 w-3.5 text-mist/70" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLang('bm')}
        className={cn(
          'rounded-full px-2 py-1 text-[10px] font-bold tracking-wide transition',
          lang === 'bm'
            ? 'bg-neon/15 text-neon-soft'
            : 'text-mist hover:text-white',
        )}
        aria-pressed={lang === 'bm'}
      >
        {t('common.bmShort')}
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={cn(
          'rounded-full px-2 py-1 text-[10px] font-bold tracking-wide transition',
          lang === 'en'
            ? 'bg-neon/15 text-neon-soft'
            : 'text-mist hover:text-white',
        )}
        aria-pressed={lang === 'en'}
      >
        {t('common.enShort')}
      </button>
    </div>
  )
}
