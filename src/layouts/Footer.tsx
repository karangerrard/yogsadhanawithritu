import styles from './Footer.module.css'

export function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Yogsadhana with Ritu. All rights reserved.
        </p>
        <div className={styles.links}>
          <a href="#home">Privacy Policy</a>
          <a href="#home">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
