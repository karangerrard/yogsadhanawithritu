import { heroConfig } from './hero.config'
import { useScrollReveal } from '@hooks/useScrollReveal'
import styles from './HeroSection.module.css'

export function HeroSection(): JSX.Element {
  const contentRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className={styles.hero} id="home">
      <div className={`container ${styles.heroInner}`}>

        {/* ── Left: Copy ─────────────────────────────────────────────────── */}
        <div className={styles.content} ref={contentRef}>
          <h1 className={styles.heading}>
            <span className={styles.headingLine1}>{heroConfig.headingLine1}</span>
            <span className={styles.headingLine2}>{heroConfig.headingLine2}</span>
          </h1>

          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerLine} />
            <svg className={styles.dividerLeaf} viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1s-4 3-4 7c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-4-7-4-7z" />
            </svg>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.subheading}>{heroConfig.subheading}</p>

          {/* ── Service offerings — 2-col icon + label list ────────────── */}
          <ul className={styles.serviceList} aria-label="Services offered">
            {heroConfig.services.map((s, i) => (
              <li key={i} className={styles.serviceItem}>
                <span className={styles.serviceIcon} aria-hidden="true">{s.icon}</span>
                <span className={styles.serviceLabel}>{s.label}</span>
              </li>
            ))}
          </ul>

          {/* ── Session type badges ────────────────────────────────────── */}
          <div className={styles.sessionBadges} aria-label="Session formats available">
            {heroConfig.sessionTypes.map((s, i) => (
              <span key={i} className={styles.sessionBadge}>{s.label}</span>
            ))}
          </div>

          <div className={styles.ctas}>
            <a href={heroConfig.primaryCta.href} className={styles.ctaPrimary}>
              {heroConfig.primaryCta.label}
            </a>
            <a href={heroConfig.secondaryCta.href} className={styles.ctaSecondary}>
              {heroConfig.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* ── Right: Image ────────────────────────────────────────────────── */}
        <div className={styles.imageWrapper}>

          {/*
           * 🖼️ TO SWAP THE IMAGE:
           *    Open src/features/hero/hero.config.ts
           *    Change `desktopImage` and `mobileImage` to your new image path or URL.
           *    No changes needed in this file.
           */}
          <picture>
            {/* Mobile image (shown on screens < 768px) */}
            <source
              media="(max-width: 767px)"
              srcSet={heroConfig.mobileImage}
            />
            {/* Desktop image (default) */}
            <img
              src={heroConfig.desktopImage}
              alt={heroConfig.imageAlt}
              className={styles.heroPose}
              loading="eager"
              decoding="async"
            />
          </picture>

        </div>
      </div>
    </section>
  )
}
