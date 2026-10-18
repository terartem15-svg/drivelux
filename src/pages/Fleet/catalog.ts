import {
  BODY_LABELS,
  BODY_ORDER,
  BRAND_OPTIONS,
  CLASS_LABELS,
  CLASS_ORDER,
  FUEL_LABELS,
  FUEL_ORDER,
  POWER_BOUNDS,
  PRICE_BOUNDS,
  SEATS_OPTIONS,
  seatsKey,
  SORT_OPTIONS,
  TRANSMISSION_LABELS,
  TRANSMISSION_ORDER,
  type SeatsKey,
  type SortKey,
} from '@/content/fleet'
import {
  BRAND_NAMES,
  type BodyType,
  type BrandKey,
  type Fuel,
  type Transmission,
  type Vehicle,
  type VehicleClass,
} from '@/content/vehicles'
import type { Lang } from '@/i18n/lang'
import { formatEuro } from '@/utils/price'
import { vehicleMatchScore } from '@/content/vehicleSearch'
import { words } from '@/utils/search'

// Логика каталога без React: состояние фильтров, его запись в адрес
// страницы и обратно, отбор, счётчики вариантов и сортировка. Всё считается
// на клиенте по локальному массиву машин — сервера нет.

// --- Состояние ------------------------------------------------------------------------
// Группы с мультивыбором хранят выбранные ключи; диапазон null — «любой»
// (ползунок стоит на границах парка). Внутри группы варианты складываются
// через «или» (BMW или Audi), группы между собой — через «и»
export interface Filters {
  query: string
  brand: BrandKey[]
  class: VehicleClass[]
  body: BodyType[]
  gearbox: Transmission[]
  fuel: Fuel[]
  seats: SeatsKey[]
  price: [number, number] | null
  power: [number, number] | null
  awd: boolean
}

export type ListGroup = 'brand' | 'class' | 'body' | 'gearbox' | 'fuel' | 'seats'
export type RangeGroup = 'price' | 'power'

export const EMPTY_FILTERS: Filters = {
  query: '',
  brand: [],
  class: [],
  body: [],
  gearbox: [],
  fuel: [],
  seats: [],
  price: null,
  power: null,
  awd: false,
}

// Допустимые значения каждой группы — по ним проверяется адрес: ключ,
// которого нет в справочнике (/fleet?brand=yugo), просто отбрасывается
export const GROUP_KEYS: { [G in ListGroup]: readonly Filters[G][number][] } = {
  brand: BRAND_OPTIONS.map((option) => option.key),
  class: CLASS_ORDER,
  body: BODY_ORDER,
  gearbox: TRANSMISSION_ORDER,
  fuel: FUEL_ORDER,
  seats: SEATS_OPTIONS.map((option) => option.key),
}

export const LIST_GROUPS = Object.keys(GROUP_KEYS) as ListGroup[]

export const RANGE_BOUNDS: Record<RangeGroup, [number, number]> = {
  price: PRICE_BOUNDS,
  power: POWER_BOUNDS,
}

// Подпись варианта на языке сайта — для фильтров и тегов активных фильтров
export function optionLabel(group: ListGroup, key: string, lang: Lang): string {
  switch (group) {
    case 'brand':
      return BRAND_NAMES[key as BrandKey]
    case 'class':
      return CLASS_LABELS[lang][key as VehicleClass]
    case 'body':
      return BODY_LABELS[lang][key as BodyType]
    case 'gearbox':
      return TRANSMISSION_LABELS[lang][key as Transmission].full
    case 'fuel':
      return FUEL_LABELS[lang][key as Fuel]
    case 'seats':
      return SEATS_OPTIONS.find((option) => option.key === key)?.label[lang] ?? key
  }
}

// --- Адрес страницы -------------------------------------------------------------------
// /fleet?q=urus&brand=bmw,audi&price=100-300&awd=1&sort=price-asc
// Пустые группы и сортировка по умолчанию в адрес не пишутся — у каталога
// без фильтров чистый адрес /fleet. Порядок ключей фиксирован, чтобы один
// и тот же отбор всегда давал одну и ту же строку
const DEFAULT_SORT: SortKey = 'recommended'

export function parseSearch(search: string): { filters: Filters; sort: SortKey } {
  const params = new URLSearchParams(search)
  const filters: Filters = { ...EMPTY_FILTERS, query: (params.get('q') ?? '').slice(0, 60) }

  // Порядок выбранных вариантов — как в справочнике, без повторов
  const lists = filters as unknown as Record<ListGroup, string[]>
  for (const group of LIST_GROUPS) {
    const values = (params.get(group) ?? '').split(',')
    lists[group] = (GROUP_KEYS[group] as readonly string[]).filter((key) => values.includes(key))
  }

  filters.price = parseRange(params.get('price'), RANGE_BOUNDS.price)
  filters.power = parseRange(params.get('power'), RANGE_BOUNDS.power)
  filters.awd = params.get('awd') === '1'

  const sortParam = params.get('sort')
  const sort = SORT_OPTIONS.some((option) => option.key === sortParam) ? (sortParam as SortKey) : DEFAULT_SORT
  return { filters, sort }
}

// «100-300» → [100, 300] в пределах парка; диапазон во всю ширину — null
function parseRange(value: string | null, [min, max]: [number, number]): [number, number] | null {
  const match = value?.match(/^(\d+)-(\d+)$/)
  if (!match) return null
  const from = Math.min(Math.max(Number(match[1]), min), max)
  const to = Math.min(Math.max(Number(match[2]), min), max)
  return normalizeRange([Math.min(from, to), Math.max(from, to)], [min, max])
}

export function normalizeRange(range: [number, number], [min, max]: [number, number]): [number, number] | null {
  return range[0] <= min && range[1] >= max ? null : range
}

export function toSearch(filters: Filters, sort: SortKey): string {
  const params = new URLSearchParams()
  const query = filters.query.trim()
  if (query) params.set('q', query)
  for (const group of LIST_GROUPS) {
    if (filters[group].length) params.set(group, filters[group].join(','))
  }
  if (filters.price) params.set('price', filters.price.join('-'))
  if (filters.power) params.set('power', filters.power.join('-'))
  if (filters.awd) params.set('awd', '1')
  if (sort !== DEFAULT_SORT) params.set('sort', sort)
  const search = params.toString()
  return search ? `?${search}` : ''
}

// --- Поиск ------------------------------------------------------------------------------
// Правило поиска общее с поиском в шапке (content/vehicleSearch): марка,
// модель и русское написание марки, а с двух букв — ещё класс, кузов,
// топливо, привод и год. «мерс s» → Mercedes-Benz S-Class и SL 63, «ренж» →
// оба Range Rover, «электро» → все электромобили
function matchesQuery(item: Vehicle, queryWords: string[]) {
  return vehicleMatchScore(item, queryWords) !== null
}

// --- Отбор ------------------------------------------------------------------------------
// skip — группа, которую не учитывать: так считаются счётчики вариантов
// («сколько машин будет, если отметить ещё и эту марку»)
type Skippable = ListGroup | RangeGroup | 'awd'

function valueOf(item: Vehicle, group: ListGroup): string | undefined {
  switch (group) {
    case 'brand':
      return item.brand
    case 'class':
      return item.class
    case 'body':
      return item.body
    case 'gearbox':
      return item.transmission
    case 'fuel':
      return item.fuel
    case 'seats':
      return seatsKey(item.seats)
  }
}

export function matches(item: Vehicle, filters: Filters, skip?: Skippable): boolean {
  if (!matchesQuery(item, words(filters.query))) return false
  for (const group of LIST_GROUPS) {
    if (group === skip || !filters[group].length) continue
    const value = valueOf(item, group)
    if (!value || !(filters[group] as string[]).includes(value)) return false
  }
  if (skip !== 'price' && filters.price) {
    if (item.pricePerDay < filters.price[0] || item.pricePerDay > filters.price[1]) return false
  }
  if (skip !== 'power' && filters.power) {
    if (item.power < filters.power[0] || item.power > filters.power[1]) return false
  }
  if (skip !== 'awd' && filters.awd && item.drive !== 'awd') return false
  return true
}

// Счётчики вариантов группы: сколько машин подойдёт при остальных фильтрах.
// Вариант с нулём остаётся в списке, но приглушён — видно, что в этом
// отборе таких машин нет
export function facetCounts(vehicles: Vehicle[], filters: Filters, group: ListGroup): Map<string, number> {
  const counts = new Map<string, number>()
  for (const item of vehicles) {
    if (!matches(item, filters, group)) continue
    const value = valueOf(item, group)
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return counts
}

export function countWithout(vehicles: Vehicle[], filters: Filters, skip: Skippable) {
  return vehicles.filter((item) => matches(item, filters, skip)).length
}

// Варианты, которые есть в парке: «Эконом» или «Механика» показываются в
// фильтре, только если такие машины вообще есть в данных
export function presentKeys<G extends ListGroup>(vehicles: Vehicle[], group: G): Filters[G] {
  const present = new Set(vehicles.map((item) => valueOf(item, group)))
  return (GROUP_KEYS[group] as string[]).filter((key) => present.has(key)) as Filters[G]
}

// --- Сортировка -------------------------------------------------------------------------
// При равенстве — по рекомендуемому порядку, чтобы выдача не «прыгала»
export function sortVehicles(list: Vehicle[], sort: SortKey): Vehicle[] {
  const byRank = (a: Vehicle, b: Vehicle) => a.rank - b.rank
  const compare: Record<SortKey, (a: Vehicle, b: Vehicle) => number> = {
    recommended: byRank,
    'price-asc': (a, b) => a.pricePerDay - b.pricePerDay || byRank(a, b),
    'price-desc': (a, b) => b.pricePerDay - a.pricePerDay || byRank(a, b),
    power: (a, b) => b.power - a.power || byRank(a, b),
    year: (a, b) => b.year - a.year || byRank(a, b),
  }
  return [...list].sort(compare[sort])
}

// --- Активные фильтры ---------------------------------------------------------------------
// Теги над выдачей: каждый выбранный вариант, диапазон и поиск — отдельный
// тег с крестиком
export type Chip =
  | { kind: 'list'; group: ListGroup; key: string; label: string }
  | { kind: 'range'; group: RangeGroup; label: string }
  | { kind: 'awd'; label: string }
  | { kind: 'query'; label: string }

export function activeChips(filters: Filters, lang: Lang): Chip[] {
  const chips: Chip[] = []
  const query = filters.query.trim()
  if (query) chips.push({ kind: 'query', label: lang === 'ru' ? `«${query}»` : `“${query}”` })
  for (const group of LIST_GROUPS) {
    for (const key of filters[group] as string[]) {
      chips.push({ kind: 'list', group, key, label: optionLabel(group, key, lang) })
    }
  }
  if (filters.price) {
    const [from, to] = filters.price
    chips.push({ kind: 'range', group: 'price', label: `${formatEuro(from, lang)} – ${formatEuro(to, lang)}` })
  }
  if (filters.power) {
    const unit = lang === 'ru' ? 'л.с.' : 'hp'
    chips.push({ kind: 'range', group: 'power', label: `${filters.power[0]}–${filters.power[1]} ${unit}` })
  }
  if (filters.awd) chips.push({ kind: 'awd', label: lang === 'ru' ? 'Полный привод' : 'All-wheel drive' })
  return chips
}
