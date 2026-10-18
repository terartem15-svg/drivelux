import { CarFront, MessageSquareReply, Star, ThumbsUp } from 'lucide-react'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { vehicleHref } from '@/content/fleet'
import { REVIEWS_SECTION, type Review } from '@/content/reviews'
import { getVehicle } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { formatDecimal, formatIsoDate } from '@/utils/format'
import styles from './Reviews.module.css'

// Пять звёзд оценки: закрашено столько, сколько поставил клиент. Для
// скринридера звёзды — одна картинка с подписью «Оценка 5 из 5»
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const lang = useLang()
  return (
    <span
      className={styles.stars}
      role="img"
      aria-label={REVIEWS_SECTION[lang].rating(formatDecimal(rating, lang).replace(/[.,]0$/, ''))}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={size}
          strokeWidth={1.5}
          fill={value <= Math.round(rating) ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

// Инициалы для кружка-аватара: «Александр К.» → «АК»
function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

const TEXT = localized(
  {
    reply: 'Ответ DriveLux',
    helpful: 'Полезно',
    helpfulLabel: (count: number) => `Отзыв полезен — отметили ${count}`,
  },
  {
    reply: 'DriveLux replied',
    helpful: 'Helpful',
    helpfulLabel: (count: number) => `Mark as helpful — ${count} people found it helpful`,
  },
)

// Карточка отзыва — на главной и на странице отзывов. Карточка — <figure>:
// цитата и подпись к ней с автором. Внизу — машина клиента со ссылкой на
// её страницу. На странице отзывов есть ещё ответ компании (если был) и
// кнопка «Полезно» (helpful)
interface ReviewCardProps {
  review: Review
  // Отметка «полезно» — только на странице отзывов
  helpful?: { count: number; marked: boolean; onToggle: () => void }
  showReply?: boolean
}

export function ReviewCard({ review, helpful, showReply = false }: ReviewCardProps) {
  const lang = useLang()
  const text = TEXT[lang]
  const name = review.name[lang]
  const car = getVehicle(review.car)

  return (
    <figure className={styles.card}>
      <figcaption className={styles.author}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(name)}
        </span>
        <span className={styles.authorText}>
          <span className={styles.name}>{name}</span>
          <time className={styles.date} dateTime={review.date}>
            {formatIsoDate(review.date, lang)}
          </time>
        </span>
      </figcaption>

      <Stars rating={review.rating} />

      <blockquote className={styles.quote}>
        <p>{lang === 'ru' ? `«${review.text.ru}»` : `“${review.text.en}”`}</p>
      </blockquote>

      {showReply && review.reply && (
        <div className={styles.reply}>
          <p className={styles.replyTitle}>
            <MessageSquareReply size={14} strokeWidth={1.6} aria-hidden="true" />
            {text.reply}
          </p>
          <p className={styles.replyText}>{review.reply[lang]}</p>
        </div>
      )}

      <div className={styles.cardFoot}>
        {car && (
          <p className={styles.car}>
            <CarFront size={16} strokeWidth={1.5} aria-hidden="true" />
            <span className="visually-hidden">{REVIEWS_SECTION[lang].car}: </span>
            <SiteLink className={styles.carLink} href={vehicleHref(car.id)} translate="no">
              {car.name}
            </SiteLink>
          </p>
        )}
        {helpful && (
          <button
            className={styles.helpful}
            type="button"
            aria-pressed={helpful.marked}
            aria-label={text.helpfulLabel(helpful.count)}
            onClick={helpful.onToggle}
          >
            <ThumbsUp size={14} strokeWidth={1.6} aria-hidden="true" />
            <span aria-hidden="true">{text.helpful}</span>
            <span className={styles.helpfulCount} aria-hidden="true">
              {helpful.count}
            </span>
          </button>
        )}
      </div>
    </figure>
  )
}
