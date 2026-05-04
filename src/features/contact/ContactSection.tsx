import { useState } from 'react'
import { contactConfig } from './contact.config'
import { useScrollReveal } from '@hooks/useScrollReveal'
import type { ContactFormData, FormStatus } from '@/types/index'
import styles from './ContactSection.module.css'

const initialForm: ContactFormData = { name: '', email: '', phone: '', message: '' }

export function ContactSection(): JSX.Element {
  const [form, setForm] = useState<ContactFormData>(initialForm)
  const [status, setStatus] = useState<FormStatus>('idle')
  const headerRef = useScrollReveal<HTMLDivElement>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setStatus('loading')

    // TODO: Wire up EmailJS or your preferred email service
    // import emailjs from '@emailjs/browser'
    // await emailjs.send(VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, form, VITE_EMAILJS_PUBLIC_KEY)

    // Simulated delay for now
    await new Promise(r => setTimeout(r, 1200))
    setStatus('success')
    setForm(initialForm)
  }

  return (
    <section className={`section ${styles.contact}`} id="contact">
      <div className="container">
        <div className={styles.inner}>

          {/* Left: Info */}
          <div className={styles.info} ref={headerRef}>
            <span className={styles.sectionLabel}>{contactConfig.sectionLabel}</span>
            <h2 className={styles.heading}>{contactConfig.heading}</h2>
            <p className={styles.subheading}>{contactConfig.subheading}</p>

            <ul className={styles.details}>
              <li>
                <span className={styles.detailIcon}>✉️</span>
                <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
              </li>
              <li>
                <span className={styles.detailIcon}>📞</span>
                <a href={`tel:${contactConfig.phone}`}>{contactConfig.phone}</a>
              </li>
              <li>
                <span className={styles.detailIcon}>📍</span>
                <span>{contactConfig.location}</span>
              </li>
            </ul>

            <div className={styles.socials}>
              {contactConfig.socials.map(s => (
                <a key={s.label} href={s.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className={styles.formWrapper}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input
                id="name" name="name" type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>Phone (optional)</label>
              <input
                id="phone" name="phone" type="tel"
                placeholder="+91 ..."
                value={form.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea
                id="message" name="message"
                placeholder="How can we help you?"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className={styles.textarea}
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              className={styles.submitBtn}
              disabled={status === 'loading'}
              type="button"
            >
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className={styles.successMsg}>
                ✅ Message sent! We'll get back to you within 24 hours.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
