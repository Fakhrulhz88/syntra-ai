import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { NeuronBackground } from '../background/NeuronBackground'

export function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <NeuronBackground className="opacity-70" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,#04060f_88%)]" />
      <div className="relative z-10">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-neon focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-abyss"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
