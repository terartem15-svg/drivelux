import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useLocation, useNavigate, type Location } from 'react-router'
import type { SortKey } from '@/content/fleet'
import { VEHICLES, type VehicleClass } from '@/content/vehicles'
import {
  EMPTY_FILTERS,
  matches,
  normalizeRange,
  parseSearch,
  RANGE_BOUNDS,
  sortVehicles,
  toSearch,
  type Chip,
  type Filters,
  type ListGroup,
  type RangeGroup,
} from './catalog'

// Состояние каталога: фильтры, сортировка и сколько партий карточек
// показано (pages). Размер партии зависит от ширины экрана и задаётся
// страницей: так ряды всегда полные — 9 при трёх колонках, 8 при двух.
//
// Источник правды — состояние React: выдача пересчитывается сразу, без
// ожидания адреса. Адрес страницы — его копия: каталог переписывает его
// (replace, без новой записи в истории), чтобы отбором можно было
// поделиться ссылкой, а «Назад» со страницы машины вернул тот же отбор и
// то же число показанных партий (оно хранится в state записи истории).
// Набор текста и перетаскивание ползунка пишутся в адрес с паузой 300 мс:
// иначе каждая буква и каждый пиксель ползунка дёргали бы историю браузера
// (Safari ограничивает такие вызовы и начинает выдавать ошибку). Клики по
// вариантам пишутся сразу — чтобы переход на машину сразу после клика не
// унёс старый адрес.
//
// Обратное направление: если адрес поменялся не каталогом (пункт меню
// «Автопарк» на этой же странице, «Назад»/«Вперёд»), состояние загружается
// из адреса заново
interface CatalogState {
  filters: Filters
  sort: SortKey
  pages: number
  // Последнее изменение — набор текста или ползунок: адрес пишется с паузой
  gradual: boolean
}

export type CatalogAction =
  | { type: 'toggle'; group: ListGroup; key: string }
  | { type: 'range'; group: RangeGroup; value: [number, number] }
  | { type: 'query'; value: string }
  | { type: 'awd'; value: boolean }
  | { type: 'category'; value: VehicleClass | null }
  | { type: 'remove'; chip: Chip }
  | { type: 'reset' }
  | { type: 'sort'; value: SortKey }
  | { type: 'more' }
  | { type: 'load'; state: CatalogState }

function init(location: Location): CatalogState {
  const { filters, sort } = parseSearch(location.search)
  const saved = (location.state as { pages?: unknown } | null)?.pages
  const pages = typeof saved === 'number' && Number.isInteger(saved) && saved > 1 ? Math.min(saved, 20) : 1
  return { filters, sort, pages, gradual: false }
}

// Любое изменение отбора возвращает выдачу к первой партии карточек
function withFilters(state: CatalogState, filters: Filters, gradual = false): CatalogState {
  return { ...state, filters, pages: 1, gradual }
}

function reducer(state: CatalogState, action: CatalogAction): CatalogState {
  const { filters } = state
  switch (action.type) {
    case 'toggle': {
      const list = filters[action.group] as string[]
      const next = list.includes(action.key) ? list.filter((key) => key !== action.key) : [...list, action.key]
      return withFilters(state, { ...filters, [action.group]: next })
    }
    case 'range':
      return withFilters(
        state,
        { ...filters, [action.group]: normalizeRange(action.value, RANGE_BOUNDS[action.group]) },
        true,
      )
    case 'query':
      return withFilters(state, { ...filters, query: action.value }, true)
    case 'awd':
      return withFilters(state, { ...filters, awd: action.value })
    case 'category':
      return withFilters(state, { ...filters, class: action.value ? [action.value] : [] })
    case 'remove': {
      const { chip } = action
      if (chip.kind === 'query') return withFilters(state, { ...filters, query: '' })
      if (chip.kind === 'awd') return withFilters(state, { ...filters, awd: false })
      if (chip.kind === 'range') return withFilters(state, { ...filters, [chip.group]: null })
      const list = filters[chip.group] as string[]
      return withFilters(state, { ...filters, [chip.group]: list.filter((key) => key !== chip.key) })
    }
    case 'reset':
      return withFilters(state, EMPTY_FILTERS)
    case 'sort':
      return { ...state, sort: action.value, pages: 1, gradual: false }
    case 'more':
      return { ...state, pages: state.pages + 1, gradual: false }
    case 'load':
      return action.state
  }
}

const LAST_SEARCH_KEY = 'drivelux:fleet-search'

// Последний отбор каталога — для крошки «Автопарк» на странице машины:
// она возвращает к тем же фильтрам, а не к пустому каталогу
export function lastCatalogSearch() {
  try {
    return sessionStorage.getItem(LAST_SEARCH_KEY) ?? ''
  } catch {
    return ''
  }
}

export function useCatalog() {
  const location = useLocation()
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, location, init)
  const written = useRef({ search: location.search, pages: state.pages })

  // --- Адрес → состояние ------------------------------------------------------------
  useEffect(() => {
    if (location.search === written.current.search) return
    const next = init(location)
    written.current = { search: location.search, pages: next.pages }
    dispatch({ type: 'load', state: next })
  }, [location])

  // --- Состояние → адрес ------------------------------------------------------------
  const search = toSearch(state.filters, state.sort)
  const { pages, gradual } = state

  useEffect(() => {
    if (search === written.current.search && pages === written.current.pages) return
    const timer = setTimeout(
      () => {
        written.current = { search, pages }
        navigate({ search }, { replace: true, state: { pages }, preventScrollReset: true })
      },
      gradual ? 300 : 0,
    )
    return () => clearTimeout(timer)
  }, [search, pages, gradual, navigate])

  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_SEARCH_KEY, search)
    } catch {
      // Без sessionStorage крошка просто ведёт в каталог без фильтров
    }
  }, [search])

  // --- Выдача -------------------------------------------------------------------------
  const results = useMemo(
    () =>
      sortVehicles(
        VEHICLES.filter((item) => matches(item, state.filters)),
        state.sort,
      ),
    [state.filters, state.sort],
  )

  return { ...state, results, dispatch }
}
