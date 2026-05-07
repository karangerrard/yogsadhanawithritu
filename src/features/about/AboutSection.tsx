import { useEffect, useRef, useState } from 'react'
import { aboutConfig } from './about.config'
import styles from './AboutSection.module.css'

// ── Scroll-driven rotation hook ───────────────────────────────────────────────
/**
 * useScrollRotation
 *
 * Returns a progress value 0 → 1 based on scroll position relative to the section.
 *
 * DESKTOP behaviour:
 *   - Animation starts when the section top enters the viewport
 *   - Animation completes when the section fills the full viewport height
 *   - Trigger window = 1 × viewport height
 *
 * MOBILE behaviour:
 *   - Animation starts when hero bottom / section top enters viewport
 *   - Animation completes by the time the section heading is visible
 *   - Trigger window = 0.5 × viewport height (faster, tighter trigger)
 *
 * Scroll reversal is fully natural — progress is derived purely from
 * current scroll position, so stopping or reversing scroll mid-way
 * stops or reverses the rotation instantly with zero lag.
 */
function useScrollRotation(ref: React.RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const calculate = (): void => {
      const rect = el.getBoundingClientRect()

      const vh = window.innerHeight
      const isMobile = window.innerWidth <= 640

      /**
       * START POINT
       * Begin rotation as soon as the image/section tip enters viewport.
       */
      const start = vh

      /**
       * END POINT
       * Desktop:
       * complete when section fully fills viewport
       *
       * Mobile:
       * complete earlier for faster interaction
       */
      const end = isMobile ? vh * 0.5 : 0

      /**
       * Progress mapping
       */
      const raw = (start - rect.top) / (start - end)

      const clamped = Math.min(1, Math.max(0, raw))

      setProgress(clamped)
    }

    calculate()
    window.addEventListener('scroll', calculate, { passive: true })
    window.addEventListener('resize', calculate, { passive: true })
    return () => {
      window.removeEventListener('scroll', calculate)
      window.removeEventListener('resize', calculate)
    }
  }, [ref])

  return progress
}

// ── Credential row ────────────────────────────────────────────────────────────
function CredRow({
  institution,
  qualification,
  detail,
  period,
}: {
  institution: string
  qualification: string
  detail?: string
  period?: string
}): JSX.Element {
  return (
    <div className={styles.credRow}>
      <div className={styles.credDot} aria-hidden="true" />
      <div className={styles.credBody}>
        <p className={styles.credQual}>
          {qualification}
          {detail && <span className={styles.credDetail}> — {detail}</span>}
        </p>
        <p className={styles.credInstitution}>{institution}</p>
        {period && <p className={styles.credPeriod}>{period}</p>}
      </div>
    </div>
  )
}

// ── Placeholder when no image is set ──────────────────────────────────────────
function ImagePlaceholder(): JSX.Element {
  return (
    <div className={styles.imagePlaceholder}>
      <svg viewBox="0 0 120 160" fill="none" className={styles.placeholderSvg}>
        <circle cx="60" cy="52" r="28" stroke="#84A98C" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M20 140 C20 100 100 100 100 140" stroke="#84A98C" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
        <circle cx="60" cy="52" r="10" fill="#CAD2C5" opacity=".5" />
      </svg>
      <p className={styles.placeholderText}>
        Add your transparent PNG in<br />
        <code>about.config.ts → guideImage</code>
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function AboutSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useScrollRotation(sectionRef as React.RefObject<HTMLElement>)

  /**
   * Z-axis rotation — counterclockwise from the viewer's perspective.
   *
   * Starts at rotateZ(-180deg): image is upside-down / spun fully around
   * Ends at   rotateZ(0deg):    image is in its natural upright position
   *
   * This is a flat, in-plane spin that the viewer sees head-on —
   * counterclockwise as they scroll down, clockwise back as they scroll up.
   */
  const rotateZ = -180 + progress * 180

  const { education, certifications, experience, bio, sectionTitle, guideImage, guideImageAlt } =
    aboutConfig

  return (
    <section
      className={styles.about}
      id="about"
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className={`container ${styles.inner}`}>

        {/* ── Left: image — no background, pure PNG floats freely ─────────── */}
        <div className={styles.imageColumn}>
          {/*
           * Perspective wrapper — provides 3D depth context ONLY.
           * No background-color, no border-radius, no fill.
           * The PNG image floats transparently inside.
           */}
          <div className={styles.perspectiveWrap}>
            <div
              className={styles.imageRotor}
              style={{
                transform: `rotateZ(${rotateZ}deg)`,
              }}
            >
              {guideImage ? (
                <img
                  src={guideImage}
                  alt={guideImageAlt}
                  className={styles.guideImage}
                  draggable={false}
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
          </div>
        </div>

        {/* ── Right: credentials ──────────────────────────────────────────── */}
        <div className={styles.contentColumn}>

          <div className={styles.titleBlock}>
            <span className={styles.sectionLabel}>My Journey</span>
            <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
            <p className={styles.bio}>{bio}</p>
          </div>

          {/* Education */}
          <div className={styles.credBlock}>
            <div className={styles.credBlockHeader}>
              <span className={styles.credIcon} aria-hidden="true">🎓</span>
              <h3 className={styles.credBlockTitle}>Education</h3>
            </div>
            <div className={styles.credList}>
              {education.map((e, i) => (
                <CredRow key={i} {...e} />
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className={styles.credBlock}>
            <div className={styles.credBlockHeader}>
              <span className={styles.credIcon} aria-hidden="true">📜</span>
              <h3 className={styles.credBlockTitle}>Certifications</h3>
            </div>
            <div className={styles.credList}>
              {certifications.map((c, i) => (
                <CredRow key={i} {...c} />
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className={styles.credBlock}>
            <div className={styles.credBlockHeader}>
              <span className={styles.credIcon} aria-hidden="true">🌿</span>
              <h3 className={styles.credBlockTitle}>Experience</h3>
            </div>
            <div className={styles.credList}>
              {experience.map((e, i) => (
                <CredRow
                  key={i}
                  institution={e.institution}
                  qualification={e.role}
                  period={e.period}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
