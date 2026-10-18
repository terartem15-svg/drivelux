import { ChevronDown, LayoutGrid, Rows3, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { VehicleCard } from '@/components/VehicleCard/VehicleCard'
import { CLASS_TITLES, FLEET_PAGE, QUICK_CATEGORIES, SORT_OPTIONS, type SortKey } from '@/content/fleet'
import { ROUTES } from '@/content/site'
import { VEHICLES } from '@/content/vehicles'
import { localized, useLang, type Lang } from '@/i18n/lang'
import { plural } from '@/utils/format'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import { useMediaQuery } from '@/utils/useMediaQuery'
import { activeChips, countWithout, facetCounts } from './catalog'
import { FilterDrawer } from './FilterDrawer'
import { FilterPanel } from './FilterPanel'
import { useCatalog } from './useCatalog'
import { useViewMode } from './useViewMode'
import styles from './FleetPage.module.css'

// Страница «Автопарк» — каталог машин с поиском, фильтрами и сортировкой.
//
// Сверху — крошки, заголовок, поиск по марке и модели и быстрые категории.
// Ниже на десктопе две колонки: фильтры слева, выдача справа; на планшете
// и телефоне фильтры уезжают в выдвижную панель за кнопкой «Фильтры».
// Над выдачей — число найденных машин, сортировка, вид (сетка или список)
// и теги выбранных фильтров с крестиками.
//
// Карточки выдаются партиями на три полных ряда: по 9 при трёх колонках,
// по 8 при двух и в списке, по 6 на телефоне. «Показать ещё» добавляет
// следующую партию и переводит фокус на первую новую карточку — с
// клавиатуры не нужно проходить заново весь список.
//
// Состояние — в useCatalog: оно же пишет отбор в адрес страницы
const DESKTOP = '(min-width: 1024px)'
const WIDE = '(min-width: 1280px)'
const PHONE = '(max-width: 640px)'

const TEXT = localized(
  {
    home: 'Главная',
    all: 'Все',
    categories: 'Категории автомобилей',
    filters: 'Фильтры',
    selected: ', выбрано ',
    cars: 'Автомобили',
    sort: 'Сортировка',
    view: 'Вид каталога',
    grid: 'Сеткой',
    list: 'Списком',
    chosen: 'Выбранные фильтры',
    removeChip: (label: string) => `Убрать фильтр: ${label}`,
    reset: 'Сбросить фильтры',
    resetShort: 'Сбросить',
    shown: (shown: number, total: number) => `Показано ${shown} из ${total}`,
    more: (count: number) => `Показать ещё ${count}`,
    emptyTitle: 'Автомобили не найдены',
    emptyText:
      'Под выбранные условия в автопарке нет машин. Уберите часть фильтров или сбросьте их — подберём из всего парка.',
    clearSearch: 'Очистить поиск',
    show: 'Показать',
  },
  {
    home: 'Home',
    all: 'All',
    categories: 'Car categories',
    filters: 'Filters',
    selected: ', selected ',
    cars: 'Cars',
    sort: 'Sort',
    view: 'Catalogue view',
    grid: 'Grid',
    list: 'List',
    chosen: 'Selected filters',
    removeChip: (label: string) => `Remove filter: ${label}`,
    reset: 'Reset filters',
    resetShort: 'Reset',
    shown: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    more: (count: number) => `Show ${count} more`,
    emptyTitle: 'No cars found',
    emptyText: 'No cars in the fleet match these filters. Remove some of them or reset — we will pick from the whole fleet.',
    clearSearch: 'Clear search',
    show: 'Show',
  },
)

function foundLabel(count: number, lang: Lang) {
  if (lang === 'en') return { verb: 'Found', noun: count === 1 ? 'car' : 'cars' }
  const verb = plural(count, { one: 'Найден', few: 'Найдено', many: 'Найдено' }, lang)
  const noun = plural(count, { one: 'автомобиль', few: 'автомобиля', many: 'автомобилей' }, lang)
  return { verb, noun }
}

export function FleetPage() {
  const lang = useLang()
  const text = TEXT[lang]
  const page = FLEET_PAGE[lang]
  useDocumentTitle(page.title)
  const { filters, sort, pages, results, dispatch } = useCatalog()
  const [view, setView] = useViewMode()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isDesktop = useMediaQuery(DESKTOP)
  const isWide = useMediaQuery(WIDE)
  const isPhone = useMediaQuery(PHONE)

  // Окно растянули до десктопа с открытой панелью — панель исчезает вместе
  // с кнопкой, и при обратном сужении не должна открыться сама
  if (isDesktop && drawerOpen) setDrawerOpen(false)

  // На телефоне строка списка — та же карточка, только теснее: всегда сетка
  const layout = isPhone ? 'grid' : view
  const pageSize = isPhone ? 6 : layout === 'grid' && isWide ? 9 : 8
  const shown = pages * pageSize
  const chips = activeChips(filters, lang)
  const visible = results.slice(0, shown)
  const { verb, noun } = foundLabel(results.length, lang)

  // --- Быстрые категории ----------------------------------------------------------------
  // Число у категории — сколько машин этого класса подходит под остальные
  // фильтры; у «Все» — сколько всего без учёта класса
  const classCounts = useMemo(() => facetCounts(VEHICLES, filters, 'class'), [filters])
  const allCount = useMemo(() => countWithout(VEHICLES, filters, 'class'), [filters])

  // --- Фокус после «Показать ещё» ---------------------------------------------------------
  const listRef = useRef<HTMLUListElement>(null)
  const focusFrom = useRef<number | null>(null)

  useEffect(() => {
    if (focusFrom.current === null) return
    const link = listRef.current?.children[focusFrom.current]?.querySelector<HTMLElement>('h3 a')
    focusFrom.current = null
    link?.focus()
  }, [shown])

  function showMore() {
    focusFrom.current = shown
    dispatch({ type: 'more' })
  }

  function reset() {
    dispatch({ type: 'reset' })
  }

  const filterCount = chips.filter((chip) => chip.kind !== 'query').length

  return (
    <>
      <PageHeader
        crumbs={[{ label: text.home, href: ROUTES.home }, { label: page.title }]}
        title={page.title}
        lead={page.lead}
        aside={
          <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
            <Search className={styles.searchIcon} size={18} strokeWidth={1.6} aria-hidden="true" />
            <input
              className={styles.searchInput}
              type="search"
              aria-label={page.searchLabel}
              placeholder={page.searchPlaceholder}
              autoComplete="off"
              enterKeyHint="search"
              value={filters.query}
              onChange={(event) => dispatch({ type: 'query', value: event.target.value })}
            />
            {filters.query && (
              <button
                className={styles.searchClear}
                type="button"
                aria-label={text.clearSearch}
                onClick={() => dispatch({ type: 'query', value: '' })}
              >
                <X size={16} strokeWidth={1.8} aria-hidden="true" />
              </button>
            )}
          </form>
        }
      >
        {/* Быстрые категории — кнопки-переключатели (aria-pressed): это
            фильтр по классу, а не вкладки с разным содержимым */}
        <div className={styles.categories} role="group" aria-label={text.categories}>
          {QUICK_CATEGORIES.map((category) => {
            const active =
              category === null ? filters.class.length === 0 : filters.class.length === 1 && filters.class[0] === category
            const count = category === null ? allCount : (classCounts.get(category) ?? 0)
            return (
              <button
                key={category ?? 'all'}
                className={styles.category}
                type="button"
                aria-pressed={active}
                onClick={() => dispatch({ type: 'category', value: category })}
              >
                {category === null ? text.all : CLASS_TITLES[lang][category]}
                <span className={styles.categoryCount}>{count}</span>
              </button>
            )
          })}
        </div>
      </PageHeader>

      <div className={`container ${styles.layout}`}>
        {isDesktop && (
          <aside className={styles.sidebar} aria-label={text.filters}>
            <FilterPanel filters={filters} dispatch={dispatch} />
          </aside>
        )}

        <section className={styles.results} aria-labelledby="results-title">
          <h2 className="visually-hidden" id="results-title">
            {text.cars}
          </h2>

          {/* --- Панель над выдачей ------------------------------------------------- */}
          <div className={styles.toolbar}>
            <p className={styles.found} role="status">
              {verb} <span className={styles.foundNumber}>{results.length}</span> {noun}
            </p>

            <div className={styles.controls}>
              {!isDesktop && (
                <button className={styles.filtersButton} type="button" onClick={() => setDrawerOpen(true)}>
                  <SlidersHorizontal size={18} strokeWidth={1.6} aria-hidden="true" />
                  {text.filters}
                  {filterCount > 0 && (
                    <span className={styles.filtersBadge}>
                      <span className="visually-hidden">{text.selected}</span>
                      {filterCount}
                    </span>
                  )}
                </button>
              )}

              <label className={styles.sort}>
                <span className="visually-hidden">{text.sort}</span>
                <select
                  className={styles.sortSelect}
                  value={sort}
                  onChange={(event) => dispatch({ type: 'sort', value: event.target.value as SortKey })}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label[lang]}
                    </option>
                  ))}
                </select>
                <ChevronDown className={styles.sortChevron} size={16} strokeWidth={1.75} aria-hidden="true" />
              </label>

              {!isPhone && (
                <div className={styles.viewToggle} role="group" aria-label={text.view}>
                  <button
                    className={styles.viewButton}
                    type="button"
                    aria-pressed={view === 'grid'}
                    aria-label={text.grid}
                    onClick={() => setView('grid')}
                  >
                    <LayoutGrid size={18} strokeWidth={1.6} aria-hidden="true" />
                  </button>
                  <button
                    className={styles.viewButton}
                    type="button"
                    aria-pressed={view === 'list'}
                    aria-label={text.list}
                    onClick={() => setView('list')}
                  >
                    <Rows3 size={18} strokeWidth={1.6} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --- Выбранные фильтры ------------------------------------------------------ */}
          {chips.length > 0 && (
            <div className={styles.chips}>
              <ul className={styles.chipList} aria-label={text.chosen}>
                {chips.map((chip) => (
                  <li key={`${chip.kind}-${'group' in chip ? chip.group : ''}-${chip.label}`}>
                    <button
                      className={styles.chip}
                      type="button"
                      aria-label={text.removeChip(chip.label)}
                      onClick={() => dispatch({ type: 'remove', chip })}
                    >
                      {chip.label}
                      <X size={14} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <button className={styles.resetLink} type="button" onClick={reset}>
                {text.reset}
              </button>
            </div>
          )}

          {/* --- Выдача ------------------------------------------------------------------ */}
          {results.length > 0 ? (
            <>
              <ul ref={listRef} className={layout === 'list' ? styles.list : styles.grid}>
                {visible.map((vehicle, index) => (
                  <li key={`${layout}-${vehicle.id}`}>
                    <VehicleCard vehicle={vehicle} layout={layout} order={index % pageSize} />
                  </li>
                ))}
              </ul>

              {results.length > shown && (
                <div className={styles.more}>
                  <p className={styles.moreNote}>{text.shown(shown, results.length)}</p>
                  <Button variant="ghost" onClick={showMore}>
                    {text.more(Math.min(pageSize, results.length - shown))}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              headingLevel="h3"
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
        </section>
      </div>

      {!isDesktop && (
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={reset} disabled={chips.length === 0}>
                {text.resetShort}
              </Button>
              <Button className={styles.drawerApply} onClick={() => setDrawerOpen(false)}>
                {text.show} {results.length} {noun}
              </Button>
            </>
          }
        >
          <FilterPanel filters={filters} dispatch={dispatch} />
        </FilterDrawer>
      )}
    </>
  )
}
