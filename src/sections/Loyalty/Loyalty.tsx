import { Button } from '@/components/Button/Button'
import { LOYALTY, LOYALTY_IMAGE, TIERS } from '@/content/loyalty'
import { useLang } from '@/i18n/lang'
import { PERK_ICONS } from './perkIcons'
import styles from './Loyalty.module.css'

// Баннер программы лояльности по референсу: слева заголовок, текст и
// кнопка, по центру — фото салона, справа — четыре привилегии. Снизу
// баннера — шкала уровней: с какой поездки какая скидка. Уровни идут
// по порядку, поэтому это нумерованный список, а линия шкалы светлеет
// к последнему, самому ценному уровню.
//
// «Узнать больше» ведёт на страницу программы (/loyalty) — там уровни,
// сравнение привилегий, калькулятор экономии и вопросы.
// Пока фото нет — заглушка: стёганая кожа сиденья с золотой строчкой
export function Loyalty() {
  const text = LOYALTY[useLang()]

  return (
    <section className={`container ${styles.section}`} id="loyalty" aria-labelledby="loyalty-title">
      <div className={styles.banner} data-reveal>
        <div className={styles.media} aria-hidden="true">
          {LOYALTY_IMAGE ? (
            <img className={styles.photo} src={LOYALTY_IMAGE} alt="" loading="lazy" />
          ) : (
            <div className={styles.placeholder} />
          )}
        </div>

        <div className={styles.content}>
          <h2 className={styles.title} id="loyalty-title">
            <span className={styles.titleLine}>{text.titleLines[0]}</span>{' '}
            <span className={styles.titleLine}>{text.titleLines[1]}</span>
          </h2>
          <p className={styles.text}>{text.text}</p>
          <Button className={styles.cta} href={text.cta.href} arrow>
            {text.cta.label}
          </Button>
        </div>

        <ul className={styles.perks}>
          {text.perks.map((perk) => (
            <li key={perk.icon} className={styles.perk}>
              <span className={styles.perkIcon} aria-hidden="true">
                {PERK_ICONS[perk.icon]}
              </span>
              {perk.label}
            </li>
          ))}
        </ul>

        <ol className={styles.tiers} aria-label={text.tiersTitle}>
          {TIERS.map((tier, index) => (
            <li key={tier.id} className={styles.tier}>
              <span className={styles.tierMark} aria-hidden="true" />
              <span className={styles.tierTrips}>{text.tierTrips(tier.trips)}</span>
              <span className={styles.tierReward}>{text.tierRewards[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
