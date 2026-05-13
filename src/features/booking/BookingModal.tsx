import { useEffect, useRef, useCallback, useState } from 'react'
import styles from '@features/booking/BookingModal.module.css'
import { BOOKING_STEPS, type BookingData } from '@features/booking/booking.config'
import { StepTimezone }    from '@features/booking/steps/StepTimezone'
import { StepSessionType } from '@features/booking/steps/StepSessionType'
import { StepDate }        from '@features/booking/steps/StepDate'
import { StepTimeSlot }    from '@features/booking/steps/StepTimeSlot'
import { StepReview }      from '@features/booking/steps/StepReview'
import { StepConfirm }     from '@features/booking/steps/StepConfirm'
import { StepSessionExp }  from '@features/booking/steps/StepSessionExp'

interface BookingModalProps { isOpen: boolean; onClose: () => void }

const INITIAL_DATA: BookingData = {
  timezone: '', sessionType: '', service: '', date: '', timeSlot: '',
  name: '', email: '', phone: '', message: '',
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData]               = useState<BookingData>(INITIAL_DATA)
  const [direction, setDirection]     = useState<'forward' | 'back'>('forward')
  const [isAnimating, setIsAnimating] = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const panelRef     = useRef<HTMLDivElement>(null)
  const firstFocusRef = useRef<HTMLButtonElement>(null)
  const totalSteps = BOOKING_STEPS.length

  // ── Scroll lock with layout-shift prevention ──────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
      document.body.classList.add('booking-modal-open')
    } else {
      document.body.classList.remove('booking-modal-open')
      document.documentElement.style.removeProperty('--scrollbar-width')
    }
    return () => {
      document.body.classList.remove('booking-modal-open')
      document.documentElement.style.removeProperty('--scrollbar-width')
    }
  }, [isOpen])

  const submittedRef = useRef(false)
  const syncSubmitted = (val: boolean) => {
    submittedRef.current = val
    setSubmitted(val)
  }

  useEffect(() => {
    const fn = () => {
      if (document.visibilityState === 'visible' && submittedRef.current)
        setSubmitted(true)
    }
    document.addEventListener('visibilitychange', fn)
    return () => document.removeEventListener('visibilitychange', fn)
  }, [])

  // 1. Add a ref for the scrollable body — alongside your existing refs
  const panelBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
  if (panelBodyRef.current) {
    panelBodyRef.current.scrollTop = 0
  }
}, [currentStep])
  // ── Focus trap + Escape key ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const panel = panelRef.current
    if (!panel) return
    setTimeout(() => firstFocusRef.current?.focus(), 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus() } }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const goNext = useCallback((stepData: Partial<BookingData>) => {
    if (isAnimating) return
    setData(prev => ({ ...prev, ...stepData }))
    setDirection('forward')
    setIsAnimating(true)
    setTimeout(() => { setCurrentStep(s => s + 1); setIsAnimating(false) }, 320)
  }, [isAnimating])

  const goBack = useCallback(() => {
    if (isAnimating || currentStep === 0) return
    setDirection('back')
    setIsAnimating(true)
    setTimeout(() => { setCurrentStep(s => s - 1); setIsAnimating(false) }, 320)
  }, [isAnimating, currentStep])

  const handleClose = () => {
    onClose()
    setTimeout(() => { setCurrentStep(0); setData(INITIAL_DATA); syncSubmitted(false) }, 400)
  }

  const handleSubmit = (finalData: Partial<BookingData>, via: 'whatsapp' | 'email') => {
    const merged = { ...data, ...finalData }
    if (via === 'whatsapp') {
      const msg = encodeURIComponent(
        `🧘 *Demo Booking Request*\n\n*Name:* ${merged.name}\n*Session:* ${merged.sessionType}\n*Date:* ${merged.date}\n*Time:* ${merged.timeSlot}\n*Timezone:* ${merged.timezone}\n*Message:* ${merged.message || 'None'}`
      )
      window.open(`https://wa.me/?text=${msg}`, '_blank')
    } 
    syncSubmitted(true)
    setCurrentStep(totalSteps)
  }

  if (!isOpen) return null

  const step      = BOOKING_STEPS[currentStep]
  const animClass = isAnimating
    ? (direction === 'forward' ? styles.stepExiting : styles.stepExitingBack)
    : styles.stepEnter

  return (
        <div
      className={styles.overlay}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Book a Demo Session"
    >
      <div className={styles.panel} ref={panelRef}>

        {/* ── ZONE 1: Header + Progress — never scrolls ── */}
        <div className={styles.panelHeader}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              {currentStep > 0 && !submitted && (
                <button className={styles.backBtn} onClick={goBack} aria-label="Previous step">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                </button>
              )}
            </div>
            <div className={styles.headerTitle}>
              <span className={styles.leafIcon}>🪷</span>
              <span>{submitted ? 'Booking Sent!' : 'Book a Demo'}</span>
            </div>
            <button className={styles.closeBtnPanel} onClick={handleClose} ref={firstFocusRef} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {!submitted && (
            <div className={styles.progress} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={totalSteps}>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }} />
              </div>
              <div className={styles.stepDots}>
                {BOOKING_STEPS.map((s, i) => (
                  <div key={s.id} className={`${styles.stepDot} ${i < currentStep ? styles.dotCompleted : ''} ${i === currentStep ? styles.dotActive : ''}`} aria-label={`Step ${i+1}: ${s.label}`}>
                    {i < currentStep
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : <span>{i + 1}</span>}
                  </div>
                ))}
              </div>
              {step && (
                <p className={styles.stepLabel}>
                  {step.label}
                  <span className={styles.stepCount}> · {currentStep + 1} of {totalSteps}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── ZONE 2: Scrollable body ── */}
          <div className={`${styles.panelBody} ${animClass}`} ref={panelBodyRef}>
            {submitted          ? <StepConfirm    data={data} onClose={handleClose} />
            : currentStep === 0 ? <StepTimezone    data={data} onNext={goNext} />
            : currentStep === 1 ? <StepSessionExp  data={data} onNext={goNext} />
            : currentStep === 2 ? <StepSessionType data={data} onNext={goNext} />
            : currentStep === 3 ? <StepDate        data={data} onNext={goNext} />
            : currentStep === 4 ? <StepTimeSlot    data={data} onNext={goNext} />
            :                     <StepReview      data={data} onSubmit={handleSubmit} onEdit={(stepIndex) => {
                                    setDirection('back')
                                    setIsAnimating(true)
                                    setTimeout(() => { setCurrentStep(stepIndex); setIsAnimating(false) }, 320)
                                  }} />}
          </div>
      </div>
    </div>
  )
}