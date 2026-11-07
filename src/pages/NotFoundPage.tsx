import { motion } from 'framer-motion'
import { Compass, Gamepad2, Home } from 'lucide-react'
import { useI18n } from '../i18n'
import { LinkButton } from '../components/ui/Button'

export function NotFoundPage() {
  const { t } = useI18n()

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card card-glow w-full max-w-lg p-8 text-center sm:p-10"
      >
        <p className="font-pixel text-4xl leading-none text-gradient">404</p>
        <span className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-neon/20 bg-neon/10 text-neon-soft">
          <Compass className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-white">
          {t('notFound.title')}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-mist">
          {t('notFound.desc')}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <LinkButton to="/" icon={<Home className="h-4 w-4" />}>
            {t('notFound.home')}
          </LinkButton>
          <LinkButton
            to="/games"
            variant="secondary"
            icon={<Gamepad2 className="h-4 w-4" />}
          >
            {t('notFound.games')}
          </LinkButton>
        </div>
      </motion.div>
    </section>
  )
}
