// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface NavLink {
  label: string
  href: string
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  rating: number          // 1-5
  text: string
  date: string
  source: 'google'
}

export interface Service {
  id: string
  icon: string            // SVG path string or component name
  title: string
  description: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export type FormStatus = 'idle' | 'loading' | 'success' | 'error'
