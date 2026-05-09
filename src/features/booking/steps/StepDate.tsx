import React, { useState, useMemo, useRef } from 'react'
import type { BookingData } from '@features/booking/booking.config'
import styles from '@features/booking/BookingModal.module.css'
import calStyles from '@features/booking/BookingModal.module.css'

interface Props { data: BookingData; onNext: (d: Partial<BookingData>) => void }

const DAY_NAMES  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const DAY_FULL   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS     = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export function StepDate({ data, onNext }: Props) {
  const todayRef   = useRef(new Date())
  const today      = todayRef.current

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selected, setSelected]   = useState<string>(data.date || '')
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [animKey, setAnimKey]     = useState(0)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  // ── Calendar grid ───────────────────────────────────────────────────────────
  const { days, year, month } = useMemo(() => {
    const y = viewDate.getFullYear()
    const m = viewDate.getMonth()
    const firstDay    = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const grid: (number | null)[] = []
    for (let i = 0; i < firstDay; i++)    grid.push(null)
    for (let i = 1; i <= daysInMonth; i++) grid.push(i)
    // Pad tail so grid is always complete rows of 7
    while (grid.length % 7 !== 0) grid.push(null)
    return { days: grid, year: y, month: m }
  }, [viewDate])

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const isDisabled  = (day: number) => {
    const d = new Date(year, month, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date(today); t.setHours(0, 0, 0, 0)
    return d < t || d.getDay() === 0          // disable past dates and Sundays
  }
  const isToday     = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const fmt         = (day: number) => `${MONTHS[month]} ${day}, ${year}`
  const canGoPrev   = viewDate > new Date(today.getFullYear(), today.getMonth(), 1)

  // ── Month navigation ────────────────────────────────────────────────────────
  const navigate = (dir: 'next' | 'prev') => {
    if (dir === 'prev' && !canGoPrev) return
    setDirection(dir)
    setAnimKey(k => k + 1)
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + (dir === 'next' ? 1 : -1), 1))
  }

  // ── Derived selected parts ──────────────────────────────────────────────────
  const selectedDate  = selected ? new Date(selected) : null
  const selectedDay   = selectedDate ? selectedDate.getDate() : null
  const selectedMonth = selectedDate ? selectedDate.getMonth() : null
  const selectedYear  = selectedDate ? selectedDate.getFullYear() : null
  const isSelectedInView = selectedMonth === month && selectedYear === year

  const dayOfWeek = selectedDate
    ? DAY_FULL[selectedDate.getDay()]
    : null

  return (
    <div className={styles.stepContent}>

      {/* Intro */}
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Choose a Date</h2>
        <p className={styles.stepDesc}>
          Sessions run Monday through Saturday. Pick a day that feels right.
        </p>
      </div>

      {/* Calendar card */}
      <div className={calStyles.calendarCard}>

        {/* Month navigation header */}
        <div className={calStyles.calHeader}>
          <button
            className={`${calStyles.navBtn} ${!canGoPrev ? calStyles.navBtnDisabled : ''}`}
            onClick={() => navigate('prev')}
            disabled={!canGoPrev}
            aria-label="Previous month"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className={calStyles.monthLabel} aria-live="polite">
            <span className={calStyles.monthName}>{MONTHS[month]}</span>
            <span className={calStyles.yearName}>{year}</span>
          </div>

          <button
            className={calStyles.navBtn}
            onClick={() => navigate('next')}
            aria-label="Next month"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Day name headers */}
        <div className={calStyles.dayNames} role="row">
          {DAY_NAMES.map((d, i) => (
            <div
              key={d}
              className={`${calStyles.dayName} ${i === 0 ? calStyles.dayNameSunday : ''}`}
              role="columnheader"
              aria-label={DAY_FULL[i]}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid — keyed for animation */}
        <div
          key={animKey}
          className={`${calStyles.calGrid} ${direction === 'next' ? calStyles.slideInNext : calStyles.slideInPrev}`}
          role="grid"
          aria-label={`${MONTHS[month]} ${year}`}
        >
          {days.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className={calStyles.emptyCell} role="gridcell" aria-hidden="true" />
            }
            const disabled   = isDisabled(day)
            const isThisDay  = isToday(day)
            const isSel      = isSelectedInView && selectedDay === day
            const isHov      = hoveredDay === day && !disabled && !isSel

            return (
              <div key={day} role="gridcell" className={calStyles.gridCell}>
                <button
                  type="button"
                  className={`
                    ${calStyles.dayBtn}
                    ${disabled   ? calStyles.dayDisabled  : ''}
                    ${isThisDay  ? calStyles.dayToday     : ''}
                    ${isSel      ? calStyles.daySelected  : ''}
                    ${isHov      ? calStyles.dayHovered   : ''}
                  `}
                  onClick={() => !disabled && setSelected(fmt(day))}
                  onMouseEnter={() => !disabled && setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  disabled={disabled}
                  aria-label={`${DAY_FULL[new Date(year, month, day).getDay()]}, ${MONTHS[month]} ${day}, ${year}${isThisDay ? ' (today)' : ''}${disabled ? ' (unavailable)' : ''}`}
                  aria-pressed={isSel}
                >
                  <span className={calStyles.dayNum}>{day}</span>
                  {isThisDay && <span className={calStyles.todayDot} aria-hidden="true" />}
                </button>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className={calStyles.legend}>
          <span className={calStyles.legendItem}>
            <span className={calStyles.legendDot} />
            Today
          </span>
          <span className={calStyles.legendItem}>
            <span className={`${calStyles.legendDot} ${calStyles.legendDotSelected}`} />
            Selected
          </span>
          <span className={calStyles.legendItem}>
            <span className={`${calStyles.legendDot} ${calStyles.legendDotDisabled}`} />
            Unavailable
          </span>
        </div>
      </div>

      {/* Selected date echo */}
      {selected && (
        <div className={calStyles.selectedEcho} role="status" aria-live="polite">
          <div className={calStyles.echoIcon} aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8"  y1="2" x2="8"  y2="6"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className={calStyles.echoBody}>
            <span className={calStyles.echoDay}>{dayOfWeek}</span>
            <span className={calStyles.echoDate}>{selected}</span>
          </div>
          <button
            className={calStyles.echoClear}
            onClick={() => setSelected('')}
            type="button"
            aria-label="Clear selected date"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.stepFooter}>
        <button
          className={styles.nextBtn}
          onClick={() => selected && onNext({ date: selected })}
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
