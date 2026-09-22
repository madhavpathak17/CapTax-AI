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
    <main className="min-h-screen overflow-hidden bg-[#08090b] text-[#e7e9ed]">
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