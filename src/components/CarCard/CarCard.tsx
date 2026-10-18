import { CarFront, Gauge, Timer, UsersRound } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'
import { POPULAR_SECTION } from '@/content/cars'
import { UNITS, vehicleHref } from '@/content/fleet'
import type { Vehicle } from '@/content/vehicles'
import { useLang } from '@/i18n/lang'
import { countLabel, formatDecimal } from '@/utils/format'
import { formatEuro } from '@/utils/price'
import styles from './CarCard.module.css'
import { useGallery } from './useGallery'

// --- Карточка ------------------------------------------------------------------
// Компактная карточка карусели «Лучшие предложения» на главной, по
// референсу: сверху фото с сердечком «в избранное» и точками галереи, под
// ним — название, цена за день, три характеристики (мощность, разгон,
// места) и золотая кнопка «Подробнее» во всю ширину — на страницу машины.
// Карточка каталога — components/VehicleCard; сердечко у них общее, и
// избранное, отмеченное на главной, видно в каталоге.
//
// Фото декоративные (alt пустой): название машины уже есть в заголовке
// карточки. У машины без фото — заглушка: ночная парковка в тех же тонах,
// что и первый экран, и контур машины по центру
export function CarCard({ car }: { car: Vehicle }) {
  const { power, acceleration, seats } = car
  const images = car.photos.map((photo) => photo.small)
  const gallery = useGallery(images.length)
  const lang = useLang()
  const units = UNITS[lang]
  const text = POPULAR_SECTION[lang]
  const specs = lang === 'ru' ? ['Мощность', 'Разгон до 100 км/ч', 'Вместимость'] : ['Power', '0–100 km/h', 'Seats']

  return (
    <article className={styles.card} onPointerEnter={gallery.prime} onPointerLeave={gallery.reset}>
      <div
        className={styles.media}
        onPointerMove={gallery.scrub}
        onPointerDown={gallery.press}
        onClick={gallery.tap}
      >
        {images.length > 0 ? (
          // Стопка фото: первое — обложка, грузится лениво вместе с лентой;
          // остальные появляются в разметке только после интереса к карточке
          images.map(
            (src, i) =>
              (i === 0 || gallery.primed) && (
                <img
                  key={src}
                  className={styles.photo}
                  src={src}
                  alt=""
                  loading={i === 0 ? 'lazy' : undefined}
                  data-active={i === gallery.index ? '' : undefined}
                />
              ),
          )
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <CarFront size={40} strokeWidth={1} />
          </div>
        )}

        <FavoriteButton className={styles.favorite} id={car.id} name={car.name} />

        {/* Точки — сколько фото в галерее и какое из них на экране */}
        {images.length > 1 && (
          <span className={styles.dots} aria-hidden="true">
            {images.map((src, i) => (
              <span key={src} className={styles.dot} data-active={i === gallery.index ? '' : undefined} />
            ))}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name} translate="no">
          {car.name}
        </h3>
        <p className={styles.price}>
          {units.from} <span className={styles.amount}>{formatEuro(car.pricePerDay, lang)}</span> {units.perDay}
        </p>

        {/* Характеристики: на экране — иконка и значение, для скринридера —
            ещё и название характеристики */}
        <dl className={styles.specs}>
          <div className={styles.spec}>
            <dt className="visually-hidden">{specs[0]}</dt>
            <dd>
              <Gauge size={15} strokeWidth={1.5} aria-hidden="true" />
              {power}&nbsp;{units.hp}
            </dd>
          </div>
          <div className={styles.spec}>
            <dt className="visually-hidden">{specs[1]}</dt>
            <dd>
              <Timer size={15} strokeWidth={1.5} aria-hidden="true" />
              {formatDecimal(acceleration, lang)}&nbsp;{units.seconds}
            </dd>
          </div>
          <div className={styles.spec}>
            <dt className="visually-hidden">{specs[2]}</dt>
            <dd>
              <UsersRound size={15} strokeWidth={1.5} aria-hidden="true" />
              {countLabel(seats, units.seats, lang)}
            </dd>
          </div>
        </dl>

        {/* Пять одинаковых «Подробнее» подряд скринридеру ни о чём не
            говорят — к тексту ссылки добавлено скрытое название машины */}
        <Button className={styles.more} href={vehicleHref(car.id)} size="sm" arrow>
          {text.details}
          <span className="visually-hidden">
            {' '}
            {text.detailsAbout} {car.name}
          </span>
        </Button>
      </div>
    </article>
  )
}
