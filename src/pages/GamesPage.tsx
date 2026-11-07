import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Gamepad2,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import type { GameStatus, GameSummary } from '../types'
import { useI18n, type Translate } from '../i18n'
import { api } from '../api'
import { cn } from '../lib/cn'
import { formatDate, shareUrl } from '../lib/format'
import { sceneMeta } from '../game/sceneMeta'
import { Badge, type BadgeTone } from '../components/ui/Badge'
import { Button, LinkButton } from '../components/ui/Button'
import { CopyButton } from '../components/ui/CopyButton'

type Phase = 'loading' | 'ready' | 'error'
type StatusFilter = 'all' | 'ready' | 'generating'

function statusMeta(
  status: GameStatus,
  t: Translate,
): { tone: BadgeTone; label: string } {
  if (status === 'published') return { tone: 'success', label: t('games.statusPublished') }
  if (status === 'ready') return { tone: 'neon', label: t('games.statusReady') }
  return { tone: 'gold', label: t('games.statusGenerating') }
}

function visualFor(game: GameSummary) {
  const text = `${game.subject} ${game.theme}`.toLowerCase()
  if (text.includes('cyber') || text.includes('siber') || text.includes('keselamatan')) {
    return sceneMeta('firewall')
  }
  if (
    text.includes('sejarah') ||
    text.includes('history') ||
    text.includes('melaka') ||
    text.includes('malacca')
  ) {
    return sceneMeta('pelabuhan')
  }
  return sceneMeta('map')
}

export function GamesPage() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('loading')
  const [games, setGames] = useState<GameSummary[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        const list = await api.listGames()
        if (!active) return
        setGames(list)
        setPhase('ready')
      } catch {
        if (active) setPhase('error')
      }
    }
    void run()
    return () => {
      active = false
    }
  }, [retryKey])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return games.filter((game) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'ready'
          ? game.status !== 'generating'
          : game.status === 'generating')
      if (!matchesStatus) return false
      if (!query) return true
      return [game.title, game.subject, game.level, game.theme].some((value) =>
        value.toLowerCase().includes(query),
      )
    })
  }, [games, search, statusFilter])

  const filters: Array<{ value: StatusFilter; label: string }> = [
    { value: 'all', label: t('games.filterAll') },
    { value: 'ready', label: t('games.filterReady') },
    { value: 'generating', label: t('games.filterDraft') },
  ]

  return (
    <section className="container-page py-10 sm:py-14">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
      >
        <div>
          <span className="eyebrow">
            <Sparkles className="h-3 w-3" />
            {t('games.eyebrow')}
          </span>
          <h1 className="mt-4 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t('games.title')}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            {t('games.subtitle')}
          </p>
        </div>
        <LinkButton
          to="/create"
          size="lg"
          icon={<Plus className="h-4 w-4" />}
          className="shrink-0"
        >
          {t('games.newGame')}
        </LinkButton>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="card mt-6 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('games.search')}
            aria-label={t('games.search')}
            className="input-base py-2.5 pl-10 pr-10 text-xs"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
              aria-label={t('games.clearSearch')}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[10px] font-semibold transition',
                statusFilter === filter.value
                  ? 'border-neon/40 bg-neon/10 text-neon-soft'
                  : 'border-line bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-300',
              )}
            >
              {filter.label}
            </button>
          ))}
          <span className="ml-1 rounded-full border border-line bg-deep/70 px-2.5 py-1 font-mono text-[10px] text-slate-500">
            {t('games.total', { count: filtered.length })}
          </span>
        </div>
      </motion.div>

      {phase === 'loading' && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card overflow-hidden">
              <div className="skeleton h-24 rounded-none" />
              <div className="space-y-3 p-4">
                <div className="skeleton h-2.5 w-1/3" />
                <div className="skeleton h-5 w-4/5" />
                <div className="skeleton h-2.5 w-2/3" />
                <div className="skeleton h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {phase === 'error' && (
        <div className="card mt-5 flex flex-col items-center p-8 text-center sm:p-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/25 bg-danger/10 text-danger">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold text-white">
            {t('games.errorTitle')}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
            {t('errors.network')}
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setPhase('loading')
              setRetryKey((value) => value + 1)
            }}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            {t('games.retry')}
          </Button>
        </div>
      )}

      {phase === 'ready' && games.length === 0 && (
        <div className="card mt-5 flex flex-col items-center border-dashed p-8 text-center sm:p-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon/20 bg-neon/10 text-neon-soft">
            <Gamepad2 className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold text-white">
            {t('games.emptyTitle')}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
            {t('games.emptyDesc')}
          </p>
          <LinkButton
            to="/create"
            className="mt-6"
            icon={<Plus className="h-4 w-4" />}
          >
            {t('games.createFirst')}
          </LinkButton>
        </div>
      )}

      {phase === 'ready' && games.length > 0 && filtered.length === 0 && (
        <div className="card mt-5 flex flex-col items-center border-dashed p-8 text-center sm:p-12">
          <Search className="h-6 w-6 text-slate-600" />
          <h2 className="mt-3 font-display text-lg font-semibold text-white">
            {t('games.noResults')}
          </h2>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => {
              setSearch('')
              setStatusFilter('all')
            }}
            icon={<X className="h-4 w-4" />}
          >
            {t('games.clearSearch')}
          </Button>
        </div>
      )}

      {phase === 'ready' && filtered.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((game, index) => {
            const meta = visualFor(game)
            const status = statusMeta(game.status, t)
            const Icon = meta.icon
            const isDemo = game.id.startsWith('demo')
            return (
              <motion.article
                key={game.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.035 }}
                className="card group flex flex-col"
              >
                <div
                  className={cn(
                    'relative flex h-24 items-end overflow-hidden bg-gradient-to-br p-3.5',
                    meta.gradient,
                  )}
                >
                  <Icon
                    className={cn(
                      'absolute -right-3 -top-3 h-24 w-24 opacity-[0.16] transition duration-500 group-hover:scale-110 group-hover:opacity-25',
                      meta.text,
                    )}
                  />
                  <div className="relative flex flex-wrap items-center gap-1.5">
                    <Badge tone={status.tone} dot pulse={game.status === 'generating'}>
                      {status.label}
                    </Badge>
                    {isDemo && <Badge tone="gold">{t('games.demoGame')}</Badge>}
                    <Badge tone="neutral">
                      {game.language === 'bm'
                        ? t('common.bmShort')
                        : t('common.enShort')}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {game.subject} · {game.level}
                  </p>
                  <h2 className="mt-1.5 line-clamp-2 font-display text-base font-semibold leading-snug text-white">
                    {game.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-mist">
                    {game.theme}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge tone="outline">
                      {game.category === 'school'
                        ? t('games.school')
                        : t('games.higherEd')}
                    </Badge>
                    <Badge tone="violet">
                      {t('common.playersCount', { count: game.players })}
                    </Badge>
                    <Badge tone="neon">
                      {t('common.levelsCount', { count: game.levels })}
                    </Badge>
                  </div>

                  <p className="mt-2 text-[10px] text-slate-500">
                    {t('games.created', { date: formatDate(game.created_at, lang) })}
                  </p>

                  <div className="mt-auto flex items-center gap-1.5 pt-4">
                    <Link
                      to={`/play/${game.id}`}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-neon to-[#38bdf8] px-3 text-xs font-semibold text-abyss transition hover:from-neon-soft hover:to-neon"
                    >
                      <Gamepad2 className="h-3.5 w-3.5" />
                      {t('games.play')}
                    </Link>
                    <Link
                      to={`/dashboard/${game.id}`}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-xs font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.1]"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      {t('games.dashboard')}
                    </Link>
                    <CopyButton
                      value={shareUrl(`/play/${game.id}`)}
                      label={t('games.copy')}
                      variant="ghost"
                      iconOnly
                    />
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </section>
  )
}
