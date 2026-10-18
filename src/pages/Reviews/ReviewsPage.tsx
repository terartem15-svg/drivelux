import { ChevronDown, MessageSquareQuote, Search, SearchX, Star, X } from 'lucide-react'
import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '@/components/Button/Button'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { CLASS_ORDER, CLASS_TITLES } from '@/content/fleet'
import { REVIEW_STATS, REVIEWS, type Review } from '@/content/reviews'
import { ROUTES } from '@/content/site'
import { getVehicle, type VehicleClass } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { ReviewCard, Stars } from '@/sections/Reviews/ReviewCard'
import { countLabel, formatDecimal, plural } from '@/utils/format'
import { words } from '@/utils/search'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import styles from './ReviewsPage.module.css'

// «Отзывы клиентов» — /reviews, сюда ведёт «Все отзывы» на главной.
//
// Сверху — сводка: средняя оценка, сколько отзывов, доля рекомендующих и
// распределение по звёздам (полоски — тоже фильтр: нажатие оставляет
// только отзывы с этой оценкой). Ниже — панель: оценка, класс машины,
// «только с ответом DriveLux», поиск по тексту и сортировка — новые,
// старые, популярные (по отметкам «Полезно»), с высокой и с низкой оценкой.
//
// Отбор живёт в адресе (/reviews?rating=5&class=sport&sort=popular): им
// можно поделиться, а «Назад» вернёт тот же отбор. Отметки «Полезно»
// хранятся в браузере (localStorage) и прибавляются к счётчику отзыва.
// Отзывы выдаются партиями по 8 — «Показать ещё» добавляет следующую
const PAGE_SIZE = 8

type SortKey = 'new' | 'old' | 'popular' | 'high' | 'low'
const SORTS: SortKey[] = ['new', 'old', 'popular', 'high', 'low']

const TEXT = localized(
  {
    title: 'Отзывы клиентов',
    home: 'Главная',
    lead: 'Впечатления тех, кто уже ездил с DriveLux: свадьбы и деловые поездки, суперкары на выходные и семейные внедорожники. Отзывы демонстрационные — сайт концепт для портфолио.',
    average: 'Средняя оценка',
    reviews: { one: 'отзыв', few: 'отзыва', many: 'отзывов' },
    recommend: (value: number) => `${value}% рекомендуют DriveLux`,
    distribution: 'Распределение оценок',
    stars: (value: number) => `${value} ${value === 1 ? 'звезда' : value < 5 ? 'звезды' : 'звёзд'}`,
    filterRating: 'Оценка',
    all: 'Все',
    classLabel: 'Класс машины',
    allClasses: 'Все классы',
    withReply: 'С ответом DriveLux',
    search: 'Поиск по отзывам',
    searchPlaceholder: 'Например, «свадьба» или «Шереметьево»',
    clearSearch: 'Очистить поиск',
    sortLabel: 'Сортировка',
    sorts: {
      new: 'Сначала новые',
      old: 'Сначала старые',
      popular: 'Популярные',
      high: 'С высокой оценкой',
      low: 'С низкой оценкой',
    },
    shown: (shown: number, total: number) => `Показано ${shown} из ${total}`,
    more: 'Показать ещё',
    reset: 'Сбросить фильтры',
    emptyTitle: 'Таких отзывов нет',
    emptyText: 'Под выбранные условия отзывов не нашлось. Уберите часть фильтров или сбросьте их.',
    list: 'Отзывы',
  },
  {
    title: 'Client reviews',
    home: 'Home',
    lead: 'Impressions from people who have already driven with DriveLux: weddings and business trips, weekend supercars and family SUVs. The reviews are for demonstration — this is a portfolio concept site.',
    average: 'Average rating',
    reviews: { one: 'review', few: 'reviews', many: 'reviews' },
    recommend: (value: number) => `${value}% recommend DriveLux`,
    distribution: 'Rating breakdown',
    stars: (value: number) => `${value} ${value === 1 ? 'star' : 'stars'}`,
    filterRating: 'Rating',
    all: 'All',
    classLabel: 'Car class',
    allClasses: 'All classes',
    withReply: 'With a DriveLux reply',
    search: 'Search reviews',
    searchPlaceholder: 'E.g. “wedding” or “Sheremetyevo”',
    clearSearch: 'Clear search',
    sortLabel: 'Sort',
    sorts: {
      new: 'Newest first',
      old: 'Oldest first',
      popular: 'Most helpful',
      high: 'Highest rating',
      low: 'Lowest rating',
    },
    shown: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    more: 'Show more',
    reset: 'Reset filters',
    emptyTitle: 'No such reviews',
    emptyText: 'No reviews match these filters. Remove some of them or reset.',
    list: 'Reviews',
  },
)

// --- Отметки «Полезно» -------------------------------------------------------------
const HELPFUL_KEY = 'drivelux:helpful-reviews'

function readHelpful(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(HELPFUL_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

let helpfulIds = readHelpful()
const helpfulListeners = new Set<() => void>()

function toggleHelpful(id: string) {
  helpfulIds = helpfulIds.includes(id) ? helpfulIds.filter((item) => item !== id) : [...helpfulIds, id]
  try {
    localStorage.setItem(HELPFUL_KEY, JSON.stringify(helpfulIds))
  } catch {
    // Отметка живёт до перезагрузки
  }
  helpfulListeners.forEach((listener) => listener())
}

function useHelpful() {
  return useSyncExternalStore(
    (listener) => {
      helpfulListeners.add(listener)
      return () => helpfulListeners.delete(listener)
    },
    () => helpfulIds,
  )
}

// Классы, у которых есть отзывы, — для фильтра
const CLASS_OF = (review: Review) => getVehicle(review.car)?.class
const CLASSES_WITH_REVIEWS = CLASS_ORDER.filter((key) => REVIEWS.some((review) => CLASS_OF(review) === key))

// Распределение оценок и доля рекомендующих (4 и 5 звёзд)
const DISTRIBUTION = [5, 4, 3, 2, 1].map((value) => ({
  value,
  count: REVIEWS.filter((review) => review.rating === value).length,
}))
const RECOMMEND = Math.round((REVIEWS.filter((review) => review.rating >= 4).length / REVIEWS.length) * 100)

export function ReviewsPage() {
  const lang = useLang()
  const text = TEXT[lang]
  useDocumentTitle(text.title)
  const [params, setParams] = useSearchParams()
  const helpful = useHelpful()
  const [pages, setPages] = useState(1)

  // --- Отбор из адреса -------------------------------------------------------------
  const ratingParam = Number(params.get('rating'))
  // Только целые 1–5: «?rating=2.5» из чужой ссылки иначе давал пустую выдачу
  const rating = Number.isInteger(ratingParam) && ratingParam >= 1 && ratingParam <= 5 ? ratingParam : null
  const classParam = params.get('class') as VehicleClass | null
  const carClass = classParam && CLASSES_WITH_REVIEWS.includes(classParam) ? classParam : null
  const sortParam = params.get('sort') as SortKey | null
  const sort: SortKey = sortParam && SORTS.includes(sortParam) ? sortParam : 'new'
  const withReply = params.get('reply') === '1'
  // Поиск по тексту — своё состояние поля, а в адрес он пишется с паузой
  // 300 мс: если писать каждую букву, быстрый набор терял бы символы, пока
  // адрес догоняет поле. Сброс и крестик меняют и поле, и адрес сразу
  const urlQuery = params.get('q') ?? ''
  const [query, setQuery] = useState(urlQuery)

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === '') next.delete(key)
      else next.set(key, value)
    }
    setPages(1)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  function reset() {
    setPages(1)
    setQuery('')
    setParams({}, { replace: true, preventScrollReset: true })
  }

  useEffect(() => {
    if (query === urlQuery) return
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(window.location.search)
      if (query) next.set('q', query)
      else next.delete('q')
      setParams(next, { replace: true, preventScrollReset: true })
    }, 300)
    return () => window.clearTimeout(timer)
  }, [query, urlQuery, setParams])

  const helpfulCount = (review: Review) => review.helpful + (helpful.includes(review.id) ? 1 : 0)

  // --- Выдача -------------------------------------------------------------------------
  const results = useMemo(() => {
    const queryWords = words(query)
    const filtered = REVIEWS.filter((review) => {
      if (rating && review.rating !== rating) return false
      if (carClass && CLASS_OF(review) !== carClass) return false
      if (withReply && !review.reply) return false
      if (queryWords.length) {
        const car = getVehicle(review.car)
        const haystack = words(
          `${review.text.ru} ${review.text.en} ${review.name.ru} ${review.name.en} ${car?.name ?? ''}`,
        )
        if (!queryWords.every((word) => haystack.some((item) => item.startsWith(word)))) return false
      }
      return true
    })
    const byDate = (a: Review, b: Review) => b.date.localeCompare(a.date)
    const compare: Record<SortKey, (a: Review, b: Review) => number> = {
      new: byDate,
      old: (a, b) => a.date.localeCompare(b.date),
      // По отметкам других посетителей, без своей: иначе отзыв прыгал бы по
      // списку прямо под курсором после нажатия «Полезно»
      popular: (a, b) => b.helpful - a.helpful || byDate(a, b),
      high: (a, b) => b.rating - a.rating || byDate(a, b),
      low: (a, b) => a.rating - b.rating || byDate(a, b),
    }
    return filtered.sort(compare[sort])
  }, [rating, carClass, withReply, query, sort])

  const shown = pages * PAGE_SIZE
  const visible = results.slice(0, shown)
  const filtered = Boolean(rating || carClass || withReply || query)

  return (
    <>
      <PageHeader
        crumbs={[{ label: text.home, href: ROUTES.home }, { label: text.title }]}
        title={text.title}
        lead={text.lead}
      />

      <div className={`container ${styles.body}`}>
        {/* --- Сводка ---------------------------------------------------------------------- */}
        <section className={styles.summary} aria-label={text.average} data-reveal>
          <div className={styles.score}>
            <p className={styles.scoreValue}>{formatDecimal(REVIEW_STATS.rating, lang)}</p>
            <div>
              <Stars rating={REVIEW_STATS.rating} size={18} />
              <p className={styles.scoreTotal}>{countLabel(REVIEW_STATS.total, text.reviews, lang)}</p>
              <p className={styles.recommend}>{text.recommend(RECOMMEND)}</p>
            </div>
          </div>

          <ul className={styles.bars} aria-label={text.distribution}>
            {DISTRIBUTION.map((item) => (
              <li key={item.value}>
                <button
                  className={styles.bar}
                  type="button"
                  aria-pressed={rating === item.value}
                  disabled={item.count === 0}
                  onClick={() => update({ rating: rating === item.value ? null : String(item.value) })}
                >
                  <span className={styles.barLabel}>
                    {item.value}
                    <Star size={12} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
                    <span className="visually-hidden"> — {text.stars(item.value)}</span>
                  </span>
                  <span className={styles.barTrack} aria-hidden="true">
                    <span
                      className={styles.barFill}
                      style={{ '--share': item.count / REVIEWS.length } as CSSProperties}
                    />
                  </span>
                  <span className={styles.barCount}>{item.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* --- Панель фильтров ------------------------------------------------------------ */}
        <div className={styles.toolbar} data-reveal>
          <div className={styles.ratingFilter} role="group" aria-label={text.filterRating}>
            <button
              className={styles.chip}
              type="button"
              aria-pressed={rating === null}
              onClick={() => update({ rating: null })}
            >
              {text.all}
            </button>
            {[5, 4, 3].map((value) => (
              <button
                key={value}
                className={styles.chip}
                type="button"
                aria-pressed={rating === value}
                onClick={() => update({ rating: rating === value ? null : String(value) })}
              >
                {value}
                <Star size={13} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
                <span className="visually-hidden"> — {text.stars(value)}</span>
              </button>
            ))}
          </div>

          <label className={styles.select}>
            <span className="visually-hidden">{text.classLabel}</span>
            <select value={carClass ?? ''} onChange={(event) => update({ class: event.target.value || null })}>
              <option value="">{text.allClasses}</option>
              {CLASSES_WITH_REVIEWS.map((key) => (
                <option key={key} value={key}>
                  {CLASS_TITLES[lang][key]}
                </option>
              ))}
            </select>
            <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
          </label>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={withReply}
              onChange={(event) => update({ reply: event.target.checked ? '1' : null })}
            />
            <MessageSquareQuote size={16} strokeWidth={1.6} aria-hidden="true" />
            {text.withReply}
          </label>

          <div className={styles.search} role="search">
            <Search size={16} strokeWidth={1.6} aria-hidden="true" />
            <input
              type="search"
              aria-label={text.search}
              placeholder={text.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPages(1)
              }}
            />
            {query && (
              <button
                type="button"
                aria-label={text.clearSearch}
                onClick={() => {
                  setQuery('')
                  update({ q: null })
                }}
              >
                <X size={14} strokeWidth={1.8} aria-hidden="true" />
              </button>
            )}
          </div>

          <label className={`${styles.select} ${styles.sort}`}>
            <span className="visually-hidden">{text.sortLabel}</span>
            <select
              value={sort}
              onChange={(event) => update({ sort: event.target.value === 'new' ? null : event.target.value })}
            >
              {SORTS.map((key) => (
                <option key={key} value={key}>
                  {text.sorts[key]}
                </option>
              ))}
            </select>
            <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
          </label>
        </div>

        <div className={styles.status}>
          <p role="status">
            <span className={styles.statusNumber}>{results.length}</span> {plural(results.length, text.reviews, lang)}
          </p>
          {filtered && (
            <button className={styles.reset} type="button" onClick={reset}>
              {text.reset}
            </button>
          )}
        </div>

        {/* --- Отзывы ---------------------------------------------------------------------- */}
        {results.length > 0 ? (
          <>
            <ul className={styles.grid} aria-label={text.list}>
              {visible.map((review, index) => (
                <li key={review.id} className={styles.item} style={{ '--order': index % PAGE_SIZE } as CSSProperties}>
                  <ReviewCard
                    review={review}
                    showReply
                    helpful={{
                      count: helpfulCount(review),
                      marked: helpful.includes(review.id),
                      onToggle: () => toggleHelpful(review.id),
                    }}
                  />
                </li>
              ))}
            </ul>
            {results.length > shown && (
              <div className={styles.more}>
                <p className={styles.moreNote}>{text.shown(shown, results.length)}</p>
                <Button variant="ghost" onClick={() => setPages((value) => value + 1)}>
                  {text.more}
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            headingLevel="h2"
            icon={<SearchX />}
            title={text.emptyTitle}
            text={text.emptyText}
            action={
              <Button onClick={reset} arrow>
                {text.reset}
              </Button>
            }
          />
        )}
      </div>
    </>
  )
}
