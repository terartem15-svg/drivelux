import { localized, type Lang, type Localized } from '@/i18n/lang'
import { formatEuro } from '@/utils/price'
import { ROUTES } from './site'
import {
  VEHICLES,
  type BodyType,
  type BrandKey,
  type Drive,
  type Fuel,
  type Transmission,
  type Vehicle,
  type VehicleClass,
} from './vehicles'

// Тексты и справочники каталога: подписи к ключам из vehicles.ts на двух
// языках, порядок вариантов в фильтрах, быстрые категории, сортировки и
// демонстрационные условия аренды. Логика фильтрации — в pages/Fleet/catalog.ts

// --- Адреса машин ------------------------------------------------------------------
export function vehicleHref(id: string) {
  return `${ROUTES.fleet}/${id}`
}

export function bookingHref(id?: string) {
  return id ? `${ROUTES.booking}?car=${id}` : ROUTES.booking
}

export function classHref(key: VehicleClass) {
  return `${ROUTES.fleet}?class=${key}`
}

// --- Подписи ----------------------------------------------------------------------
// Класс в единственном числе — на плашке карточки и в характеристиках
export const CLASS_LABELS: Localized<Record<VehicleClass, string>> = {
  ru: {
    economy: 'Эконом',
    comfort: 'Комфорт',
    business: 'Бизнес',
    premium: 'Премиум',
    luxury: 'Люкс',
    sport: 'Спорткар',
    suv: 'Внедорожник',
  },
  en: {
    economy: 'Economy',
    comfort: 'Comfort',
    business: 'Business',
    premium: 'Premium',
    luxury: 'Luxury',
    sport: 'Sports car',
    suv: 'SUV',
  },
}

// Класс как раздел автопарка — во множественном числе: в меню «Автопарк»,
// в панели поиска и в быстрых категориях каталога
export const CLASS_TITLES: Localized<Record<VehicleClass, string>> = {
  ru: {
    economy: 'Эконом',
    comfort: 'Комфорт',
    business: 'Бизнес',
    premium: 'Премиум',
    luxury: 'Люкс',
    sport: 'Спорткары',
    suv: 'Внедорожники',
  },
  en: {
    economy: 'Economy',
    comfort: 'Comfort',
    business: 'Business',
    premium: 'Premium',
    luxury: 'Luxury',
    sport: 'Sports cars',
    suv: 'SUVs',
  },
}

// Самый мощный спорткар парка — для подписи класса: число обновится само,
// когда в каталоге появится машина мощнее
const TOP_SPORT_POWER = Math.max(...VEHICLES.filter((item) => item.class === 'sport').map((item) => item.power))

// Короткое пояснение класса — в выпадающем списке панели поиска и в меню
export const CLASS_NOTES: Localized<Record<VehicleClass, string>> = {
  ru: {
    economy: 'Город без лишних трат',
    comfort: 'Удобно на каждый день',
    business: 'Встречи и трансферы',
    premium: 'Мощность и технологии',
    luxury: 'Rolls-Royce, Bentley',
    sport: `Суперкары до ${TOP_SPORT_POWER.toLocaleString('ru-RU')} л.с.`,
    suv: 'Простор и полный привод',
  },
  en: {
    economy: 'City driving on a budget',
    comfort: 'Easy every day',
    business: 'Meetings and transfers',
    premium: 'Power and technology',
    luxury: 'Rolls-Royce, Bentley',
    sport: `Supercars up to ${TOP_SPORT_POWER.toLocaleString('en-GB')} hp`,
    suv: 'Space and all-wheel drive',
  },
}

export const BODY_LABELS: Localized<Record<BodyType, string>> = {
  ru: {
    coupe: 'Купе',
    sedan: 'Седан',
    suv: 'Внедорожник',
    convertible: 'Кабриолет',
    hatchback: 'Хэтчбек',
    wagon: 'Универсал',
    minivan: 'Минивэн',
  },
  en: {
    coupe: 'Coupé',
    sedan: 'Saloon',
    suv: 'SUV',
    convertible: 'Convertible',
    hatchback: 'Hatchback',
    wagon: 'Estate',
    minivan: 'MPV',
  },
}

// Полная подпись — в фильтре и характеристиках, короткая — на карточке
export const TRANSMISSION_LABELS: Localized<Record<Transmission, { full: string; short: string }>> = {
  ru: {
    automatic: { full: 'Автоматическая', short: 'Автомат' },
    manual: { full: 'Механическая', short: 'Механика' },
  },
  en: {
    automatic: { full: 'Automatic', short: 'Automatic' },
    manual: { full: 'Manual', short: 'Manual' },
  },
}

export const FUEL_LABELS: Localized<Record<Fuel, string>> = {
  ru: { petrol: 'Бензин', diesel: 'Дизель', hybrid: 'Гибрид', electric: 'Электро' },
  en: { petrol: 'Petrol', diesel: 'Diesel', hybrid: 'Hybrid', electric: 'Electric' },
}

export const DRIVE_LABELS: Localized<Record<Drive, string>> = {
  ru: { awd: 'Полный привод', rwd: 'Задний привод', fwd: 'Передний привод' },
  en: { awd: 'All-wheel drive', rwd: 'Rear-wheel drive', fwd: 'Front-wheel drive' },
}

// Единицы характеристик
export const UNITS = localized(
  { hp: 'л.с.', seconds: 'с', perDay: '/ день', from: 'от', seats: { one: 'место', few: 'места', many: 'мест' } },
  { hp: 'hp', seconds: 's', perDay: '/ day', from: 'from', seats: { one: 'seat', few: 'seats', many: 'seats' } },
)

// --- Варианты фильтров ---------------------------------------------------------------
// Порядок — как в брифе каталога. Ferrari в бриф не входила, но есть на
// главной в ряду брендов — её логотип ведёт сюда, поэтому марка в парке есть.
// aliases — как марку пишут по-русски: поиск «мерседес» или «рендж» тоже найдёт
export const BRAND_OPTIONS: { key: BrandKey; aliases: string[] }[] = [
  { key: 'lamborghini', aliases: ['ламборгини', 'ламборджини', 'ламбо', 'lambo'] },
  { key: 'mercedes', aliases: ['мерседес', 'мерс', 'amg', 'benz'] },
  { key: 'bmw', aliases: ['бмв', 'бэха'] },
  { key: 'porsche', aliases: ['порше', 'порш'] },
  { key: 'audi', aliases: ['ауди'] },
  { key: 'rolls-royce', aliases: ['роллс-ройс', 'роллс ройс', 'ролс-ройс', 'ролс', 'rolls'] },
  { key: 'bentley', aliases: ['бентли'] },
  { key: 'range-rover', aliases: ['рендж ровер', 'ренж ровер', 'land rover', 'ленд ровер'] },
  { key: 'tesla', aliases: ['тесла'] },
  { key: 'mclaren', aliases: ['макларен'] },
  { key: 'ferrari', aliases: ['феррари'] },
  // Расширенный автопарк: сначала премиальные марки, затем комфорт и эконом
  { key: 'aston-martin', aliases: ['астон мартин', 'астон', 'aston'] },
  { key: 'maserati', aliases: ['мазерати', 'мазератти'] },
  { key: 'land-rover', aliases: ['ленд ровер', 'лэнд ровер', 'дефендер', 'defender'] },
  { key: 'lexus', aliases: ['лексус'] },
  { key: 'genesis', aliases: ['генезис', 'дженезис'] },
  { key: 'volvo', aliases: ['вольво'] },
  { key: 'cadillac', aliases: ['кадиллак', 'кадилак'] },
  { key: 'chevrolet', aliases: ['шевроле', 'шеви', 'chevy', 'корвет'] },
  { key: 'ford', aliases: ['форд', 'мустанг'] },
  { key: 'nissan', aliases: ['ниссан'] },
  { key: 'toyota', aliases: ['тойота', 'тоёта'] },
  { key: 'lotus', aliases: ['лотус'] },
  { key: 'li-auto', aliases: ['лисян', 'ли авто', 'lixiang', 'li'] },
  { key: 'zeekr', aliases: ['зикр', 'зекр'] },
  { key: 'volkswagen', aliases: ['фольксваген', 'фольц', 'vw'] },
  { key: 'skoda', aliases: ['шкода', 'skoda'] },
  { key: 'hyundai', aliases: ['хендай', 'хёндай', 'хундай', 'хюндай'] },
  { key: 'kia', aliases: ['киа'] },
  { key: 'mazda', aliases: ['мазда'] },
  { key: 'mini', aliases: ['мини', 'купер'] },
  { key: 'fiat', aliases: ['фиат'] },
  { key: 'renault', aliases: ['рено'] },
  { key: 'lada', aliases: ['лада', 'ваз', 'vaz'] },
  { key: 'haval', aliases: ['хавал', 'хавейл'] },
  { key: 'chery', aliases: ['чери', 'черри'] },
  { key: 'geely', aliases: ['джили', 'джилли'] },
  { key: 'exeed', aliases: ['эксид', 'иксид'] },
  { key: 'tank', aliases: ['танк'] },
]

export const CLASS_ORDER: VehicleClass[] = ['economy', 'comfort', 'business', 'premium', 'luxury', 'sport', 'suv']
export const BODY_ORDER: BodyType[] = ['coupe', 'sedan', 'suv', 'convertible', 'hatchback', 'wagon', 'minivan']
export const TRANSMISSION_ORDER: Transmission[] = ['automatic', 'manual']
export const FUEL_ORDER: Fuel[] = ['petrol', 'diesel', 'hybrid', 'electric']

// Места — группами: «6 и более» объединяет шестиместные (Zeekr 009) с
// семи- и восьмиместными минивэнами. Каждое число мест попадает в какую-то
// группу — иначе машина пропадала бы из выдачи при любом выборе мест
export type SeatsKey = '2' | '4' | '5' | '6'

export const SEATS_OPTIONS: { key: SeatsKey; label: Localized<string> }[] = [
  { key: '2', label: { ru: '2 места', en: '2 seats' } },
  { key: '4', label: { ru: '4 места', en: '4 seats' } },
  { key: '5', label: { ru: '5 мест', en: '5 seats' } },
  { key: '6', label: { ru: '6 и более', en: '6 or more' } },
]

export function seatsKey(seats: number): SeatsKey {
  if (seats >= 6) return '6'
  if (seats === 5) return '5'
  if (seats >= 3) return '4'
  return '2'
}

// Быстрые категории над каталогом — короткий путь к фильтру «Класс»:
// нажатие выбирает один класс, «Все» снимает выбор. Здесь все классы
// парка: от суперкаров до эконома
export const QUICK_CATEGORIES: (VehicleClass | null)[] = [
  null,
  'sport',
  'luxury',
  'premium',
  'business',
  'suv',
  'comfort',
  'economy',
]

// --- Сортировка ------------------------------------------------------------------------
export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'power' | 'year'

export const SORT_OPTIONS: { key: SortKey; label: Localized<string> }[] = [
  { key: 'recommended', label: { ru: 'Рекомендуемые', en: 'Recommended' } },
  { key: 'price-asc', label: { ru: 'Сначала дешевле', en: 'Price: low to high' } },
  { key: 'price-desc', label: { ru: 'Сначала дороже', en: 'Price: high to low' } },
  { key: 'power', label: { ru: 'Сначала мощнее', en: 'Most powerful' } },
  { key: 'year', label: { ru: 'Сначала новые', en: 'Newest first' } },
]

// --- Диапазоны -------------------------------------------------------------------------
// Границы ползунков — от самой дешёвой до самой дорогой машины парка
// (и так же по мощности), округлённые до шага ползунка наружу: новая
// машина в данных сама расширит диапазон
function bounds(values: number[], step: number): [number, number] {
  return [Math.floor(Math.min(...values) / step) * step, Math.ceil(Math.max(...values) / step) * step]
}

export const PRICE_STEP = 5
export const POWER_STEP = 10
export const PRICE_BOUNDS = bounds(
  VEHICLES.map((item) => item.pricePerDay),
  PRICE_STEP,
)
export const POWER_BOUNDS = bounds(
  VEHICLES.map((item) => item.power),
  POWER_STEP,
)

// --- Тексты страницы --------------------------------------------------------------------
export const FLEET_PAGE = localized(
  {
    title: 'Наш автопарк',
    lead: 'Спорткары, представительские седаны и внедорожники — подберите машину по марке, классу и бюджету. Все автомобили застрахованы и подаются по Москве бесплатно.',
    searchLabel: 'Поиск по марке и модели',
    searchPlaceholder: 'Марка или модель',
  },
  {
    title: 'Our fleet',
    lead: 'Sports cars, executive saloons and SUVs — pick a car by make, class and budget. Every car is insured and delivered free of charge across Moscow.',
    searchLabel: 'Search by make and model',
    searchPlaceholder: 'Make or model',
  },
)

// --- Условия аренды (демо) ------------------------------------------------------------------
// Сайт — концепт: условия ниже — пример, согласованный с «Частыми вопросами»
// на главной (залог от 1 000 до 5 000 €, водитель от 23 лет со стажем от
// 3 лет, для спорткаров и Rolls-Royce — от 25 и от 5, 250 км в сутки).
// Страница машины прямо подписывает их как демонстрационные
const DEPOSIT: Record<VehicleClass, number> = {
  economy: 1000,
  comfort: 1000,
  business: 1000,
  premium: 2000,
  suv: 2500,
  luxury: 4000,
  sport: 5000,
}

export function depositFor(item: Vehicle) {
  return DEPOSIT[item.class]
}

// Строгие требования к водителю — для спорткаров и Rolls-Royce
export function isStrict(item: Vehicle) {
  return item.class === 'sport' || item.brand === 'rolls-royce'
}

export function rentalTerms(item: Vehicle, lang: Lang) {
  const strict = isStrict(item)
  const deposit = formatEuro(depositFor(item), lang)
  if (lang === 'en') {
    return [
      { label: 'Deposit', value: deposit, note: 'held on your card' },
      { label: 'Driver age', value: `${strict ? 25 : 23}+ years`, note: `${strict ? 5 : 3}+ years of driving` },
      { label: 'Mileage', value: '250 km per day', note: 'extra km — €1 each' },
      { label: 'Insurance', value: 'Full cover', note: 'included in the price' },
      { label: 'Delivery & return', value: 'Free', note: 'across Moscow and to the airports' },
      { label: 'Cancellation', value: 'Free', note: 'up to 48 hours before' },
    ]
  }
  return [
    { label: 'Залог', value: deposit, note: 'блокируется на карте' },
    { label: 'Возраст водителя', value: `от ${strict ? 25 : 23} лет`, note: `стаж от ${strict ? 5 : 3} лет` },
    { label: 'Пробег', value: '250 км в сутки', note: 'сверх лимита — 1 € за км' },
    { label: 'Страховка', value: 'КАСКО и ОСАГО', note: 'включены в цену' },
    { label: 'Подача и возврат', value: 'Бесплатно', note: 'по Москве и в аэропорты' },
    { label: 'Отмена брони', value: 'Бесплатно', note: 'не позднее чем за 48 часов' },
  ]
}

// --- Блоки страницы машины ------------------------------------------------------------------
// «Легенда»: заголовок с золотой второй строкой и три качества — одни на
// класс, а не на каждую машину: описание у машины своё (vehicleDescriptions.ts),
// а здесь — тон класса. icon — ключ иконки из страницы машины
export type LegendIcon = 'design' | 'handling' | 'comfort' | 'space' | 'terrain' | 'quiet'

interface Legend {
  tagline: string
  traits: { icon: LegendIcon; title: string; text: string }[]
}

export const CLASS_LEGEND: Localized<Record<VehicleClass, Legend>> = {
  ru: {
    sport: {
      tagline: 'сила, которая вдохновляет',
      traits: [
        { icon: 'design', title: 'Динамичный', text: 'дизайн' },
        { icon: 'handling', title: 'Непревзойдённая', text: 'управляемость' },
        { icon: 'comfort', title: 'Премиальный', text: 'комфорт' },
      ],
    },
    suv: {
      tagline: 'власть над любой дорогой',
      traits: [
        { icon: 'terrain', title: 'Уверенный', text: 'полный привод' },
        { icon: 'space', title: 'Просторный', text: 'салон' },
        { icon: 'comfort', title: 'Премиальный', text: 'комфорт' },
      ],
    },
    luxury: {
      tagline: 'тишина, достойная вас',
      traits: [
        { icon: 'quiet', title: 'Безупречная', text: 'тишина в салоне' },
        { icon: 'space', title: 'Простор', text: 'для всех пассажиров' },
        { icon: 'comfort', title: 'Ручная работа', text: 'и лучшие материалы' },
      ],
    },
    premium: {
      tagline: 'технологии без компромиссов',
      traits: [
        { icon: 'design', title: 'Выразительный', text: 'дизайн' },
        { icon: 'handling', title: 'Точная', text: 'управляемость' },
        { icon: 'comfort', title: 'Премиальный', text: 'комфорт' },
      ],
    },
    business: {
      tagline: 'статус в каждой детали',
      traits: [
        { icon: 'quiet', title: 'Спокойный', text: 'и тихий ход' },
        { icon: 'space', title: 'Просторный', text: 'салон' },
        { icon: 'comfort', title: 'Деловой', text: 'комфорт' },
      ],
    },
    comfort: {
      tagline: 'комфорт в каждой поездке',
      traits: [
        { icon: 'design', title: 'Современный', text: 'дизайн' },
        { icon: 'handling', title: 'Лёгкая', text: 'управляемость' },
        { icon: 'comfort', title: 'Удобный', text: 'салон' },
      ],
    },
    economy: {
      tagline: 'просто и надёжно',
      traits: [
        { icon: 'design', title: 'Аккуратный', text: 'дизайн' },
        { icon: 'handling', title: 'Лёгкая', text: 'управляемость' },
        { icon: 'comfort', title: 'Удобный', text: 'салон' },
      ],
    },
  },
  en: {
    sport: {
      tagline: 'power that inspires',
      traits: [
        { icon: 'design', title: 'Dynamic', text: 'design' },
        { icon: 'handling', title: 'Unrivalled', text: 'handling' },
        { icon: 'comfort', title: 'Premium', text: 'comfort' },
      ],
    },
    suv: {
      tagline: 'command of any road',
      traits: [
        { icon: 'terrain', title: 'Confident', text: 'all-wheel drive' },
        { icon: 'space', title: 'Spacious', text: 'cabin' },
        { icon: 'comfort', title: 'Premium', text: 'comfort' },
      ],
    },
    luxury: {
      tagline: 'silence worthy of you',
      traits: [
        { icon: 'quiet', title: 'Flawless', text: 'cabin silence' },
        { icon: 'space', title: 'Room', text: 'for every passenger' },
        { icon: 'comfort', title: 'Hand-crafted', text: 'with the finest materials' },
      ],
    },
    premium: {
      tagline: 'technology without compromise',
      traits: [
        { icon: 'design', title: 'Striking', text: 'design' },
        { icon: 'handling', title: 'Precise', text: 'handling' },
        { icon: 'comfort', title: 'Premium', text: 'comfort' },
      ],
    },
    business: {
      tagline: 'status in every detail',
      traits: [
        { icon: 'quiet', title: 'Calm', text: 'and quiet ride' },
        { icon: 'space', title: 'Spacious', text: 'cabin' },
        { icon: 'comfort', title: 'Business', text: 'comfort' },
      ],
    },
    comfort: {
      tagline: 'comfort on every trip',
      traits: [
        { icon: 'design', title: 'Modern', text: 'design' },
        { icon: 'handling', title: 'Easy', text: 'handling' },
        { icon: 'comfort', title: 'Comfortable', text: 'cabin' },
      ],
    },
    economy: {
      tagline: 'simple and reliable',
      traits: [
        { icon: 'design', title: 'Neat', text: 'design' },
        { icon: 'handling', title: 'Easy', text: 'handling' },
        { icon: 'comfort', title: 'Comfortable', text: 'cabin' },
      ],
    },
  },
}

// «Что включено» и «Дополнительные опции» — согласованы с «Частыми
// вопросами» на главной: детское кресло и второй водитель бесплатны,
// подача по Москве и в аэропорты — тоже. Цен нет там, где услуга
// считается индивидуально
export const INCLUDED: Localized<string[]> = {
  ru: ['Страховка (КАСКО + ОСАГО)', 'Техподдержка 24/7', 'Плановое обслуживание', '250 км пробега в сутки'],
  en: ['Full insurance cover', '24/7 roadside support', 'Scheduled maintenance', '250 km per day'],
}

export const EXTRAS: Localized<{ label: string; price: string }[]> = {
  ru: [
    { label: 'Детское кресло', price: 'бесплатно' },
    { label: 'Дополнительный водитель', price: 'бесплатно' },
    { label: 'Подача и возврат по Москве', price: 'бесплатно' },
    { label: 'Подача в другой город', price: 'по запросу' },
  ],
  en: [
    { label: 'Child seat', price: 'free' },
    { label: 'Additional driver', price: 'free' },
    { label: 'Delivery and return in Moscow', price: 'free' },
    { label: 'Delivery to another city', price: 'on request' },
  ],
}
