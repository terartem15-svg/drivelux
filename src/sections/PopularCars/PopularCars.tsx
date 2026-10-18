import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CarCard } from '@/components/CarCard/CarCard'
import { SectionHeading } from '@/components/SectionHeading/SectionHeading'
import type { CSSProperties } from 'react'
import { POPULAR_CARS, POPULAR_SECTION } from '@/content/cars'
import { useLang } from '@/i18n/lang'
import styles from './PopularCars.module.css'

// «Лучшие предложения»: заголовок со ссылкой на весь автопарк и ряд из
// пяти карточек со стрелками по бокам, вынесенными в поля страницы.
//
// Макет без интерактива: стрелки пока не листают. На экранах уже 1200px
// ряд листается обычной горизонтальной прокруткой (свайпом) — пять карточек
// в такую ширину не помещаются, а скрипт для этого не нужен
export function PopularCars() {
  const text = POPULAR_SECTION[useLang()]
  return (
    <section className={`container ${styles.section}`} id="fleet" aria-labelledby="popular-title">
      <SectionHeading
        id="popular-title"
        eyebrow={text.eyebrow}
        title={text.title}
        link={text.link}
      />

      <div className={styles.carousel}>
        <button className={`${styles.arrow} ${styles.arrowPrev}`} type="button" aria-label={text.prev}>
          <ChevronLeft size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>

        <ul className={styles.track}>
          {POPULAR_CARS.map((car, index) => (
            <li key={car.id} className={styles.slide} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
              <CarCard car={car} />
            </li>
          ))}
        </ul>

        <button className={`${styles.arrow} ${styles.arrowNext}`} type="button" aria-label={text.next}>
          <ChevronRight size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
