/**
 * ─── SERVICES CONFIG ──────────────────────────────────────────────────────────
 * Edit titles, descriptions, and icons here without touching the component.
 */
export type IconKey = 'hatha' | 'pranayama' | 'ayurveda' | 'sound'

export type Service = {
  id: string
  icon: IconKey
  title: string
  description: string
}

export const servicesConfig = {
  sectionLabel: 'What We Offer',
  heading: 'Your Path to Wellness',
  subheading: 'Discover practices tailored to every aspect of your journey toward a calmer, more focused life.',
  services: [
    {
      id: 'hathayoga',
      icon: 'hatha',
      title: 'Hatha Yoga',
      description: 'A foundational yoga practice focusing on posture and breath, helping you develop strength, flexibility, and a peaceful, focused state of mind.',
    },
    {
      id: 'pranayama',
      icon: 'pranayama',
      title: 'Pranayama & Meditation ',
      description: 'Combine breathwork and meditation to release tension, center your thoughts, and connect deeply with your inner self and present moment awareness.',
    },
    {
      id: 'ayurveda',
      icon: 'ayurveda',
      title: 'Ayurveda & Nutrition Consultancy',
      description: 'Personalized Ayurvedic consultations and nutrition guidance to support your unique constitution and wellness goals.',
    },
    {
      id: 'soundtherapy',
      icon: 'sound',
      title: 'Sound Therapy',
      description: 'An immersive experience using sound and vibration to release stress, enhance clarity, and support emotional balance and deep inner relaxation.',
    },
  ],
}
