import { IconKey, servicesConfig } from './services.config'
import { useScrollReveal } from '@hooks/useScrollReveal'
import styles from './ServicesSection.module.css'
import ayurvedaIcon from '@/assets/icons/ayurveda_icon.png'
import hathaIcon from '@/assets/icons/hatha_icon.png'
import pranayamaIcon from '@/assets/icons/pranayama_icon.png'
import soundIcon from '@/assets/icons/sound_icon.png'

export function ServicesSection(): JSX.Element {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const iconMap: Record<IconKey, React.ReactNode> = {
  hatha: <img src={hathaIcon} alt="Hatha Yoga" />,
  pranayama: <img src={pranayamaIcon} alt="Pranayama" />,
  ayurveda: <img src={ayurvedaIcon} alt="Ayurveda" />,
  sound: <img src={soundIcon} alt="Sound Healing" />,
}

  return (
    <section className={`section ${styles.services}`} id="services">
      <div className="container">
        <div className={styles.sectionHeader} ref={headingRef}>
          <h2 className={styles.heading}>{servicesConfig.sectionLabel}</h2>
          <h2 className={styles.sectionLabel}>{servicesConfig.heading}</h2>
          <p className={styles.subheading}>{servicesConfig.subheading}</p>
        </div>

        <div className={styles.grid}>
          {servicesConfig.services.map(service => (
            <div key={service.id} className={styles.card}>
              <div className={styles.cardIcon}>{iconMap[service.icon as IconKey]}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
