import { CarFront, Check, Cog, Fuel, Gauge, Timer, UsersRound, Waypoints } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/Button/Button'
import { useGallery } from '@/components/CarCard/useGallery'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'
import {
  bookingHref,
  CLASS_LABELS,
  DRIVE_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  UNITS,
  vehicleHref,
} from '@/content/fleet'
import { BRAND_NAMES, type Vehicle } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { countLabel, formatDecimal } from '@/utils/format'
import { formatEuro } from '@/utils/price'
import styles from './VehicleCard.module.css'

// Карточка машины в каталоге, в избранном и в «Похожих» на странице машины.
// Карусель главной использует свою компактную карточку по референсу
// (components/CarCard) — с листанием фото курсором; эта — рабочая: класс,
// год, ключевые характеристики и два действия.
//
// layout:
//  - grid — сетка: фото сверху, под ним текст. Четыре характеристики,
//    которые решают выбор: мощность, коробка, места, привод;
//  - list — строка: фото слева, справа те же данные и ещё разгон и топливо —
//    в строке есть место, а сравнивать машины построчно удобнее.
//
// Ссылок на страницу машины три: фото, название и «Подробнее». Фото —
// дубль для мыши и пальца, поэтому скрыто от клавиатуры и скринридера:
// Tab проходит по карточке за три шага (название, сердечко, кнопки).
//
// order — номер карточки в партии: из него CSS считает задержку появления,
// чтобы новые карточки выходили лесенкой, а не все разом.
//
// select — карточка в подборке на странице услуги: вместо «Забронировать»
// кнопка «Выбрать», которая подставляет машину в форму заказа услуги.
// Выбранная машина — «Выбрано» с галочкой и aria-pressed
interface VehicleCardProps {
  vehicle: Vehicle
  layout?: 'grid' | 'list'
  order?: number
  select?: { selected: boolean; onSelect: () => void }
}

const TEXT = localized(
  {
    power: 'Мощность',
    acceleration: 'Разгон до 100 км/ч',
    gearbox: 'Коробка передач',
    seats: 'Вместимость',
    drive: 'Привод',
    fuel: 'Топливо',
    details: 'Подробнее',
    about: 'о',
    book: 'Забронировать',
    select: 'Выбрать',
    selected: 'Выбрано',
  },
  {
    power: 'Power',
    acceleration: '0–100 km/h',
    gearbox: 'Gearbox',
    seats: 'Seats',
    drive: 'Drive',
    fuel: 'Fuel',
    details: 'Details',
    about: 'about',
    book: 'Book now',
    select: 'Select',
    selected: 'Selected',
  },
)

// Ширина фото в разных раскладках — браузер по ней выбирает файл из
// srcset: уменьшенную копию для карточек, большой кадр только для широких
// экранов и плотных дисплеев телефона
const SIZES = {
  grid: '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 26rem',
  list: '(max-width: 640px) 100vw, 22rem',
}

export function VehicleCard({ vehicle, layout = 'grid', order = 0, select }: VehicleCardProps) {
  const href = vehicleHref(vehicle.id)
  const gallery = useGallery(vehicle.photos.length)
  const brand = BRAND_NAMES[vehicle.brand]
  const lang = useLang()
  const text = TEXT[lang]
  const units = UNITS[lang]

  return (
    <article
      className={`${styles.card} ${styles[layout]}`}
      style={{ '--order': order } as CSSProperties}
      onPointerEnter={gallery.prime}
      onPointerLeave={gallery.reset}
    >
      {/* Фото листает курсор: окно поделено на полосы по числу фото, и курсор
          над полосой показывает её фото — не заходя в карточку. Пальцем
          фото не листаются: тап по фото — переход на страницу машины */}
      <div className={styles.media} onPointerMove={gallery.scrub} onPointerDown={gallery.press}>
        <Link className={styles.mediaLink} to={href} tabIndex={-1} aria-hidden="true">
          {vehicle.photos.length > 0 ? (
            // Стопка фото: первое — обложка, остальные появляются в разметке
            // только после интереса к карточке (наведения или касания)
            vehicle.photos.map(
              (photo, i) =>
                (i === 0 || gallery.primed) && (
                  <img
                    key={photo.src}
                    className={styles.photo}
                    src={photo.small}
                    srcSet={photo.srcSet}
                    sizes={SIZES[layout]}
                    alt=""
                    loading={i === 0 ? 'lazy' : undefined}
                    decoding="async"
                    data-active={i === gallery.index ? '' : undefined}
                  />
                ),
            )
          ) : (
            <span className={styles.placeholder}>
              <CarFront size={40} strokeWidth={1} />
            </span>
          )}
        </Link>
        <span className={styles.badge}>{CLASS_LABELS[lang][vehicle.class]}</span>
        <FavoriteButton className={styles.favorite} id={vehicle.id} name={vehicle.name} />

        {/* Точки — сколько фото и какое на экране */}
        {vehicle.photos.length > 1 && (
          <span className={styles.dots} aria-hidden="true">
            {vehicle.photos.map((photo, i) => (
              <span key={photo.src} className={styles.dot} data-active={i === gallery.index ? '' : undefined} />
            ))}
          </span>
        )}
      </div>

      <div className={styles.body}>
        {/* Марка — подпись над моделью; в заголовке она тоже есть, но
            скрыта: скринридер читает заголовок целиком — «Lamborghini Huracán» */}
        <p className={styles.meta} aria-hidden="true">
          <span className={styles.brand} translate="no">
            {brand}
          </span>
          <span className={styles.year}>{vehicle.year}</span>
        </p>
        <h3 className={styles.title} translate="no">
          <Link className={styles.titleLink} to={href}>
            <span className="visually-hidden">{brand} </span>
            {vehicle.model}
          </Link>
          <span className="visually-hidden">, {vehicle.year}</span>
        </h3>

        <p className={styles.price}>
          {units.from} <span className={styles.amount}>{formatEuro(vehicle.pricePerDay, lang)}</span> {units.perDay}
        </p>

        <dl className={styles.specs}>
          <Spec label={text.power} icon={<Gauge />}>
            {vehicle.power}&nbsp;{units.hp}
          </Spec>
          {layout === 'list' && (
            <Spec label={text.acceleration} icon={<Timer />}>
              {formatDecimal(vehicle.acceleration, lang)}&nbsp;{units.seconds}
            </Spec>
          )}
          <Spec label={text.gearbox} icon={<Cog />}>
            {TRANSMISSION_LABELS[lang][vehicle.transmission].short}
          </Spec>
          <Spec label={text.seats} icon={<UsersRound />}>
            {countLabel(vehicle.seats, units.seats, lang)}
          </Spec>
          <Spec label={text.drive} icon={<Waypoints />}>
            {DRIVE_LABELS[lang][vehicle.drive]}
          </Spec>
          {layout === 'list' && (
            <Spec label={text.fuel} icon={<Fuel />}>
              {FUEL_LABELS[lang][vehicle.fuel]}
            </Spec>
          )}
        </dl>

        {/* Одинаковые «Подробнее» и «Забронировать» подряд скринридеру ни о
            чём не говорят — к тексту добавлено скрытое название машины */}
        <div className={styles.actions}>
          <Button className={styles.more} variant="ghost" size="sm" href={href}>
            {text.details}
            <span className="visually-hidden">
              {' '}
              {text.about} {vehicle.name}
            </span>
          </Button>
          {select ? (
            <Button
              className={styles.book}
              variant={select.selected ? 'ghost' : 'gold'}
              size="sm"
              icon={select.selected ? <Check size={16} strokeWidth={2} aria-hidden="true" /> : undefined}
              aria-pressed={select.selected}
              onClick={select.onSelect}
            >
              {select.selected ? text.selected : text.select}
              <span className="visually-hidden"> {vehicle.name}</span>
            </Button>
          ) : (
            <Button className={styles.book} size="sm" href={bookingHref(vehicle.id)} arrow>
              {text.book}
              <span className="visually-hidden"> {vehicle.name}</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

// Характеристика: на экране — иконка и значение, для скринридера — ещё и
// название. Иконки тоньше и тусклее текста — подсказка, а не главное
function Spec({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.spec}>
      <dt className="visually-hidden">{label}</dt>
      <dd>
        <span className={styles.specIcon} aria-hidden="true">
          {icon}
        </span>
        {children}
      </dd>
    </div>
  )
}
