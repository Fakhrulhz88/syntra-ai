import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { LandingPage } from './pages/LandingPage'
import { CreatePage } from './pages/CreatePage'
import { PipelinePage } from './pages/PipelinePage'
import { DashboardPage } from './pages/DashboardPage'
import { GamesPage } from './pages/GamesPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ToastViewport } from './components/ui/ToastViewport'
import { Spinner } from './components/ui/Spinner'
import { useI18n } from './i18n'

const PlayPage = lazy(() =>
  import('./pages/PlayPage').then((module) => ({ default: module.PlayPage })),
)

function GameLoading() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-dvh items-center justify-center bg-abyss">
      <div className="flex flex-col items-center gap-4 text-mist">
        <Spinner className="h-8 w-8" />
        <p className="text-sm">{t('play.loading')}</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<GameLoading />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/pipeline/:id" element={<PipelinePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/dashboard/:gameId" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/play/:gameId" element={<PlayPage />} />
        </Routes>
      </Suspense>
      <ToastViewport />
    </BrowserRouter>
  )
}
