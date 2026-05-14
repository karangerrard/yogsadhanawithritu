import { useState, useEffect } from 'react'
import { useMediaQuery } from '@hooks/useMediaQuery'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Home',      href: 'home' },
  { label: 'About Me',  href: 'about' },
  { label: 'Offerings', href: 'services' },
  { label: 'Reviews',   href: 'testimonials' },
  { label: 'Contact',   href: 'contact' },
]

export function Navbar(): JSX.Element {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  // ✅ Updated: smooth scroll without adding #hash to URL
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
    e.preventDefault()
    setMenuOpen(false)
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a
          href="#home"
          className={styles.logo}
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <svg className={styles.logoIcon} viewBox="0 0 40 40" fill="none">
            <path d="M20 8 C14 8 8 14 8 20 C8 26 14 30 20 30 C26 30 32 26 32 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 8 C20 14 24 18 30 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 34 C15 34 17 30 20 30 C23 30 25 34 25 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className={styles.logoText}>Yogsadhana with Ritu</span>
        </a>

        {/* Desktop nav */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={`#${link.href}`}
              className={styles.navLink}
              onClick={(e) => handleNavClick(e, link.href)}  // ✅ passes section id
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          className={styles.ctaBtn}
          onClick={() => {
            setMenuOpen(false)
            window.dispatchEvent(new CustomEvent('open-booking-modal'))
          }}
        >
          Book Demo
        </button>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className={styles.mobileMenu} aria-label="Mobile navigation">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={`#${link.href}`}
              className={styles.mobileNavLink}
              onClick={(e) => handleNavClick(e, link.href)}  // ✅ same fix
            >
              {link.label}
            </a>
          ))}
          <button
            className={styles.mobileCta}
            onClick={() => {
              setMenuOpen(false)
              window.dispatchEvent(new CustomEvent('open-booking-modal'))
            }}
          >
            Book Demo
          </button>
        </nav>
      )}
    </header>
  )
}