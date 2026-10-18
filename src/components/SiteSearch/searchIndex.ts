import { BRAND_OPTIONS, CLASS_LABELS, CLASS_ORDER, CLASS_TITLES } from '@/content/fleet'
import { serviceHref, SERVICES } from '@/content/services'
import { ROUTES } from '@/content/site'
import { BRAND_WORDS, vehicleMatchScore } from '@/content/vehicleSearch'
import { VEHICLES, type BrandKey, type Vehicle, type VehicleClass } from '@/content/vehicles'
import { LANGS, type Lang, type Localized } from '@/i18n/lang'
import { matchesWords, words } from '@/utils/search'

// Индекс поиска по сайту: машины, марки, классы, услуги и страницы. Всё
// считается в браузере по локальным данным — сервера нет.
//
// Машину находят по марке и модели (в том числе русским написанием марки:
// «мерседес», «рендж»), по классу, кузову, топливу и приводу на любом из
// двух языков («спорт», «suv», «электро», «кабриолет») и по году. Выше в
// выдаче — те, у кого совпали марка или модель, а не только класс

function bothLangs(map: Localized<Record<string, string>>, key: string) {
  return LANGS.map((lang) => map[lang][key]).join(' ')
}

// --- Машины -------------------------------------------------------------------------
// Правило совпадения — общее с каталогом (content/vehicleSearch): кнопка
// «Все результаты в автопарке» открывает каталог с теми же машинами
function searchCars(query: string[]): Vehicle[] {
  const scored: { vehicle: Vehicle; score: number }[] = []
  for (const vehicle of VEHICLES) {
    const score = vehicleMatchScore(vehicle, query)
    if (score !== null) scored.push({ vehicle, score })
  }
  return scored.sort((a, b) => b.score - a.score || a.vehicle.rank - b.vehicle.rank).map((item) => item.vehicle)
}

// --- Марки и классы -------------------------------------------------------------------
function searchBrands(query: string[]): BrandKey[] {
  return BRAND_OPTIONS.map((option) => option.key).filter((key) => matchesWords(query, BRAND_WORDS.get(key) ?? []))
}

const CLASS_WORDS = new Map<VehicleClass, string[]>(
  CLASS_ORDER.map((key) => [key, words(`${bothLangs(CLASS_LABELS, key)} ${bothLangs(CLASS_TITLES, key)}`)]),
)

function searchClasses(query: string[]): VehicleClass[] {
  return CLASS_ORDER.filter(
    (key) => VEHICLES.some((item) => item.class === key) && matchesWords(query, CLASS_WORDS.get(key) ?? []),
  )
}

// --- Услуги и страницы ----------------------------------------------------------------
export interface PageEntry {
  id: string
  href: string
  title: Localized<string>
  note: Localized<string>
  keywords: string
}

export const PAGES: PageEntry[] = [
  {
    id: 'fleet',
    href: ROUTES.fleet,
    title: { ru: 'Автопарк', en: 'Fleet' },
    note: { ru: 'Каталог с фильтрами', en: 'Catalogue with filters' },
    keywords: 'каталог машины автомобили catalogue cars fleet',
  },
  {
    id: 'booking',
    href: ROUTES.booking,
    title: { ru: 'Бронирование', en: 'Booking' },
    note: { ru: 'Даты, место и опции', en: 'Dates, place and extras' },
    keywords: 'забронировать бронь заказ аренда book booking rent reserve',
  },
  {
    id: 'services',
    href: ROUTES.services,
    title: { ru: 'Услуги', en: 'Services' },
    note: { ru: 'Доставка, водитель, долгосрочная аренда', en: 'Delivery, chauffeur, long-term rental' },
    keywords: 'услуги сервис services',
  },
  {
    id: 'about',
    href: ROUTES.about,
    title: { ru: 'О компании', en: 'About us' },
    note: { ru: 'История, философия и принципы', en: 'Story, philosophy and principles' },
    keywords: 'компания история философия принципы бренд команда about company story philosophy principles brand',
  },
  {
    id: 'loyalty',
    href: ROUTES.loyalty,
    title: { ru: 'Программа лояльности', en: 'Loyalty programme' },
    note: { ru: 'Скидки до 15%', en: 'Up to 15% off' },
    keywords: 'лояльность клуб скидка скидки бонусы loyalty club discount bonus',
  },
  {
    id: 'reviews',
    href: ROUTES.reviews,
    title: { ru: 'Отзывы клиентов', en: 'Client reviews' },
    note: { ru: 'Оценки и впечатления', en: 'Ratings and stories' },
    keywords: 'отзывы рейтинг оценки reviews rating',
  },
  {
    id: 'faq',
    href: '/#faq',
    title: { ru: 'Частые вопросы', en: 'FAQ' },
    note: { ru: 'Залог, документы, возраст', en: 'Deposit, documents, age' },
    keywords: 'вопросы залог документы возраст права оплата отмена faq deposit documents age licence payment cancel',
  },
  {
    id: 'favorites',
    href: ROUTES.favorites,
    title: { ru: 'Избранное', en: 'Favourites' },
    note: { ru: 'Сохранённые машины', en: 'Saved cars' },
    keywords: 'избранное сохранённые favourites favorites saved',
  },
  {
    id: 'login',
    href: ROUTES.login,
    title: { ru: 'Вход и регистрация', en: 'Sign in & sign up' },
    note: { ru: 'Аккаунт DriveLux', en: 'DriveLux account' },
    keywords: 'вход войти регистрация аккаунт профиль login sign in register account',
  },
  {
    id: 'contacts',
    href: '#contacts',
    title: { ru: 'Контакты', en: 'Contacts' },
    note: { ru: 'Телефон, адрес, мессенджеры', en: 'Phone, address, messengers' },
    keywords: 'контакты телефон адрес офис contacts phone address office',
  },
]

const PAGE_WORDS = new Map(PAGES.map((page) => [page.id, words(`${page.title.ru} ${page.title.en} ${page.keywords}`)]))

function searchPages(query: string[]) {
  return PAGES.filter((page) => matchesWords(query, PAGE_WORDS.get(page.id) ?? []))
}

function searchServices(query: string[], lang: Lang) {
  return SERVICES[lang].filter((service) => {
    const serviceWords = words(
      [SERVICES.ru, SERVICES.en]
        .map((list) => list.find((item) => item.slug === service.slug))
        .map((item) => (item ? `${item.title} ${item.tagline} ${item.highlights.join(' ')}` : ''))
        .join(' '),
    )
    return matchesWords(query, serviceWords)
  })
}

// --- Поиск ------------------------------------------------------------------------------
export interface SearchResults {
  cars: Vehicle[]
  brands: BrandKey[]
  classes: VehicleClass[]
  services: { slug: string; title: string; tagline: string; href: string }[]
  pages: PageEntry[]
}

export function searchSite(query: string, lang: Lang): SearchResults {
  const queryWords = words(query)
  if (!queryWords.length) return { cars: [], brands: [], classes: [], services: [], pages: [] }
  return {
    cars: searchCars(queryWords),
    brands: searchBrands(queryWords),
    classes: searchClasses(queryWords),
    services: searchServices(queryWords, lang).map((service) => ({
      slug: service.slug,
      title: service.title,
      tagline: service.tagline,
      href: serviceHref(service.slug),
    })),
    pages: searchPages(queryWords),
  }
}
