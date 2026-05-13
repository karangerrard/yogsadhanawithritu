import React, { useState } from 'react'
import type { BookingData } from '@features/booking/booking.config'
import styles from '@features/booking/BookingModal.module.css'
import rvStyles from '@features/booking/BookingModal.module.css'
import emailjs from '@emailjs/browser'

interface Props {
  data: BookingData
  onSubmit: (d: Partial<BookingData>, via: 'whatsapp' | 'email') => void
  onEdit?: (stepIndex: number) => void
}

// ── Email validation ────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function isValidEmail(v: string) { return EMAIL_RE.test(v.trim()) }

// ── WhatsApp number — update to your business number ───────────────────────
const WA_NUMBER = '919041918567' // e.g. 91XXXXXXXXXX (no + or spaces)

// ── Summary row definition ──────────────────────────────────────────────────
interface SummaryRow {
  icon: React.ReactNode
  label: string
  value: string
  editStep: number        // 0-based index of the step to jump back to
  editLabel: string
}

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}
function IconYoga() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
      <path d="M6.5 9.5C5 11 4 13 4 15h4l1 5h6l1-5h4c0-2-1-4-2.5-5.5"/>
      <path d="M8.5 10.5L12 9l3.5 1.5"/>
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function IconEdit() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IconExperience() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
      <path d="M19 3v4M21 5h-4"/>
      <path d="M5 17v2M6 18H4"/>
    </svg>
  )
}

export function StepReview({ data, onSubmit, onEdit }: Props) {
  const [name,    setName]    = useState(data.name    || '')
  const [email,   setEmail]   = useState(data.email   || '')
  const [phone,   setPhone]   = useState(data.phone   || '')
  const [message, setMessage] = useState(data.message || '')

  const [emailError,  setEmailError]  = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [submitVia,   setSubmitVia]   = useState<'whatsapp'|'email'|null>(null)

  // ── Validation ────────────────────────────────────────────────────────────
  const nameOk  = name.trim().length > 0
  const phoneOk = phone.trim().length > 0
  const emailOk = email.trim() === '' || isValidEmail(email)

  // For WhatsApp: name + phone required
  const canWhatsApp = nameOk && phoneOk
  // For Email: name + valid email required
  const canEmail    = nameOk && isValidEmail(email)

  const SESSION_LABELS: Record<string, string> = {
  'private-online':     'Online 1-on-1 Session',
  'shared-circle':      'Online Group Class',
  'private-inperson':   'Private Session',
  'group-wellness':     'Offline Group Class',
  }

  const SERVICE_LABELS: Record<string, string> = {
  'yoga':            'Yoga & Asana',
  'pranayama':       'Pranayama & Meditation',
  'ayurveda':        'Ayurveda & Naturopathy',
  'sound':           'Sound Healing Therapy',
  // add whatever IDs your StepSessionExp stores
  }

  const handleEmailChange = (v: string) => {
    setEmail(v)
    if (emailError && isValidEmail(v)) setEmailError('')
  }

  // ── Submission ────────────────────────────────────────────────────────────
  const handleSubmit = async (via: 'whatsapp' | 'email') => {
  if (via === 'email' && !isValidEmail(email)) {
    setEmailError('Please enter a valid email address.')
    return
  }
  setSubmitting(true)
  setSubmitVia(via)

  const merged: Partial<BookingData> = { name, email, phone, message }

  if (via === 'whatsapp') {
    const waMsg = encodeURIComponent(
      `Demo Session with Ritu\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `${email ? `Email: ${email}\n` : ''}` +
      `\nSession: ${SESSION_LABELS[data.sessionType] || '—'}\n` +
      `Service: ${SERVICE_LABELS[data.service] || '—'}\n` +
      `Date: ${data.date || '—'}\n` +
      `Time: ${data.timeSlot || '—'}\n` +
      `Timezone: ${data.timezone || '—'}\n` +
      `${message ? `\nMessage: ${message}` : ''}`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`, '_blank', 'noopener,noreferrer')

    setTimeout(() => {
      onSubmit(merged, via)
      setSubmitting(false)
      setSubmitVia(null)
    }, 900)

  } else {
    // ── EmailJS ──────────────────────────────────────────
    const templateParams = {
      from_name:        name,
      from_email:       email,
      from_phone:       phone || 'N/A',
      session_type:     SESSION_LABELS[data.sessionType] || data.sessionType || '—',
      service_type:     SERVICE_LABELS[data.service]     || data.service     || '—',
      booking_date:     data.date      || '—',
      booking_time:     data.timeSlot  || '—',
      booking_timezone: data.timezone  || '—',
      message:          message        || 'No additional message',
      reply_to:         email,
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,   // EmailJS → Email Services → Service ID
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_DEMO,  // EmailJS → Email Templates → Template ID
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY    // EmailJS → Account → Public Key
      )
      onSubmit(merged, via)
    } catch (err) {
      console.error('EmailJS error:', err)
      // Fallback to mailto if EmailJS fails
      const subject = encodeURIComponent(`Wellness Demo Booking – ${name}`)
      const body    = encodeURIComponent(
        `Wellness Demo Booking Request\n` +
        `${'─'.repeat(34)}\n\n` +
        `Name:     ${name}\n` +
        `Email:    ${email}\n` +
        `Phone:    ${phone || 'N/A'}\n\n` +
        `Session:  ${SESSION_LABELS[data.sessionType] || '—'}\n` +
        `Service:  ${SERVICE_LABELS[data.service] || '—'}\n` +
        `Date:     ${data.date || '—'}\n` +
        `Time:     ${data.timeSlot || '—'}\n` +
        `Timezone: ${data.timezone || '—'}\n` +
        `${message ? `\nMessage:\n${message}` : ''}`
      )
      window.open(`mailto:?subject=${subject}&body=${body}`, '_self')
      onSubmit(merged, via)
    } finally {
      setSubmitting(false)
      setSubmitVia(null)
    }
  }
}

  // ── Summary rows ─────────────────────────────────────────────────────────
  const summaryRows: SummaryRow[] = [
    { icon: <IconGlobe />,    label: 'Timezone', value: data.timezone    || '—', editStep: 0, editLabel: 'Change' },
    { icon: <IconYoga />,     label: 'Session Type', value: SESSION_LABELS[data.sessionType] || '—', editStep: 1, editLabel: 'Change' },
    { icon: <IconExperience />, label: 'Experience',value: SERVICE_LABELS[data.service]     || '—', editStep: 2, editLabel: 'Change' },
    { icon: <IconCalendar />, label: 'Date',     value: data.date        || '—', editStep: 3, editLabel: 'Change' },
    { icon: <IconClock />,    label: 'Time',     value: data.timeSlot    || '—', editStep: 4, editLabel: 'Change' },
  ]

  return (
    <div className={styles.stepContent}>

      {/* Calming headline */}
      <div className={`${styles.stepIntro} ${rvStyles.introBlock}`}>
        <h2 className={styles.stepTitle}>Review & Confirm</h2>
        <p className={`${styles.stepDesc} ${rvStyles.calmingMsg}`}>
          <span className={rvStyles.calmingLeaf} aria-hidden="true">🪷</span>
          You're one step away from your guided wellness experience.
        </p>
      </div>

      {/* Booking summary card */}
      <div className={rvStyles.summaryCard} aria-label="Booking summary">
        <p className={rvStyles.summaryHeading}>Your Booking</p>
        <div className={rvStyles.summaryRows}>
          {summaryRows.map(row => (
            <div key={row.label} className={rvStyles.summaryRow}>
              <span className={rvStyles.summaryRowIcon} aria-hidden="true">{row.icon}</span>
              <span className={rvStyles.summaryRowLabel}>{row.label}</span>
              <span className={rvStyles.summaryRowValue}>{row.value}</span>
              {onEdit && (
                <button
                  type="button"
                  className={rvStyles.editBtn}
                  onClick={() => onEdit(row.editStep)}
                  aria-label={`${row.editLabel} ${row.label}`}
                >
                  <IconEdit />
                  {row.editLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact details form */}
      <div className={rvStyles.contactForm}>
        <p className={rvStyles.formHeading}>Your Details</p>

        {/* Name */}
        <div className={rvStyles.formField}>
          <label className={rvStyles.fieldLabel} htmlFor="rv-name">
            Full Name <span className={rvStyles.required} aria-label="required">*</span>
          </label>
          <input
            id="rv-name"
            type="text"
            className={`${rvStyles.fieldInput} ${!nameOk && name.length > 0 ? rvStyles.fieldError : ''}`}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
          />
        </div>

        {/* Email + Phone row */}
        <div className={rvStyles.formRow}>
          <div className={rvStyles.formField}>
            <label className={rvStyles.fieldLabel} htmlFor="rv-email">
              Email
              {submitVia === 'email' || (email.length > 0) ? (
                <span className={rvStyles.requiredHint}> (required for email)</span>
              ) : null}
            </label>
            <input
              id="rv-email"
              type="email"
              className={`${rvStyles.fieldInput} ${emailError ? rvStyles.fieldError : ''} ${email.length > 0 && !emailOk ? rvStyles.fieldWarn : ''} ${email.length > 0 && emailOk ? rvStyles.fieldOk : ''}`}
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
            />
            {emailError && (
              <p className={rvStyles.errorMsg} role="alert">{emailError}</p>
            )}
          </div>

          <div className={rvStyles.formField}>
            <label className={rvStyles.fieldLabel} htmlFor="rv-phone">
              WhatsApp / Phone
              <span className={rvStyles.requiredHint}> (required for WA)</span>
            </label>
            <input
              id="rv-phone"
              type="tel"
              className={`${rvStyles.fieldInput} ${phoneOk ? rvStyles.fieldOk : ''}`}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Message */}
        <div className={rvStyles.formField}>
          <label className={rvStyles.fieldLabel} htmlFor="rv-message">
            Message <span className={rvStyles.optionalTag}>optional</span>
          </label>
          <textarea
            id="rv-message"
            className={rvStyles.fieldTextarea}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Any special requests, health considerations, or questions…"
            rows={3}
          />
        </div>
      </div>

      {/* CTA section — sticky on mobile */}
      <div className={rvStyles.ctaSection}>
        <p className={rvStyles.ctaHint}>Choose how you'd like to send your booking request:</p>

        <div className={rvStyles.ctaButtons}>
          {/* WhatsApp */}
          <button
            type="button"
            className={`${rvStyles.ctaBtn} ${rvStyles.waBtn} ${!canWhatsApp ? rvStyles.ctaBtnDisabled : ''} ${submitting && submitVia === 'whatsapp' ? rvStyles.ctaBtnLoading : ''}`}
            onClick={() => canWhatsApp && !submitting && handleSubmit('whatsapp')}
            disabled={!canWhatsApp || submitting}
            aria-label="Send booking via WhatsApp"
            aria-busy={submitting && submitVia === 'whatsapp'}
          >
            {submitting && submitVia === 'whatsapp' ? (
              <span className={rvStyles.loadingSpinner} aria-hidden="true" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            )}
            <span className={rvStyles.ctaBtnText}>
              {submitting && submitVia === 'whatsapp' ? 'Opening WhatsApp…' : 'Continue via WhatsApp'}
            </span>
            {!canWhatsApp && !submitting && (
              <span className={rvStyles.ctaBtnHint}>Add phone number</span>
            )}
          </button>

          <div className={rvStyles.ctaDivider}>
            <span className={rvStyles.ctaDividerLine} aria-hidden="true" />
            <span className={rvStyles.ctaDividerText}>or</span>
            <span className={rvStyles.ctaDividerLine} aria-hidden="true" />
          </div>

          {/* Email */}
          <button
            type="button"
            className={`${rvStyles.ctaBtn} ${rvStyles.emailBtn} ${!canEmail ? rvStyles.ctaBtnDisabled : ''} ${submitting && submitVia === 'email' ? rvStyles.ctaBtnLoading : ''}`}
            onClick={() => !submitting && handleSubmit('email')}
            disabled={submitting}
            aria-label="Send booking via Email"
            aria-busy={submitting && submitVia === 'email'}
          >
            {submitting && submitVia === 'email' ? (
              <span className={rvStyles.loadingSpinner} aria-hidden="true" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            )}
            <span className={rvStyles.ctaBtnText}>
              {submitting && submitVia === 'email' ? 'Opening Email…' : 'Continue via Email'}
            </span>
            {!canEmail && !submitting && (
              <span className={rvStyles.ctaBtnHint}>Add valid email</span>
            )}
          </button>
        </div>

        <p className={rvStyles.privacyNote}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Your details are only used to confirm your session.
        </p>
      </div>
    </div>
  )
}
