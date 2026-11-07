import { HeroSection } from '../components/landing/HeroSection'
import { StepsSection } from '../components/landing/StepsSection'
import { AgentsSection } from '../components/landing/AgentsSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { DemoCta } from '../components/landing/DemoCta'
import { SongketBand } from '../components/background/SongketPattern'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <SongketBand className="opacity-50" />
      <StepsSection />
      <AgentsSection />
      <SongketBand className="opacity-30" />
      <FeaturesSection />
      <DemoCta />
    </>
  )
}
