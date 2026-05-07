import { HeroSection }         from '@features/hero'
import { ServicesSection }     from '@features/services'
import { TestimonialsSection } from '@features/testimonials'
import { ContactSection }      from '@features/contact'
import { AboutSection }        from '@/features/about'

export default function HomePage(): JSX.Element {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  )
}
