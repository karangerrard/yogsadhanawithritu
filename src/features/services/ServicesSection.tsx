import { servicesConfig } from './services.config'
import { useScrollReveal } from '@hooks/useScrollReveal'
import styles from './ServicesSection.module.css'

export function ServicesSection(): JSX.Element {
  const headingRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className={`section ${styles.services}`} id="services">
      <div className="container">
        <div className={styles.sectionHeader} ref={headingRef}>
          <span className={styles.sectionLabel}>{servicesConfig.sectionLabel}</span>
          <h2 className={styles.heading}>{servicesConfig.heading}</h2>
          <p className={styles.subheading}>{servicesConfig.subheading}</p>
        </div>

        <div className={styles.grid}>
          {servicesConfig.services.map(service => (
            <div key={service.id} className={styles.card}>
              <div className={styles.cardIcon}>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
