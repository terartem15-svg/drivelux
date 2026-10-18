import { ArrowRight, CarFront, Clock3, CornerDownLeft, FileText, Layers, Search, Sparkles, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { BRAND_PATHS } from '@/components/icons/logoPaths'
import { SimpleIcon } from '@/components/icons/SimpleIcon'
import { CLASS_LABELS, CLASS_NOTES, CLASS_TITLES, classHref, UNITS, vehicleHref } from '@/content/fleet'
import { BRANDS } from '@/content/brands'
import { ROUTES } from '@/content/site'
import { BRAND_NAMES, VEHICLES } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { formatEuro } from '@/utils/price'
import { searchSite } from './searchIndex'
import styles from './SiteSearch.module.css'

// Поиск по сайту — окно поверх страницы по кнопке-лупе в шапке, клавише
// «/» или Ctrl+K (⌘K). Результаты появляются по мере ввода: машины с фото
// и ценой, марки, классы, услуги и страницы сайта. Пустой запрос — недавние
// поиски, популярные запросы и самые востребованные машины.
//
// Клавиатура — по образцу combobox: фокус остаётся в поле, стрелки вверх и
// вниз двигают подсветку по результатам, Enter открывает подсвеченный, а
// если ничего не подсвечено — каталог с этим запросом (/fleet?q=…). Esc
// закрывает окно — это нативный <dialog>: браузер сам держит фокус внутри
// и возвращает его на лупу после закрытия
const TEXT = localized(
  {
    title: 'Поиск по сайту',
    placeholder: 'Марка, модель, класс или услуга',
    clear: 'Очистить',
    close: 'Закрыть поиск',
    cars: 'Автомобили',
    brands: 'Марки',
    classes: 'Классы',
    services: 'Услуги',
    pages: 'Разделы сайта',
    recent: 'Вы искали',
    clearRecent: 'Очистить',
    popular: 'Популярные запросы',
    popularCars: 'Чаще всего бронируют',
    queries: ['Lamborghini', 'G-Class', 'электро', 'кабриолет', 'Rolls-Royce', 'внедорожник'],
    empty: (query: string) => `По запросу «${query}» ничего не нашлось`,
    emptyHint: 'Попробуйте марку («Porsche»), класс («спорткар») или тип («электро»).',
    allResults: (count: number) => `Все результаты в автопарке (${count})`,
    openFleet: 'Открыть автопарк',
    brandCount: (count: number) => `${count} авто`,
    hintMove: 'выбор',
    hintOpen: 'открыть',
    hintClose: 'закрыть',
    status: (count: number) => (count ? `Найдено результатов: ${count}` : 'Ничего не найдено'),
  },
  {
    title: 'Site search',
    placeholder: 'Make, model, class or service',
    clear: 'Clear',
    close: 'Close search',
    cars: 'Cars',
    brands: 'Makes',
    classes: 'Classes',
    services: 'Services',
    pages: 'Site sections',
    recent: 'Recent searches',
    clearRecent: 'Clear',
    popular: 'Popular searches',
    popularCars: 'Most booked',
    queries: ['Lamborghini', 'G-Class', 'electric', 'convertible', 'Rolls-Royce', 'SUV'],
    empty: (query: string) => `Nothing found for “${query}”`,
    emptyHint: 'Try a make (“Porsche”), a class (“sports car”) or a type (“electric”).',
    allResults: (count: number) => `All results in the fleet (${count})`,
    openFleet: 'Open the fleet',
    brandCount: (count: number) => `${count} ${count === 1 ? 'car' : 'cars'}`,
    hintMove: 'select',
    hintOpen: 'open',
    hintClose: 'close',
    status: (count: number) => (count ? `${count} results found` : 'Nothing found'),
  },
)

// --- Недавние запросы ----------------------------------------------------------------
const RECENT_KEY = 'drivelux:recent-searches'

function readRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string').slice(0, 5) : []
  } catch {
    return []
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
  } catch {
    // Без хранилища недавние запросы просто не запомнятся
  }
}

// Самые востребованные машины — первые места рекомендуемой сортировки
const POPULAR_CARS = [...VEHICLES].sort((a, b) => a.rank - b.rank).slice(0, 4)

// Пункт результатов: всё, что нужно для подсветки, перехода и отрисовки
interface Option {
  id: string
  href: string
  group: string
  render: ReactNode
}

interface SiteSearchProps {
  open: boolean
  onClose: () => void
}

export function SiteSearch({ open, onClose }: SiteSearchProps) {
  const lang = useLang()
  const text = TEXT[lang]
  const navigate = useNavigate()
  const location = useLocation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const baseId = useId()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState<string[]>(readRecent)

  // --- Открытие и закрытие --------------------------------------------------------------
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      setQuery('')
      setActive(-1)
      setRecent(readRecent())
      requestAnimationFrame(() => inputRef.current?.focus())
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const trimmed = query.trim()
  const results = useMemo(() => searchSite(trimmed, lang), [trimmed, lang])

  // --- Пункты списка ------------------------------------------------------------------
  // Плоский список всех пунктов во всех группах — по нему ходят стрелки
  const groups: { title: string; options: Option[]; icon?: ReactNode }[] = []

  if (trimmed) {
    if (results.cars.length) {
      groups.push({
        title: text.cars,
        options: results.cars.slice(0, 6).map((car) => ({
          id: `car-${car.id}`,
          href: vehicleHref(car.id),
          group: 'cars',
          render: <CarRow car={car} />,
        })),
      })
    }
    if (results.brands.length || results.classes.length) {
      groups.push({
        title: `${text.brands} · ${text.classes}`,
        options: [
          ...results.brands.map((key) => {
            const brand = BRANDS.find((item) => item.id === key)
            return {
              id: `brand-${key}`,
              href: `${ROUTES.fleet}?brand=${key}`,
              group: 'brands',
              render: (
                <Row
                  icon={
                    brand?.logo ? (
                      <SimpleIcon className={styles.logo} path={BRAND_PATHS[brand.logo]} />
                    ) : (
                      <CarFront size={18} strokeWidth={1.5} />
                    )
                  }
                  title={<span translate="no">{BRAND_NAMES[key]}</span>}
                  note={text.brandCount(VEHICLES.filter((item) => item.brand === key).length)}
                />
              ),
            }
          }),
          ...results.classes.map((key) => ({
            id: `class-${key}`,
            href: classHref(key),
            group: 'classes',
            render: (
              <Row
                icon={<Layers size={18} strokeWidth={1.5} />}
                title={CLASS_TITLES[lang][key]}
                note={`${CLASS_NOTES[lang][key]} · ${text.brandCount(VEHICLES.filter((item) => item.class === key).length)}`}
              />
            ),
          })),
        ],
      })
    }
    if (results.services.length) {
      groups.push({
        title: text.services,
        options: results.services.map((service) => ({
          id: `service-${service.slug}`,
          href: service.href,
          group: 'services',
          render: <Row icon={<Sparkles size={18} strokeWidth={1.5} />} title={service.title} note={service.tagline} />,
        })),
      })
    }
    if (results.pages.length) {
      groups.push({
        title: text.pages,
        options: results.pages.map((page) => ({
          id: `page-${page.id}`,
          href: page.href,
          group: 'pages',
          render: (
            <Row icon={<FileText size={18} strokeWidth={1.5} />} title={page.title[lang]} note={page.note[lang]} />
          ),
        })),
      })
    }
  } else {
    if (recent.length) {
      groups.push({
        title: text.recent,
        options: recent.map((item) => ({
          id: `recent-${item}`,
          href: `${ROUTES.fleet}?q=${encodeURIComponent(item)}`,
          group: 'recent',
          render: <Row icon={<Clock3 size={18} strokeWidth={1.5} />} title={item} />,
        })),
      })
    }
    groups.push({
      title: text.popularCars,
      options: POPULAR_CARS.map((car) => ({
        id: `popular-${car.id}`,
        href: vehicleHref(car.id),
        group: 'popular',
        render: <CarRow car={car} />,
      })),
    })
  }

  const options = groups.flatMap((group) => group.options)
  const optionId = (option: Option) => `${baseId}-${option.id}`
  const total =
    results.cars.length +
    results.brands.length +
    results.classes.length +
    results.services.length +
    results.pages.length

  // Подсвеченный пункт всегда виден в прокручиваемом списке
  useEffect(() => {
    if (active < 0) return
    const element = document.getElementById(`${baseId}-${options[active]?.id}`)
    element?.scrollIntoView({ block: 'nearest' })
  })

  // --- Действия ------------------------------------------------------------------------
  function remember(term: string) {
    const value = term.trim()
    if (!value) return
    const next = [value, ...recent.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5)
    setRecent(next)
    saveRecent(next)
  }

  // «#contacts» — место на текущей странице (подвал), с сохранением адреса
  // и фильтров каталога, как у ссылок SiteLink
  function go(href: string) {
    if (trimmed) remember(trimmed)
    onClose()
    if (href.startsWith('#')) navigate({ pathname: location.pathname, search: location.search, hash: href })
    else navigate(href)
  }

  function submit() {
    if (active >= 0 && options[active]) {
      go(options[active].href)
      return
    }
    go(trimmed ? `${ROUTES.fleet}?q=${encodeURIComponent(trimmed)}` : ROUTES.fleet)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!options.length) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current + step + options.length + (current < 0 && step < 0 ? 1 : 0)) % options.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      submit()
    } else if (event.key === 'Escape') {
      // Поле type="search" по Esc само стирает текст и не даёт окну
      // закрыться — закрываем окно с первого нажатия, как ждёт человек
      event.preventDefault()
      onClose()
    }
  }

  function clearRecent() {
    setRecent([])
    saveRecent([])
    inputRef.current?.focus()
  }

  let index = -1

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={text.title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.panel}>
        {/* --- Поле ------------------------------------------------------------------ */}
        <div className={styles.field}>
          <Search className={styles.fieldIcon} size={20} strokeWidth={1.6} aria-hidden="true" />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            role="combobox"
            aria-label={text.title}
            aria-expanded="true"
            aria-controls={`${baseId}-list`}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 && options[active] ? optionId(options[active]) : undefined}
            placeholder={text.placeholder}
            autoComplete="off"
            enterKeyHint="search"
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(-1)
            }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              className={styles.clear}
              type="button"
              onClick={() => {
                setQuery('')
                setActive(-1)
                inputRef.current?.focus()
              }}
            >
              {text.clear}
            </button>
          )}
          <button className={styles.close} type="button" aria-label={text.close} onClick={onClose}>
            <X size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        {/* --- Популярные запросы ------------------------------------------------------- */}
        {!trimmed && (
          <div className={styles.chipsBlock}>
            <p className={styles.groupTitle}>{text.popular}</p>
            <ul className={styles.chips}>
              {text.queries.map((item) => (
                <li key={item}>
                  <button
                    className={styles.chip}
                    type="button"
                    onClick={() => {
                      setQuery(item)
                      setActive(-1)
                      inputRef.current?.focus()
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            {recent.length > 0 && (
              <button className={styles.clearRecent} type="button" onClick={clearRecent}>
                {text.recent}: {text.clearRecent.toLowerCase()}
              </button>
            )}
          </div>
        )}

        {/* --- Результаты ---------------------------------------------------------------- */}
        <div ref={listRef} className={styles.results} id={`${baseId}-list`} role="listbox" aria-label={text.title}>
          {trimmed && options.length === 0 ? (
            <div className={styles.empty} role="presentation">
              <p className={styles.emptyTitle}>{text.empty(trimmed)}</p>
              <p className={styles.emptyText}>{text.emptyHint}</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.title} className={styles.group} role="group" aria-label={group.title}>
                <p className={styles.groupTitle} aria-hidden="true">
                  {group.title}
                </p>
                <ul className={styles.options} role="presentation">
                  {group.options.map((option) => {
                    index += 1
                    const current = index
                    return (
                      <li
                        key={option.id}
                        id={optionId(option)}
                        className={styles.option}
                        role="option"
                        aria-selected={current === active}
                        onPointerMove={() => current !== active && setActive(current)}
                        onClick={() => go(option.href)}
                      >
                        {option.render}
                        <ArrowRight className={styles.optionArrow} size={16} strokeWidth={1.6} aria-hidden="true" />
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* --- Низ окна ------------------------------------------------------------------- */}
        <div className={styles.footer}>
          <button
            className={styles.all}
            type="button"
            onClick={() => go(trimmed ? `${ROUTES.fleet}?q=${encodeURIComponent(trimmed)}` : ROUTES.fleet)}
          >
            <CarFront size={16} strokeWidth={1.6} aria-hidden="true" />
            {trimmed ? text.allResults(results.cars.length) : text.openFleet}
            <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </button>
          <p className={styles.hints} aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> {text.hintMove}
            </span>
            <span>
              <kbd>
                <CornerDownLeft size={11} strokeWidth={2} />
              </kbd>{' '}
              {text.hintOpen}
            </span>
            <span>
              <kbd>Esc</kbd> {text.hintClose}
            </span>
          </p>
        </div>

        <p className="visually-hidden" role="status">
          {trimmed ? text.status(total) : ''}
        </p>
      </div>
    </dialog>
  )
}

// --- Строки результатов --------------------------------------------------------------------
function Row({ icon, title, note }: { icon: ReactNode; title: ReactNode; note?: string }) {
  return (
    <>
      <span className={styles.rowIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.rowText}>
        <span className={styles.rowTitle}>{title}</span>
        {note && <span className={styles.rowNote}>{note}</span>}
      </span>
    </>
  )
}

function CarRow({ car }: { car: (typeof VEHICLES)[number] }) {
  const lang = useLang()
  return (
    <>
      <span className={styles.thumb} aria-hidden="true">
        {car.photos[0] ? (
          <img src={car.photos[0].small} alt="" loading="lazy" decoding="async" />
        ) : (
          <CarFront size={18} strokeWidth={1.2} />
        )}
      </span>
      <span className={styles.rowText}>
        <span className={styles.rowTitle} translate="no">
          {car.name}
        </span>
        <span className={styles.rowNote}>
          {CLASS_LABELS[lang][car.class]} · {car.year} · {car.power} {UNITS[lang].hp}
        </span>
      </span>
      <span className={styles.price}>
        {formatEuro(car.pricePerDay, lang)}
        <span className={styles.priceUnit}> {UNITS[lang].perDay}</span>
      </span>
    </>
  )
}
