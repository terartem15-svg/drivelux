import { ArrowRight, CarFront, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { useLocation } from 'react-router'
import { BRAND_PATHS } from '@/components/icons/logoPaths'
import { SimpleIcon } from '@/components/icons/SimpleIcon'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { BRANDS } from '@/content/brands'
import { CLASS_NOTES, CLASS_ORDER, CLASS_TITLES, classHref, PRICE_BOUNDS, UNITS, vehicleHref } from '@/content/fleet'
import { ROUTES } from '@/content/site'
import { VEHICLES, type VehicleClass } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { formatEuro } from '@/utils/price'
import styles from './FleetMenu.module.css'

// Меню «Автопарк» в шапке — компактная панель под пунктом меню, по мотивам
// мега-меню из Offgrid: открывается при наведении на «Автопарк» и не
// закрывает весь экран. Колонки слева направо:
//  1. классы машин с числом машин — наведение на класс меняет превью;
//  2. превью: две самые рекомендуемые машины класса с фото и ценой;
//  3. марки с логотипами и быстрые подборки — по бюджету, электро,
//     кабриолеты, полный привод.
// Внизу — ссылка на весь автопарк.
//
// Мышь: панель открывается при наведении на пункт и остаётся, пока курсор
// над пунктом или панелью; уход — закрытие с короткой задержкой, чтобы
// курсор успел «доехать» до панели. Клавиатура и касание: рядом со словом
// «Автопарк» — кнопка-стрелка, она открывает панель (aria-expanded); Esc
// закрывает её и возвращает фокус на стрелку, уход фокуса из панели —
// тоже закрывает. Сама ссылка «Автопарк» по-прежнему ведёт в каталог.
//
// Панель всегда в разметке и прячется через visibility: так у неё есть
// анимация и появления, и исчезновения, а закрытая не попадает в Tab
const CLOSE_DELAY = 160
const OPEN_DELAY = 70

const TEXT = localized(
  {
    toggle: 'Меню автопарка',
    classes: 'Классы',
    brands: 'Марки',
    picks: 'Быстрый подбор',
    all: (count: number) => `Весь автопарк — ${count} авто`,
    allOfClass: (title: string, count: number) => `Все: ${title.toLowerCase()} (${count})`,
    budget: [`до ${150}\u00a0€`, `150–300\u00a0€`, `от 300\u00a0€`],
    electric: 'Электромобили',
    convertible: 'Кабриолеты',
    awd: 'Полный привод',
    seven: '6 мест и больше',
  },
  {
    toggle: 'Fleet menu',
    classes: 'Classes',
    brands: 'Makes',
    picks: 'Quick picks',
    all: (count: number) => `Whole fleet — ${count} cars`,
    allOfClass: (title: string, count: number) => `All ${title.toLowerCase()} (${count})`,
    budget: ['up to €150', '€150–300', 'from €300'],
    electric: 'Electric cars',
    convertible: 'Convertibles',
    awd: 'All-wheel drive',
    seven: '6+ seats',
  },
)

// Классы, которые есть в парке, по числу машин; превью — по рекомендуемому
// порядку каталога (rank)
const CLASSES = CLASS_ORDER.map((key) => ({
  key,
  cars: VEHICLES.filter((item) => item.class === key).sort((a, b) => a.rank - b.rank),
}))
  .filter((group) => group.cars.length > 0)
  .sort((a, b) => b.cars.length - a.cars.length)

const [MIN_PRICE, MAX_PRICE] = PRICE_BOUNDS
const PICKS = [
  { key: 'budget-0', href: `${ROUTES.fleet}?price=${MIN_PRICE}-150&sort=price-asc` },
  { key: 'budget-1', href: `${ROUTES.fleet}?price=150-300` },
  { key: 'budget-2', href: `${ROUTES.fleet}?price=300-${MAX_PRICE}&sort=price-desc` },
  { key: 'electric', href: `${ROUTES.fleet}?fuel=electric` },
  { key: 'convertible', href: `${ROUTES.fleet}?body=convertible` },
  { key: 'awd', href: `${ROUTES.fleet}?awd=1` },
  { key: 'seven', href: `${ROUTES.fleet}?seats=6` },
] as const

interface FleetMenuProps {
  label: string
  linkClassName: string
}

export function FleetMenu({ label, linkClassName }: FleetMenuProps) {
  const lang = useLang()
  const text = TEXT[lang]
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<VehicleClass>(CLASSES[0].key)
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  // Переход на другую страницу (клик по пункту панели) закрывает меню —
  // сразу в той же отрисовке, без лишнего кадра с открытой панелью
  const address = location.pathname + location.search
  const [lastAddress, setLastAddress] = useState(address)
  if (lastAddress !== address) {
    setLastAddress(address)
    setOpen(false)
  }

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current)
      window.clearTimeout(closeTimer.current)
    },
    [],
  )

  function handleEnter() {
    window.clearTimeout(closeTimer.current)
    openTimer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY)
  }

  function handleLeave() {
    window.clearTimeout(openTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      setOpen(false)
      toggleRef.current?.focus()
    }
  }

  // Фокус ушёл за пределы пункта и панели — меню закрывается. Клик мышью
  // по пустому месту самой панели тоже снимает фокус, но курсор при этом
  // над пунктом — такое меню остаётся открытым
  function handleBlur(event: FocusEvent<HTMLLIElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
    if (event.currentTarget.matches(':hover')) return
    setOpen(false)
  }

  const current = CLASSES.find((group) => group.key === active) ?? CLASSES[0]
  const title = CLASS_TITLES[lang][current.key]

  return (
    <li
      className={styles.item}
      onPointerEnter={(event) => event.pointerType === 'mouse' && handleEnter()}
      onPointerLeave={(event) => event.pointerType === 'mouse' && handleLeave()}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <SiteLink className={linkClassName} href={ROUTES.fleet} nav>
        {label}
      </SiteLink>
      <button
        ref={toggleRef}
        className={styles.toggle}
        type="button"
        aria-label={text.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronDown size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <div className={styles.panel} id={panelId} data-open={open ? '' : undefined}>
        <div className={styles.card}>
          {/* --- Классы ------------------------------------------------------------- */}
          <div className={styles.classes}>
            <p className={styles.heading}>{text.classes}</p>
            <ul className={styles.classList}>
              {CLASSES.map((group) => (
                <li key={group.key}>
                  <SiteLink
                    className={styles.classLink}
                    href={classHref(group.key)}
                    data-active={group.key === active ? '' : undefined}
                    onPointerEnter={() => setActive(group.key)}
                    onFocus={() => setActive(group.key)}
                  >
                    <span className={styles.className}>{CLASS_TITLES[lang][group.key]}</span>
                    <span className={styles.classCount}>{group.cars.length}</span>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Превью класса ------------------------------------------------------ */}
          <div className={styles.preview} key={current.key}>
            <p className={styles.heading}>
              {title}
              <span className={styles.headingNote}> · {CLASS_NOTES[lang][current.key]}</span>
            </p>
            <ul className={styles.cars}>
              {current.cars.slice(0, 2).map((car, index) => (
                <li key={car.id} style={{ animationDelay: `${index * 60}ms` }} className={styles.carItem}>
                  <SiteLink className={styles.car} href={vehicleHref(car.id)}>
                    <span className={styles.carPhoto}>
                      {car.photos[0] && <img src={car.photos[0].small} alt="" loading="lazy" decoding="async" />}
                    </span>
                    <span className={styles.carName} translate="no">
                      {car.name}
                    </span>
                    <span className={styles.carPrice}>
                      {UNITS[lang].from} {formatEuro(car.pricePerDay, lang)} {UNITS[lang].perDay}
                    </span>
                  </SiteLink>
                </li>
              ))}
            </ul>
            <SiteLink className={styles.more} href={classHref(current.key)}>
              {text.allOfClass(title, current.cars.length)}
              <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </SiteLink>
          </div>

          {/* --- Марки и быстрый подбор --------------------------------------------- */}
          <div className={styles.side}>
            <p className={styles.heading}>{text.brands}</p>
            <ul className={styles.brands}>
              {BRANDS.map((brand) => (
                <li key={brand.id}>
                  <SiteLink className={styles.brand} href={brand.href}>
                    <span className={styles.brandLogo} aria-hidden="true">
                      {brand.logo ? (
                        <SimpleIcon path={BRAND_PATHS[brand.logo]} style={{ scale: brand.scale ?? 1 }} />
                      ) : (
                        <CarFront size={16} strokeWidth={1.5} />
                      )}
                    </span>
                    <span className={styles.brandName} translate="no">
                      {brand.name}
                    </span>
                  </SiteLink>
                </li>
              ))}
            </ul>

            <p className={`${styles.heading} ${styles.picksHeading}`}>{text.picks}</p>
            <ul className={styles.picks}>
              {PICKS.map((pick) => {
                const caption = pick.key.startsWith('budget')
                  ? text.budget[Number(pick.key.slice(-1))]
                  : text[pick.key as 'electric' | 'convertible' | 'awd' | 'seven']
                return (
                  <li key={pick.key}>
                    <SiteLink className={styles.pick} href={pick.href}>
                      {caption}
                    </SiteLink>
                  </li>
                )
              })}
            </ul>
          </div>

          <SiteLink className={styles.all} href={ROUTES.fleet}>
            {text.all(VEHICLES.length)}
            <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </SiteLink>
        </div>
      </div>
    </li>
  )
}
