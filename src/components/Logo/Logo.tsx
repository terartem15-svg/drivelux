import { LogoMark } from './LogoMark'
import styles from './Logo.module.css'

// Логотип целиком: золотая монограмма и словесный знак с подписью
// «Premium car rental» под ним, как в референсе. Название бренда не
// переводится — translate="no" на обёртке
export function Logo() {
  return (
    <span className={styles.logo} translate="no">
      <LogoMark className={styles.mark} />
      <span className={styles.wordmark}>
        <span className={styles.name}>DriveLux</span>
        <span className={`${styles.tagline} logo-tagline`}>Premium car rental</span>
      </span>
    </span>
  )
}
