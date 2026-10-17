import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import AIAssistantPreview from '../components/landing/AIAssistantPreview'
import BrokerSection from '../components/landing/BrokerSection'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

function Landing() {
  return (
    <main className="landing-root min-h-screen overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-[#08090b] dark:text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AIAssistantPreview />
      <BrokerSection />
      <CTA />
      <Footer />
    </main>
  )
}

export default Landing