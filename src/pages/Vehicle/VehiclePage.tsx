import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Cog,
  Compass,
  Gauge,
  Info,
  Mountain,
  Sofa,
  Sparkles,
  Star,
  Timer,
  UsersRound,
  VolumeX,
  Waypoints,
  Check,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/components/Button/Button'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'
import { BRAND_PATHS } from '@/components/icons/logoPaths'
import { SimpleIcon } from '@/components/icons/SimpleIcon'
import { VehicleCard } from '@/components/VehicleCard/VehicleCard'
import {
  BODY_LABELS,
  bookingHref,
  CLASS_LABELS,
  CLASS_LEGEND,
  DRIVE_LABELS,
  EXTRAS,
  FUEL_LABELS,
  INCLUDED,
  rentalTerms,
  TRANSMISSION_LABELS,
  UNITS,
  type LegendIcon,
} from '@/content/fleet'
import { ROUTES } from '@/content/site'
import { VEHICLE_DESCRIPTIONS } from '@/content/vehicleDescriptions'
import { BRAND_NAMES, getVehicle, VEHICLES, type Vehicle } from '@/content/vehicles'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import { lastCatalogSearch } from '@/pages/Fleet/useCatalog'
import { localized, useLang } from '@/i18n/lang'
import { formatDecimal, plural } from '@/utils/format'
import { formatEuro } from '@/utils/price'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import { Gallery } from './Gallery'
import styles from './VehiclePage.module.css'

// Страница машины: /fleet/:id. Машина ищется по id из адреса в локальном
// автопарке (content/vehicles.ts); нет такой — «Автомобиль не найден».
//
// Порядок блоков — по референсу:
//  1. галерея слева и сводка справа (марка с логотипом, модель, цена,
//     четыре главные цифры, «Забронировать» и «Подробнее»);
//  2. «Легенда» — описание машины и три качества класса рядом с карточкой
//     характеристик;
//  3. салон: фото салона именно этой машины слева, условия аренды справа;
//  4. «Что включено» и «Дополнительные опции» и призыв к бронированию;
//  5. похожие автомобили.
//
// Условия аренды подписаны как демонстрационные: сайт — концепт, реальных
// договоров за ними нет. Крошка «Автопарк» возвращает к последнему отбору
// каталога, а не к пустому
const TEXT = localized(
  {
    notFound: 'Автомобиль не найден',
    notFoundText: 'Такой машины нет в автопарке — возможно, ссылка устарела. Посмотрите другие автомобили в каталоге.',
    home: 'Главная',
    fleet: 'Автопарк',
    popular: 'Популярный',
    year: 'Год выпуска',
    class: 'Класс',
    body: 'Тип кузова',
    gearbox: 'Коробка передач',
    engine: 'Тип двигателя',
    drive: 'Привод',
    power: 'Мощность',
    acceleration: 'Разгон 0–100 км/ч',
    accelerationShort: '0–100 км/ч',
    seats: 'Количество мест',
    capacity: 'Вместимость',
    book: 'Забронировать',
    more: 'Подробнее',
    freeCancel: 'Бесплатная отмена бронирования',
    legend: 'Легенда дорог',
    specs: 'Характеристики',
    interior: (name: string) => `Салон ${name}`,
    photo: 'Фото',
    publicDomain: 'общественное достояние',
    terms: 'Условия аренды',
    demo: 'Демонстрационные условия: сайт — концепт для портфолио, цифры приведены для примера',
    extrasLabel: 'Что включено и дополнительные опции',
    included: 'Что включено',
    extras: 'Дополнительные опции',
    ctaTitle: 'Готовы к приключениям?',
    ctaText: (name: string) => `Забронируйте ${name} и почувствуйте настоящую свободу на дороге.`,
    similar: 'Похожие автомобили',
    allFleet: 'Весь автопарк',
  },
  {
    notFound: 'Car not found',
    notFoundText: 'There is no such car in the fleet — the link may be out of date. Take a look at other cars in the catalogue.',
    home: 'Home',
    fleet: 'Fleet',
    popular: 'Popular',
    year: 'Year',
    class: 'Class',
    body: 'Body type',
    gearbox: 'Gearbox',
    engine: 'Engine type',
    drive: 'Drive',
    power: 'Power',
    acceleration: '0–100 km/h',
    accelerationShort: '0–100 km/h',
    seats: 'Seats',
    capacity: 'Capacity',
    book: 'Book now',
    more: 'Details',
    freeCancel: 'Free booking cancellation',
    legend: 'Road legend',
    specs: 'Specifications',
    interior: (name: string) => `${name} interior`,
    photo: 'Photo',
    publicDomain: 'public domain',
    terms: 'Rental terms',
    demo: 'Demonstration terms: this is a portfolio concept site, the figures are examples',
    extrasLabel: 'What is included and extras',
    included: 'What is included',
    extras: 'Extras',
    ctaTitle: 'Ready for an adventure?',
    ctaText: (name: string) => `Book the ${name} and feel true freedom on the road.`,
    similar: 'Similar cars',
    allFleet: 'Whole fleet',
  },
)

export function VehiclePage() {
  const { id } = useParams()
  const vehicle = getVehicle(id)
  const text = TEXT[useLang()]
  useDocumentTitle(vehicle ? vehicle.name : text.notFound)

  if (!vehicle) {
    return <NotFoundPage title={text.notFound} text={text.notFoundText} />
  }

  return <VehicleDetails key={vehicle.id} vehicle={vehicle} />
}

const LEGEND_ICONS: Record<LegendIcon, LucideIcon> = {
  design: Sparkles,
  handling: Compass,
  comfort: Sofa,
  space: UsersRound,
  terrain: Mountain,
  quiet: VolumeX,
}

// «Популярные» — первые места рекомендуемой сортировки каталога
const POPULAR_RANK = 5

function VehicleDetails({ vehicle }: { vehicle: Vehicle }) {
  const brand = BRAND_NAMES[vehicle.brand]
  const brandLogo = vehicle.brand in BRAND_PATHS ? BRAND_PATHS[vehicle.brand as keyof typeof BRAND_PATHS] : undefined
  const similar = similarTo(vehicle)
  const lang = useLang()
  const text = TEXT[lang]
  const units = UNITS[lang]
  const legend = CLASS_LEGEND[lang][vehicle.class]
  const interior = vehicle.interior
  const classLabel = CLASS_LABELS[lang][vehicle.class]
  const bodyLabel = BODY_LABELS[lang][vehicle.body]

  const specs: [string, ReactNode, LucideIcon][] = [
    [text.year, vehicle.year, BadgeCheck],
    [text.class, classLabel, Star],
    [text.body, bodyLabel, CarFront],
    [text.gearbox, TRANSMISSION_LABELS[lang][vehicle.transmission].full, Cog],
    [text.engine, FUEL_LABELS[lang][vehicle.fuel], Waypoints],
    [text.drive, DRIVE_LABELS[lang][vehicle.drive], Compass],
    [text.power, `${vehicle.power} ${units.hp}`, Gauge],
    [text.acceleration, `${formatDecimal(vehicle.acceleration, lang)} ${units.seconds}`, Timer],
    [text.seats, vehicle.seats, UsersRound],
  ]

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumbs
        crumbs={[
          { label: text.home, href: ROUTES.home },
          { label: text.fleet, href: `${ROUTES.fleet}${lastCatalogSearch()}` },
          { label: vehicle.name },
        ]}
      />

      {/* --- Галерея и сводка ---------------------------------------------------------- */}
      <div className={styles.top}>
        <Gallery photos={vehicle.photos} name={vehicle.name} badge={vehicle.rank <= POPULAR_RANK ? text.popular : undefined} />

        <div className={styles.summary}>
          <div className={styles.summaryHead}>
            <div>
              {/* Марка — подпись над моделью; скринридер прочтёт её в заголовке */}
              <p className={styles.brand} translate="no" aria-hidden="true">
                {brandLogo && <SimpleIcon className={styles.brandLogo} path={brandLogo} />}
                {brand}
              </p>
              <h1 className={styles.title} translate="no">
                <span className="visually-hidden">{brand} </span>
                {vehicle.model}
              </h1>
            </div>
            <FavoriteButton id={vehicle.id} name={vehicle.name} />
          </div>

          <p className={styles.meta}>
            {vehicle.year}
            <span aria-hidden="true"> · </span>
            {classLabel}
            {/* У внедорожников класс и кузов называются одинаково — не повторяем */}
            {bodyLabel !== classLabel && (
              <>
                <span aria-hidden="true"> · </span>
                {bodyLabel}
              </>
            )}
          </p>

          <p className={styles.price}>
            <span className={styles.priceFrom}>{units.from}</span>
            <span className={styles.priceAmount}>{formatEuro(vehicle.pricePerDay, lang)}</span>
            <span className={styles.priceUnit}>{units.perDay}</span>
          </p>

          <dl className={styles.keySpecs}>
            <KeySpec icon={<Gauge />} label={text.power} value={`${vehicle.power}`} unit={units.hp} />
            <KeySpec
              icon={<Timer />}
              label={text.accelerationShort}
              value={formatDecimal(vehicle.acceleration, lang)}
              unit={units.seconds}
            />
            <KeySpec
              icon={<UsersRound />}
              label={text.capacity}
              value={`${vehicle.seats}`}
              unit={plural(vehicle.seats, units.seats, lang)}
            />
            <KeySpec icon={<Compass />} label={text.drive} value={vehicle.drive.toUpperCase()} />
          </dl>

          <div className={styles.actions}>
            <Button className={styles.book} href={bookingHref(vehicle.id)} size="lg" arrow>
              {text.book}
            </Button>
            <Button className={styles.more} href="#about" variant="ghost" size="lg">
              {text.more}
            </Button>
          </div>

          <p className={styles.freeCancel}>
            <BadgeCheck size={16} strokeWidth={1.6} aria-hidden="true" />
            {text.freeCancel}
          </p>
        </div>
      </div>

      {/* --- Легенда и характеристики -------------------------------------------------- */}
      <div className={styles.details} data-reveal>
        <section className={styles.legend} id="about" aria-labelledby="about-title">
          <p className={styles.eyebrow}>{text.legend}</p>
          <h2 className={styles.legendTitle} id="about-title" translate="no">
            {vehicle.name} —<br />
            <span className={styles.legendAccent}>{legend.tagline}</span>
          </h2>
          <p className={styles.description}>{VEHICLE_DESCRIPTIONS[vehicle.id]?.[lang]}</p>
          <ul className={styles.traits}>
            {legend.traits.map((trait) => {
              const Icon = LEGEND_ICONS[trait.icon]
              return (
                <li key={trait.title + trait.text} className={styles.trait}>
                  <span className={styles.traitIcon} aria-hidden="true">
                    <Icon size={20} strokeWidth={1.4} />
                  </span>
                  <span>
                    {trait.title}
                    <span className={styles.traitSoft}> {trait.text}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className={styles.specsCard} aria-labelledby="specs-title">
          <h2 className={styles.cardTitle} id="specs-title">
            {text.specs}
          </h2>
          <dl className={styles.specTable}>
            {specs.map(([label, value, Icon]) => (
              <div key={label} className={styles.specRow}>
                <dt>
                  <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  {label}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* --- Салон и условия аренды (демо) --------------------------------------------- */}
      <section
        className={`${styles.cabin} ${interior ? '' : styles.cabinPlain}`}
        aria-labelledby="terms-title"
        data-reveal
      >
        {interior && (
          <figure className={styles.interior}>
            <img
              src={interior.src}
              alt={text.interior(vehicle.name)}
              loading="lazy"
              width={1400}
              draggable={false}
            />
            <figcaption className={styles.interiorCredit}>
              {interior.credit.note && <span>{interior.credit.note[lang]}. </span>}
              {text.photo}:{' '}
              <a href={interior.credit.url} target="_blank" rel="noreferrer">
                {interior.credit.author}
              </a>
              , Wikimedia Commons, {interior.credit.license === 'public domain' ? text.publicDomain : interior.credit.license}
            </figcaption>
          </figure>
        )}

        <div className={styles.terms}>
          <h2 className={styles.cardTitle} id="terms-title">
            {text.terms}
          </h2>
          <dl className={styles.termsGrid}>
            {rentalTerms(vehicle, lang).map((term) => (
              <div key={term.label} className={styles.term}>
                <dt className={styles.termLabel}>{term.label}</dt>
                <dd className={styles.termValue}>{term.value}</dd>
                <dd className={styles.termNote}>{term.note}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.demoNote}>
            <Info size={16} strokeWidth={1.6} aria-hidden="true" />
            {text.demo}
          </p>
        </div>
      </section>

      {/* --- Что включено, опции и призыв ---------------------------------------------- */}
      <section className={styles.extras} aria-label={text.extrasLabel} data-reveal>
        <div className={styles.extrasLists}>
          <div>
            <h2 className={styles.cardTitle}>{text.included}</h2>
            <ul className={styles.checkList}>
              {INCLUDED[lang].map((item) => (
                <li key={item}>
                  <span className={styles.checkIcon} aria-hidden="true">
                    <Check size={14} strokeWidth={2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={styles.cardTitle}>{text.extras}</h2>
            <ul className={styles.extraList}>
              {EXTRAS[lang].map((extra) => (
                <li key={extra.label}>
                  <span>{extra.label}</span>
                  <span className={styles.extraPrice}>{extra.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className={styles.cta}>
          {vehicle.photos[0] && <img className={styles.ctaPhoto} src={vehicle.photos[0].small} alt="" loading="lazy" />}
          <div className={styles.ctaBody}>
            <h2 className={styles.ctaTitle}>{text.ctaTitle}</h2>
            <p className={styles.ctaText}>{text.ctaText(vehicle.name)}</p>
            <Button href={bookingHref(vehicle.id)} arrow>
              {text.book}
            </Button>
          </div>
        </aside>
      </section>

      {/* --- Похожие ------------------------------------------------------------------------ */}
      {similar.length > 0 && (
        <section className={styles.similar} aria-labelledby="similar-title" data-reveal>
          <div className={styles.similarHead}>
            <h2 className={styles.sectionTitle} id="similar-title">
              {text.similar}
            </h2>
            <Button variant="ghost" size="sm" href={ROUTES.fleet}>
              {text.allFleet}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
          <ul className={styles.similarGrid}>
            {similar.map((item, index) => (
              <li key={item.id}>
                <VehicleCard vehicle={item} order={index} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

// Ключевая цифра сводки: иконка, значение и подпись под ним
function KeySpec({ icon, label, value, unit }: { icon: ReactNode; label: string; value: string; unit?: string }) {
  return (
    <div className={styles.keySpec}>
      <dt className={styles.keySpecLabel}>
        <span className={styles.keySpecIcon} aria-hidden="true">
          {icon}
        </span>
        <span className="visually-hidden">{label}</span>
      </dt>
      <dd className={styles.keySpecValue}>
        <span>
          {value}
          {unit && <span className={styles.keySpecUnit}> {unit}</span>}
        </span>
        <span className={styles.keySpecCaption} aria-hidden="true">
          {label}
        </span>
      </dd>
    </div>
  )
}

// Похожие — машины того же класса, ближайшие по цене; если таких меньше
// трёх, ряд добирается машинами с близкой ценой из других классов
function similarTo(vehicle: Vehicle): Vehicle[] {
  const others = VEHICLES.filter((item) => item.id !== vehicle.id)
  const byPrice = (a: Vehicle, b: Vehicle) =>
    Math.abs(a.pricePerDay - vehicle.pricePerDay) - Math.abs(b.pricePerDay - vehicle.pricePerDay)
  const sameClass = others.filter((item) => item.class === vehicle.class).sort(byPrice)
  const rest = others.filter((item) => item.class !== vehicle.class).sort(byPrice)
  return [...sameClass, ...rest].slice(0, 3)
}
