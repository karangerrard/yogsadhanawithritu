import { HeroSection }         from '@features/hero'
import { ServicesSection }     from '@features/services'
import { TestimonialsSection } from '@features/testimonials'
import { ContactSection }      from '@features/contact'

export default function HomePage(): JSX.Element {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  )
}
