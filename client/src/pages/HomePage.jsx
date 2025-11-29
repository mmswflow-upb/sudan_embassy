import StatusBar from '../components/StatusBar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import News from '../components/News'
import InfoGrids from '../components/InfoGrids'
import Forms from '../components/Forms'
import MapSection from '../components/MapSection'
import PromoCarousel from '../components/PromoCarousel'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-4 md:py-6 relative">
      {/* Decorative gradient background behind content */}
      <div aria-hidden className="pointer-events-none absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-gradient-to-tr from-sudan-green/10 to-sudan-blue/10 blur-3xl" />
      </div>
      <StatusBar />
      <Hero />
      <PromoCarousel />
      <Services limit={6} carousel />
      <News limit={4} />
      <InfoGrids />
      <Forms limit={6} />
      <MapSection />
    </main>
  )
}


