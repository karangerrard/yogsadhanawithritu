import { useState } from 'react'
import { contactConfig } from './contact.config'
import { useScrollReveal } from '@hooks/useScrollReveal'
import type { ContactFormData, FormStatus } from '@/types/index'
import styles from './ContactSection.module.css'
import emailjs from '@emailjs/browser'

const initialForm: ContactFormData = { name: '', email: '', phone: '', message: '' }

export function ContactSection(): JSX.Element {
  const [form, setForm] = useState<ContactFormData>(initialForm)
  const [status, setStatus] = useState<FormStatus>('idle')
  const headerRef = useScrollReveal<HTMLDivElement>()

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value,
    }))

    /**
     * Remove error instantly when user starts typing
     */
    if (value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  const handleWhatsApp = () => {
    const phoneNumber = '919041918567' // Replace with your WhatsApp number in international format
    if (!validateForm({ requireEmail: false })) return

    const message = `Hi, I'm ${form.name}.
    ${form.email ? `Email: ${form.email}` : ''}
    ${form.phone ? `Phone: ${form.phone}` : ''}

    ${form.message}`

      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    if (!validateForm({ requireEmail: true })) return

    setStatus('loading')

    // TODO: Wire up EmailJS or your preferred email service
     
    await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID,
                       import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                       form as unknown as Record<string, unknown>,
                       import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

    // Simulated delay for now
    await new Promise(r => setTimeout(r, 1200))
    setStatus('success')
    setForm(initialForm)
  }

  const validateForm = ({ requireEmail = false }: { requireEmail?: boolean }) => {
  const newErrors: { name?: string; email?: string; message?: string } = {}

  if (!form.name.trim()) {
    newErrors.name = 'We\'d love to know your name'
  }

  if (requireEmail) {
    if (!form.email.trim()) {
      newErrors.email = 'Please provide your email address before sending email'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = 'Please enter a valid email address'
    }
  }

  if (!form.message.trim()) {
    newErrors.message = 'We\'d love to hear from you'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
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
              <label htmlFor="name" className={styles.label}>Full Name*</label>
              <input
                id="name" name="name" type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                required
              />
              {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address*</label>
              <input
                id="email" name="email" type="email"
                placeholder="Required only for email inquiries"
                value={form.email}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.email ? styles.inputError : ''}`}
                required
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>Phone (Optional)</label>
              <input
                id="phone" name="phone" type="tel"
                placeholder="Your phone number"
                value={form.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message*</label>
              <textarea
                id="message" name="message"
                placeholder="How can we help you?"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                required
              />
              {errors.message && <p className={styles.errorText}>{errors.message}</p>}
            </div>
            
            <div className={styles.btnGroup}>
              <button
                onClick={handleSubmit}
                className={styles.submitBtn}
                disabled={status === 'loading'}
                type="button"
              >
                {status === 'loading' ? 'Sending…' : 'Send Email'}
              </button>
              <button
                onClick={handleWhatsApp}
                className={styles.whatsappBtn}
                type="button"
              >
                WhatsApp Message
              </button>   

              {status === 'success' && (
                <p className={styles.successMsg}>
                  ✅ Message sent! We'll get back to you within 24 hours.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
