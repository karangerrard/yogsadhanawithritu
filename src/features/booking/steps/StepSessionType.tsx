import React, { useState } from 'react'
import type { BookingData } from '@features/booking/booking.config'
import styles from '@features/booking/BookingModal.module.css'
import expStyles from '@features/booking/BookingModal.module.css'

// ── Service availability matrix ───────────────────────────────────────────────
// session IDs from StepExperienceType:
//   'private-online' | 'shared-circle' | 'private-inperson' | 'group-wellness'

interface Service {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  tags: string[]
  availableFor: string[] // session IDs this service is valid for
}

const YogaIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="6" r="2.5" />
    <path d="M16 9v7" />
    <path d="M9 13c2 0 4.5 1.5 7 3 2.5-1.5 5-3 7-3" />
    <path d="M11 22c0-2 1.5-4 5-6 3.5 2 5 4 5 6" />
    <path d="M13 22v4M19 22v4" />
  </svg>
)

const PranayamaIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 28 C16 28 6 22 6 14 C6 9.582 10.477 6 16 6 C21.523 6 26 9.582 26 14 C26 22 16 28 16 28Z" />
    <path d="M16 6 v6" strokeOpacity="0.5" />
    <path d="M10 9.5 l3 4" strokeOpacity="0.5" />
    <path d="M22 9.5 l-3 4" strokeOpacity="0.5" />
    <circle cx="16" cy="15" r="2.5" />
  </svg>
)

const AyurvedaIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4 C10 4 7 9 7 14 C7 22 16 28 16 28 C16 28 25 22 25 14 C25 9 22 4 16 4Z" />
    <path d="M16 10 v12" />
    <path d="M11 15 h10" />
    <path d="M12.5 11.5 C14 10 18 10 19.5 11.5" strokeOpacity="0.5" />
  </svg>
)

const SoundIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="16" cy="16" rx="10" ry="5" />
    <path d="M6 16 C6 16 6 22 16 24 C26 22 26 16 26 16" />
    <path d="M11 14.5 C11 14.5 11 20 16 21 C21 20 21 14.5 21 14.5" strokeOpacity="0.5" />
    <line x1="16" y1="6" x2="16" y2="10" strokeOpacity="0.5" />
  </svg>
)

const SERVICES: Service[] = [
  {
    id: 'yoga',
    icon: <YogaIcon />,
    title: 'Yoga Session',
    subtitle: 'Movement · Breath · Alignment',
    description: 'A mindful flow through postures and breath that restores balance, opens the body and quiets the mind.',
    tags: ['Asana', 'All levels', 'Online & Offline'],
    availableFor: ['private-online', 'shared-circle', 'private-inperson', 'group-wellness'],
  },
  {
    id: 'pranayama',
    icon: <PranayamaIcon />,
    title: 'Pranayama & Meditation',
    subtitle: 'Breath · Stillness · Inner clarity',
    description: 'Ancient breathing techniques and guided meditation to calm the nervous system and deepen inner awareness.',
    tags: ['Breathwork', 'Meditation', 'Online & Offline'],
    availableFor: ['private-online', 'shared-circle', 'private-inperson', 'group-wellness'],
  },
  {
    id: 'ayurveda',
    icon: <AyurvedaIcon />,
    title: 'Ayurveda & Naturopathy Consultation',
    subtitle: 'Individual only · Holistic assessment',
    description: 'A personal consultation rooted in Ayurvedic wisdom — understanding your unique constitution for lasting wellness.',
    tags: ['Individual only', 'Consultation', 'Online & Offline'],
    availableFor: ['private-online', 'private-inperson'],
  },
  {
    id: 'sound',
    icon: <SoundIcon />,
    title: 'Sound Healing',
    subtitle: 'Offline only · Vibrational therapy',
    description: 'Immerse in the resonance of singing bowls and sacred instruments. A deeply restorative in-person experience.',
    tags: ['Offline only', 'In-person', 'Individual & Group'],
    availableFor: ['private-inperson', 'group-wellness'],
  },
]

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  data: BookingData
  onNext: (d: Partial<BookingData>) => void
}

// ── Component ─────────────────────────────────────────────────────────────────
export function StepSessionType({ data, onNext }: Props) {
  const [selected, setSelected] = useState<string>(data.service || '')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Filter services based on previously chosen session type
  const sessionId = data.sessionType || ''
  const available = SERVICES.filter(s => s.availableFor.includes(sessionId))
  const unavailable = SERVICES.filter(s => !s.availableFor.includes(sessionId))

  // If selected becomes unavailable due to session change, clear it
  const effectiveSelected = available.some(s => s.id === selected) ? selected : ''

  const handleSelect = (id: string) => setSelected(id)

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(id) }
  }

  const selectedService = available.find(s => s.id === effectiveSelected)

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>What calls to you?</h2>
        <p className={styles.stepDesc}>
          Choose the practice that resonates with where you are right now.
        </p>
      </div>

      {/* Available services */}
      <div className={expStyles.grid} role="radiogroup" aria-label="Choose a service">
        {available.map((svc) => {
          const isSel = effectiveSelected === svc.id
          const isHov = hoveredId === svc.id
          return (
            <div
              key={svc.id}
              className={`${expStyles.card} ${isSel ? expStyles.cardSelected : ''} ${isHov && !isSel ? expStyles.cardHovered : ''}`}
              role="radio"
              aria-checked={isSel}
              tabIndex={0}
              onClick={() => handleSelect(svc.id)}
              onKeyDown={(e) => handleKeyDown(e, svc.id)}
              onMouseEnter={() => setHoveredId(svc.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={expStyles.selectionRing} aria-hidden="true" />
              <div className={`${expStyles.iconWrap} ${isSel ? expStyles.iconWrapSelected : ''}`}>
                {svc.icon}
              </div>
              <div className={expStyles.cardBody}>
                <h3 className={expStyles.cardTitle}>{svc.title}</h3>
                <p className={expStyles.cardSubtitle}>{svc.subtitle}</p>
                <p className={expStyles.cardDesc}>{svc.description}</p>
              </div>
              <div className={expStyles.tags}>
                {svc.tags.map(tag => (
                  <span key={tag} className={`${expStyles.tag} ${isSel ? expStyles.tagSelected : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
              {isSel && (
                <div className={expStyles.checkBadge} aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Unavailable services — shown as dimmed with reason */}
      {unavailable.length > 0 && (
        <div className={expStyles.unavailableSection}>
          <span className={expStyles.unavailableLabel}>Not available for your session type</span>
          <div className={expStyles.unavailableGrid}>
            {unavailable.map(svc => (
              <div key={svc.id} className={expStyles.unavailableCard} aria-disabled="true">
                <div className={expStyles.unavailableIcon}>{svc.icon}</div>
                <span className={expStyles.unavailableTitle}>{svc.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection echo */}
      {selectedService && (
        <div className={expStyles.selectionEcho} role="status" aria-live="polite">
          <span className={expStyles.echoLabel}>Selected</span>
          <span className={expStyles.echoValue}>{selectedService.title}</span>
        </div>
      )}

      <div className={styles.stepFooter}>
        <button
          className={styles.nextBtn}
          onClick={() => effectiveSelected && onNext({ service: effectiveSelected })}
          disabled={!effectiveSelected}
          type="button"
        >
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
