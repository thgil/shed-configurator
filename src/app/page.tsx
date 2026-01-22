import { HeroSection } from '@/components/landing/hero-section'
import { ShedCategories } from '@/components/landing/shed-categories'
import { FeaturesSection } from '@/components/landing/features-section'
import { InteractivePreview } from '@/components/landing/interactive-preview'
import { TestimonialsSection } from '@/components/landing/testimonials'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { FAQSection } from '@/components/landing/faq-section'
import { CTASection } from '@/components/landing/cta-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ShedCategories />
      <InteractivePreview />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
