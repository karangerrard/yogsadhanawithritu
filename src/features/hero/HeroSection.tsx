import { heroConfig } from './hero.config'
import { useScrollReveal } from '@hooks/useScrollReveal'
import styles from './HeroSection.module.css'

// Inline SVG icons (leaf, lotus, heart) — no icon library needed
const icons: Record<string, JSX.Element> = {
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  lotus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-4 8-8 8-13a8 8 0 0 0-16 0c0 5 4 9 8 13Z" />
      <path d="M12 22c-4-4-8-8-8-13" />
      <path d="M12 22c0-6 0-10 0-13" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
}

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

          <div className={styles.ctas}>
            <a href={heroConfig.primaryCta.href} className={styles.ctaPrimary}>
              {heroConfig.primaryCta.label}
            </a>
            <a href={heroConfig.secondaryCta.href} className={styles.ctaSecondary}>
              <span className={styles.playIcon} aria-hidden="true">▶</span>
              {heroConfig.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* ── Right: Image ────────────────────────────────────────────────── */}
        <div className={styles.imageWrapper}>
          <div className={styles.blobBg} aria-hidden="true" />

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

          {/* Decorative dots & plus signs */}
          <span className={`${styles.deco} ${styles.decoPlus1}`} aria-hidden="true">+</span>
          <span className={`${styles.deco} ${styles.decoPlus2}`} aria-hidden="true">+</span>
          <span className={`${styles.deco} ${styles.decoCircle1}`} aria-hidden="true" />
          <span className={`${styles.deco} ${styles.decoCircle2}`} aria-hidden="true" />
          <span className={`${styles.deco} ${styles.decoDot}`} aria-hidden="true" />
        </div>
      </div>

      {/* ── Wave divider to stats strip ─────────────────────────────────── */}
      <div className={styles.waveWrapper} aria-hidden="true">
        <svg className={styles.wave} viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--color-cream-warm)" />
        </svg>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────────────── */}
      <div className={styles.statsStrip}>
        <div className="container">
          <div className={styles.statsGrid}>
            {heroConfig.stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statIcon}>
                  {icons[stat.icon]}
                </div>
                {i < heroConfig.stats.length - 1 && (
                  <span className={styles.statDivider} aria-hidden="true" />
                )}
                <p className={styles.statTitle}>{stat.title}</p>
                <p className={styles.statDesc}>{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
