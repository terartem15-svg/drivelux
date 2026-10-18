import { ArrowRight, CarFront, Check, Clock3, KeyRound, MapPin } from 'lucide-react'
import { POPULAR_CARS } from '@/content/cars'
import { UNITS } from '@/content/fleet'
import { HOW_IT_WORKS, type StepId } from '@/content/howItWorks'
import { MOODS } from '@/content/moods'
import { getPlace } from '@/content/places'
import { useLang } from '@/i18n/lang'
import { useTrip } from '@/store/trip'
import { formatShortDate } from '@/utils/format'
import { formatEuro } from '@/utils/price'
import styles from './HowItWorks.module.css'

// Иллюстрации шагов — не фото, а маленькие фрагменты интерфейса самого
// сайта: выбор категории и машины, подтверждённая бронь, машина на месте
// подачи. Данные берутся из тех же файлов, что и остальная страница
// (категории, «Лучшие предложения», панель поиска) — фрагменты всегда
// совпадают с тем, что гость видит выше: даты и место — из его же поездки
// в панели поиска (store/trip).
//
// Целиком декоративные (aria-hidden): всё, что они показывают, уже сказано
// текстом шага
const DEMO_CAR = POPULAR_CARS.find((car) => car.id === 'mclaren-765lt') ?? POPULAR_CARS[0]
const DEMO_MOODS = MOODS.slice(0, 3)

export function StepVisual({ step }: { step: StepId }) {
  const lang = useLang()
  const text = HOW_IT_WORKS[lang]
  const trip = useTrip()
  const units = UNITS[lang]
  // «15 окт, 10:00»: год в маленьком фрагменте лишний
  const shortTrip = (date: string, time: string) => `${formatShortDate(date, lang)}, ${time}`

  return (
    <div className={styles.fragment} aria-hidden="true">
      {step === 'choose' && (
        <>
          <div className={styles.chips}>
            {DEMO_MOODS.map((mood, index) => (
              <span key={mood.id} className={index === 0 ? `${styles.chip} ${styles.chipActive}` : styles.chip}>
                {mood.title[lang]}
              </span>
            ))}
          </div>
          <div className={styles.fragmentRow}>
            <span className={styles.thumb}>
              <CarFront size={18} strokeWidth={1.3} />
            </span>
            <span className={styles.fragmentText}>
              <span className={styles.fragmentTitle} translate="no">
                {DEMO_CAR.name}
              </span>
              <span className={styles.fragmentMeta}>
                {units.from} {formatEuro(DEMO_CAR.pricePerDay, lang)} {units.perDay}
              </span>
            </span>
          </div>
        </>
      )}

      {step === 'confirm' && (
        <>
          <div className={styles.fragmentRow}>
            <span className={`${styles.thumb} ${styles.thumbGold}`}>
              <Check size={18} strokeWidth={2} />
            </span>
            <span className={styles.fragmentText}>
              <span className={styles.fragmentTitle}>{text.confirmed}</span>
              <span className={styles.fragmentMeta}>{text.signed}</span>
            </span>
          </div>
          <div className={styles.fragmentLine}>
            <span>{shortTrip(trip.start, trip.startTime)}</span>
            <ArrowRight size={14} strokeWidth={1.6} />
            <span>{shortTrip(trip.end, trip.endTime)}</span>
          </div>
        </>
      )}

      {step === 'keys' && (
        <>
          <div className={styles.fragmentRow}>
            <span className={`${styles.thumb} ${styles.thumbGold}`}>
              <KeyRound size={18} strokeWidth={1.6} />
            </span>
            <span className={styles.fragmentText}>
              <span className={styles.fragmentTitle}>{text.arrived}</span>
              <span className={styles.fragmentMeta}>{text.keys}</span>
            </span>
          </div>
          <div className={styles.fragmentLine}>
            <span className={styles.fragmentPlace}>
              <MapPin size={14} strokeWidth={1.6} />
              {getPlace(trip.from)?.short[lang]}
            </span>
            <span className={styles.fragmentPlace}>
              <Clock3 size={14} strokeWidth={1.6} />
              {trip.startTime}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
