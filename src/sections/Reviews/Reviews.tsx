import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/SectionHeading/SectionHeading'
import { HOME_REVIEWS, REVIEW_STATS, REVIEWS_SECTION } from '@/content/reviews'
import { useLang } from '@/i18n/lang'
import { countLabel, formatDecimal } from '@/utils/format'
import { ReviewCard, Stars } from './ReviewCard'
import styles from './Reviews.module.css'

// «Что говорят о DriveLux»: три свежих отзыва карточками, как в референсе.
// Рядом с заголовком — средняя оценка и число отзывов (считаются по самим
// отзывам), ссылка «Все отзывы» ведёт на страницу отзывов с фильтрами
// (/reviews). Карточка — общая с той страницей (ReviewCard).
//
// ≤1000px карточки встают в горизонтальную ленту со свайпом, как карусель
// машин выше
export function Reviews() {
  const lang = useLang()
  const text = REVIEWS_SECTION[lang]

  return (
    <section className={`container ${styles.section}`} id="reviews" aria-labelledby="reviews-title">
      <SectionHeading
        id="reviews-title"
        eyebrow={text.eyebrow}
        title={text.title}
        link={text.link}
        aside={
          <div className={styles.summary}>
            {/* Число дублирует подпись звёзд — скринридеру хватит её одной */}
            <span className={styles.summaryValue} aria-hidden="true">
              {formatDecimal(REVIEW_STATS.rating, lang)}
            </span>
            <span className={styles.summaryDetails}>
              <Stars rating={REVIEW_STATS.rating} size={13} />
              <span className={styles.summaryTotal}>{countLabel(REVIEW_STATS.total, text.reviews, lang)}</span>
            </span>
          </div>
        }
      />

      <ul className={styles.list}>
        {HOME_REVIEWS.map((review, index) => (
          <li key={review.id} className={styles.slide} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  )
}
