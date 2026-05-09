import React, { useEffect, useRef } from 'react'
import type { BookingData } from '@features/booking/booking.config'
import styles from '@features/booking/BookingModal.module.css'
import cfStyles from '@features/booking/BookingModal.module.css'

interface Props { data: BookingData; onClose: () => void }

function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// ── Petal particle ──────────────────────────────────────────────────────────
function Petals() {
  const petals = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    emoji: ['🌸','🍃','🪷','✨','🌿'][i % 5],
    delay: `${i * 0.11}s`,
    x: `${-40 + i * 10}%`,
    rotate: `${-20 + i * 8}deg`,
  }))
  return (
    <div className={cfStyles.petalsWrap} aria-hidden="true">
      {petals.map(p => (
        <span
          key={p.id}
          className={cfStyles.petal}
          style={{ '--p-delay': p.delay, '--p-x': p.x, '--p-rotate': p.rotate } as React.CSSProperties}
        >{p.emoji}</span>
      ))}
    </div>
  )
}

export function StepConfirm({ data, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Auto-focus close button for keyboard accessibility
    const t = setTimeout(() => closeBtnRef.current?.focus(), 200)
    return () => clearTimeout(t)
  }, [])

  const summaryItems = [
    { label: 'Session',  value: data.sessionType || '—' },
    { label: 'Date',     value: data.date         || '—' },
    { label: 'Time',     value: data.timeSlot      || '—' },
    { label: 'Timezone', value: data.timezone      || '—' },
  ]

  return (
    <div className={cfStyles.wrap} role="status" aria-live="polite" aria-label="Booking confirmed">
      <Petals />

      {/* Check circle */}
      <div className={cfStyles.checkCircle} aria-hidden="true">
        <IconCheck />
      </div>

      {/* Headline */}
      <div className={cfStyles.textBlock}>
        <h2 className={cfStyles.title}>Booking Sent!</h2>
        <p className={cfStyles.subtitle}>
          Thank you, <strong className={cfStyles.name}>{data.name || 'dear one'}</strong>.
        </p>
        <p className={cfStyles.calmMsg}>
          Your request has been received. We'll confirm your session shortly and reach out with preparation notes.
        </p>
      </div>

      {/* Mini summary */}
      <div className={cfStyles.summaryCard}>
        {summaryItems.map(item => (
          <div key={item.label} className={cfStyles.summaryRow}>
            <span className={cfStyles.summaryLabel}>{item.label}</span>
            <span className={cfStyles.summaryValue}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Closing quote */}
      <p className={cfStyles.quote}>
        "The present moment is the only moment available to us,
        and it is the door to all moments."
        <span className={cfStyles.quoteAuthor}>— Thích Nhất Hạnh</span>
      </p>

      {/* Close */}
      <button
        ref={closeBtnRef}
        type="button"
        className={cfStyles.closeBtn}
        onClick={onClose}
      >
        Return to site
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  )
}
