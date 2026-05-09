import React, { useState, useMemo } from 'react'
import { TIME_SLOTS, type BookingData } from '@features/booking/booking.config'
import styles from '@features/booking/BookingModal.module.css'
import tsStyles from '@features/booking/BookingModal.module.css'

interface Props { data: BookingData; onNext: (d: Partial<BookingData>) => void }

// ── Period metadata ────────────────────────────────────────────────────────────
const PERIOD_META: Record<string, { icon: React.ReactNode; label: string; sublabel: string }> = {
  Morning: {
    label: 'Morning',
    sublabel: 'Before noon',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
  },
  Afternoon: {
    label: 'Afternoon',
    sublabel: '12 pm – 5 pm',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="9" x2="12" y2="2"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
      </svg>
    ),
  },
  Evening: {
    label: 'Evening',
    sublabel: 'After 5 pm',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
}

const PERIODS = ['Morning', 'Afternoon', 'Evening']

// ── Timezone offset label ─────────────────────────────────────────────────────
function getTimezoneLabel(tzId: string): string {
  if (!tzId) return ''
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tzId,
      timeZoneName: 'short',
    })
    const parts = formatter.formatToParts(now)
    const tzName = parts.find(p => p.type === 'timeZoneName')?.value ?? ''
    return tzName
  } catch {
    return ''
  }
}

export function StepTimeSlot({ data, onNext }: Props) {
  const [selected, setSelected]   = useState<string>(data.timeSlot || '')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const tzLabel = useMemo(() => getTimezoneLabel(data.timezone), [data.timezone])

  const selectedSlot = TIME_SLOTS.find(s => s.label === selected)

  // Group slots by period, only include periods that have slots
  const periodGroups = PERIODS
    .map(p => ({ period: p, slots: TIME_SLOTS.filter(s => s.period === p) }))
    .filter(g => g.slots.length > 0)

  // Stats for subtle context
  const totalAvailable = TIME_SLOTS.filter(s => s.available).length

  return (
    <div className={styles.stepContent}>

      {/* Intro */}
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Pick a Time</h2>
        <p className={styles.stepDesc}>
          {data.date ? (
            <>Showing slots for <strong>{data.date}</strong>.</>
          ) : 'Choose a time that feels right for your practice.'}{' '}
          {tzLabel && (
            <span className={tsStyles.tzBadge}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {tzLabel}
            </span>
          )}
        </p>
      </div>

      {/* Slot groups */}
      <div className={tsStyles.groups}>
        {periodGroups.map(({ period, slots }) => {
          const meta         = PERIOD_META[period]
          const hasAvailable = slots.some(s => s.available)

          return (
            <div key={period} className={tsStyles.group}>

              {/* Period header */}
              <div className={tsStyles.periodHeader}>
                <span className={tsStyles.periodIcon} aria-hidden="true">{meta.icon}</span>
                <span className={tsStyles.periodLabel}>{meta.label}</span>
                <span className={tsStyles.periodSub}>{meta.sublabel}</span>
                {!hasAvailable && (
                  <span className={tsStyles.periodFull}>All full</span>
                )}
              </div>

              {/* Pills row — horizontal scroll on mobile */}
              <div className={tsStyles.pillsRow} role="radiogroup" aria-label={`${period} time slots`}>
                {slots.map(slot => {
                  const isSel = selected === slot.label
                  const isHov = hoveredId === slot.id && slot.available && !isSel

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      className={`
                        ${tsStyles.pill}
                        ${!slot.available ? tsStyles.pillUnavailable : ''}
                        ${isSel            ? tsStyles.pillSelected    : ''}
                        ${isHov            ? tsStyles.pillHovered     : ''}
                      `}
                      onClick={() => slot.available && setSelected(slot.label)}
                      onMouseEnter={() => slot.available && setHoveredId(slot.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      disabled={!slot.available}
                      aria-pressed={isSel}
                      aria-label={`${slot.label}${!slot.available ? ', fully booked' : ''}`}
                    >
                      {/* Dot indicator */}
                      <span
                        className={`${tsStyles.slotDot} ${!slot.available ? tsStyles.slotDotFull : ''} ${isSel ? tsStyles.slotDotSelected : ''}`}
                        aria-hidden="true"
                      />
                      <span className={tsStyles.slotTime}>{slot.label}</span>
                      {!slot.available && (
                        <span className={tsStyles.fullTag} aria-hidden="true">Full</span>
                      )}
                      {isSel && (
                        <span className={tsStyles.checkMark} aria-hidden="true">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Availability note */}
      <p className={tsStyles.availNote}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {totalAvailable} slot{totalAvailable !== 1 ? 's' : ''} available · Times shown in your timezone
      </p>

      {/* Selected echo */}
      {selectedSlot && (
        <div className={tsStyles.selectedEcho} role="status" aria-live="polite">
          <span className={tsStyles.echoIcon} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <div className={tsStyles.echoBody}>
            <span className={tsStyles.echoLabel}>{selectedSlot.period}</span>
            <span className={tsStyles.echoValue}>{selectedSlot.label}</span>
          </div>
          <button
            className={tsStyles.echoClear}
            onClick={() => setSelected('')}
            type="button"
            aria-label="Clear selected time"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.stepFooter}>
        <button
          className={styles.nextBtn}
          onClick={() => selected && onNext({ timeSlot: selected })}
          disabled={!selected}
          type="button"
        >
          Review Booking
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
