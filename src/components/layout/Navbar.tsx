import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Sparkles, X } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { LanguageToggle } from '../ui/LanguageToggle'
import { LinkButton } from '../ui/Button'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'

interface NavItem {
  to: string
  label: string
}

export function Navbar() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links: NavItem[] = [
    { to: '/#how', label: t('nav.how') },
    { to: '/#agents', label: t('nav.agents') },
    { to: '/games', label: t('nav.games') },
    { to: '/pipeline/demo', label: t('nav.demo') },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.06] bg-abyss/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label={t('common.appName')} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('a11y.menu')}>
          {links.map((item) =>
            item.to.startsWith('/#') ? (
              <a
                key={item.to}
                href={item.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-mist transition hover:bg-white/[0.05] hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-white/[0.06] text-white'
                      : 'text-mist hover:bg-white/[0.05] hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <LinkButton
            to="/create"
            size="sm"
            className="hidden sm:inline-flex"
            icon={<Sparkles className="h-3.5 w-3.5" />}
          >
            {t('nav.create')}
          </LinkButton>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 lg:hidden"
            aria-expanded={open}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-white/[0.06] bg-abyss/95 backdrop-blur-2xl lg:hidden"
          >
            <nav className="container-page flex flex-col gap-1 py-4">
              {links.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
                >
                  {item.label}
                </Link>
              ))}
              <LinkButton to="/create" className="mt-2 w-full" icon={<Sparkles className="h-4 w-4" />}>
                {t('nav.create')}
              </LinkButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
