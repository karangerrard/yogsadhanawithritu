import React, { useState } from 'react'
import type { BookingData } from '@features/booking/booking.config'
import styles from '@features/booking/BookingModal.module.css'
import expStyles from '@features/booking/BookingModal.module.css'

// ── Experience data ───────────────────────────────────────────────────────────
interface Experience {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  tags: string[]
  mood: string
}

const PrivateOnlineIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="10" r="4" />
    <path d="M8 26c0-4.418 3.582-8 8-8s8 3.582 8 8" />
    <path d="M22 14c2.5 1 4 3.2 4 5.5" strokeOpacity="0.45" />
    <circle cx="24" cy="10" r="2.5" strokeOpacity="0.45" />
  </svg>
)

const SharedCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="10" r="3.5" />
    <circle cx="21" cy="10" r="3.5" />
    <path d="M4 26c0-3.866 3.134-7 7-7h10c3.866 0 7 3.134 7 7" />
  </svg>
)

const PrivateInPersonIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4 C10 4 6 9 6 14 C6 20 16 28 16 28 C16 28 26 20 26 14 C26 9 22 4 16 4Z" />
    <circle cx="16" cy="14" r="3.5" />
  </svg>
)

const GroupWellnessIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="9"  r="3" />
    <circle cx="22" cy="9"  r="3" />
    <circle cx="16" cy="8"  r="3.5" />
    <path d="M4 26c0-3.31 2.686-6 6-6h12c3.314 0 6 2.69 6 6" />
    <path d="M10 20c1.5-1.2 3.5-2 6-2s4.5.8 6 2" strokeOpacity="0.4" />
  </svg>
)

const EXPERIENCES: Experience[] = [
  {
    id: 'private-online',
    icon: <PrivateOnlineIcon />,
    title: 'Private Online Session',
    subtitle: 'One-on-one · From anywhere',
    description: 'A deeply personal practice tailored entirely to you. Connect with your guide over video for focused, undistracted growth.',
    tags: ['45–60 min', 'Video call', 'Personalised'],
    mood: 'intimate',
  },
  {
    id: 'shared-circle',
    icon: <SharedCircleIcon />,
    title: 'Online Group Class',
    subtitle: 'Small group · Live virtual',
    description: 'Practice alongside a curated group of like-minded souls. Shared energy, guided intention, collective stillness.',
    tags: ['60 min', 'Live stream', 'Small group'],
    mood: 'communal',
  },
  {
    id: 'private-inperson',
    icon: <PrivateInPersonIcon />,
    title: 'Private In-Person Experience',
    subtitle: 'One-on-one · At a location near you',
    description: 'The fullness of in-person presence. Your guide arrives for you — a sacred space created just for your journey.',
    tags: ['60–90 min', 'In-person', 'Private'],
    mood: 'sacred',
  },
  {
    id: 'group-wellness',
    icon: <GroupWellnessIcon />,
    title: 'Offline Group Gathering',
    subtitle: 'Community · Shared space',
    description: 'Immerse in the warmth of community. Sound, breath, and movement held together in a thoughtfully curated gathering.',
    tags: ['75–90 min', 'In-person', 'Community'],
    mood: 'communal',
  },
]

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  data: BookingData
  onNext: (d: Partial<BookingData>) => void
}

// ── Component ─────────────────────────────────────────────────────────────────
export function StepSessionExp({ data, onNext }: Props) {
  const [selected, setSelected] = useState<string>(data.sessionType || '')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelected(id)
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelected(id)
    }
  }

  const selectedExp = EXPERIENCES.find(e => e.id === selected)

  return (
    <div className={styles.stepContent}>
      {/* Intro */}
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Choose Your Experience</h2>
        <p className={styles.stepDesc}>
          Each path is a different way to arrive at the same stillness. Choose what calls to you.
        </p>
      </div>

      {/* Cards grid */}
      <div className={expStyles.grid} role="radiogroup" aria-label="Choose your session type">
        {EXPERIENCES.map((exp) => {
          const isSelected = selected === exp.id
          const isHovered  = hoveredId === exp.id
          return (
            <div
              key={exp.id}
              className={`
                ${expStyles.card}
                ${isSelected ? expStyles.cardSelected : ''}
                ${isHovered && !isSelected ? expStyles.cardHovered : ''}
              `}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleSelect(exp.id)}
              onKeyDown={(e) => handleKeyDown(e, exp.id)}
              onMouseEnter={() => setHoveredId(exp.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Selection ring */}
              <div className={expStyles.selectionRing} aria-hidden="true" />

              {/* Icon */}
              <div className={`${expStyles.iconWrap} ${isSelected ? expStyles.iconWrapSelected : ''}`}>
                {exp.icon}
              </div>

              {/* Text */}
              <div className={expStyles.cardBody}>
                <h3 className={expStyles.cardTitle}>{exp.title}</h3>
                <p className={expStyles.cardSubtitle}>{exp.subtitle}</p>
                <p className={expStyles.cardDesc}>{exp.description}</p>
              </div>

              {/* Tags */}
              <div className={expStyles.tags}>
                {exp.tags.map(tag => (
                  <span key={tag} className={`${expStyles.tag} ${isSelected ? expStyles.tagSelected : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Selected check */}
              {isSelected && (
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

      {/* Gentle selected state echo */}
      {selectedExp && (
        <div className={expStyles.selectionEcho} role="status" aria-live="polite">
          <span className={expStyles.echoLabel}>Selected</span>
          <span className={expStyles.echoValue}>{selectedExp.title}</span>
        </div>
      )}

      {/* Footer */}
      <div className={styles.stepFooter}>
        <button
          className={styles.nextBtn}
          onClick={() => selected && onNext({ sessionType: selected })}
          disabled={!selected}
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
