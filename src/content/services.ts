import heroImage from '@/assets/services/hero.webp'
import heroSmall from '@/assets/services/hero-sm.webp'
import { localized, type Lang, type Localized } from '@/i18n/lang'
import { SERVICES_EN } from './services.en'
import { SERVICES_RU } from './services.ru'
import { serviceHref } from './serviceLinks'

// Услуги DriveLux — единый источник для страницы «Услуги» (/services) и
// детальных страниц (/services/:slug). Детальная страница одна на все
// услуги (pages/Services/ServicePage): её блоки — преимущества, шаги,
// условия, вопросы, форма и подборка машин — строятся из данных ниже.
// Новая услуга = новый объект в SERVICES, без новой вёрстки.
//
// Сайт — концепт для портфолио. Цены «от …» взяты из макета страницы
// «Услуги» и везде подписаны как демонстрационные. Условия согласованы с
// тем, что сайт уже обещает в других местах («Частые вопросы» на главной,
// условия аренды на странице машины): подача по Москве и в аэропорты,
// детское кресло и второй водитель — бесплатно; поддержка круглосуточно;
// офис 08:00–22:00; залог от 1 000 до 5 000 €; 250 км пробега в сутки.
// Чего на сайте нет (точные скидки, сроки, состав комплектов), то так и
// подписано: «уточняется при заказе»

// --- Иконки -----------------------------------------------------------------------------
// Ключи иконок lucide — сами иконки подставляет pages/Services/serviceIcons.tsx
export type ServiceIcon =
  | 'plane'
  | 'shield-plus'
  | 'calendar'
  | 'briefcase'
  | 'user'
  | 'map-pin'
  | 'clock'
  | 'sparkles'
  | 'file-text'
  | 'baby'
  | 'users'
  | 'wifi'
  | 'snowflake'
  | 'percent'
  | 'wrench'
  | 'refresh'
  | 'headset'
  | 'receipt'
  | 'handshake'
  | 'route'
  | 'luggage'
  | 'armchair'

// --- Фото ------------------------------------------------------------------------------
// Фото — Pexels (лицензия Pexels: бесплатно, можно изменять, подпись не
// обязательна, но мы подписываем). Снимки приведены к одной ночной гамме:
// яркость выровнена, насыщенность снижена, лёгкий тёплый сдвиг и виньетка —
// так кадры разных фотографов не спорят между собой.
// src — 2000px для первого экрана, small — 960px для карточек.
// focus — точка кадра, которая остаётся видна при обрезке (object-position)
export interface ServiceImage {
  src: string
  small: string
  alt: string
  focus?: string
  credit: { author: string; url: string }
}

// --- Модель данных ------------------------------------------------------------------------
export interface ServicePrice {
  from: number // €, демо
  unit: string // «в сутки», «в одну сторону»
  note?: string // к чему относится цена
}

export interface ServiceBenefit {
  icon: ServiceIcon
  title: string
  text: string
}

export interface ServiceStep {
  title: string
  text: string
}

// Пункт условий: подпись, крупное значение и пояснение
export interface ServiceTerm {
  label: string
  value: string
  text: string
}

export interface ServiceFaq {
  question: string
  answer: string
}

// --- Форма заказа ----------------------------------------------------------------------------
// Поля — общий набор; у каждой услуги свой список (fields) и свои
// обязательные (required). Подписи и варианты, которые зависят от услуги
// (места получения, сроки, оборудование), задаются в её объекте
export type OrderField =
  | 'company'
  | 'fleetSize'
  | 'car'
  | 'place'
  | 'address'
  | 'date'
  | 'time'
  | 'duration'
  | 'equipment'
  | 'name'
  | 'contact'
  | 'comment'

export interface OrderOption {
  value: string
  label: string
  // Вариант «место получения», для которого нужен адрес (отель, свой адрес)
  needsAddress?: boolean
}

export interface ServiceForm {
  fields: OrderField[]
  required: OrderField[]
  carLabel?: string
  dateLabel?: string
  timeLabel?: string
  placeLabel?: string
  places?: OrderOption[]
  addressLabel?: string
  addressPlaceholder?: string
  durationLabel?: string
  durations?: OrderOption[]
  equipment?: OrderOption[]
  commentPlaceholder?: string
}

export type ServiceSlug = 'delivery' | 'equipment' | 'long-term-rental' | 'corporate' | 'chauffeur'

export interface Service {
  slug: ServiceSlug
  icon: ServiceIcon
  title: string
  // Подзаголовок карточки и первого экрана
  tagline: string
  // Короткое описание — для карточек списка и «Других услуг»
  summary: string
  // Три-четыре пункта с галочками в карточке списка
  highlights: string[]
  // Первый экран детальной страницы
  lead: string
  // Полное описание — рядом с преимуществами
  description: string
  price: ServicePrice
  image: ServiceImage
  // Второе действие первого экрана: к подборке машин или к условиям
  secondary: { label: string; href: string }
  benefits: ServiceBenefit[]
  steps: ServiceStep[]
  termsTitle: string
  terms: ServiceTerm[]
  faq: ServiceFaq[]
  form: ServiceForm
  // Рекомендуемые машины (id из content/vehicles.ts); пусто — блока нет
  cars: string[]
  carsLead?: string
  related: ServiceSlug[]
}

// --- Услуги на двух языках --------------------------------------------------------------
// Русский — в services.ru.ts, английский — в services.en.ts. Порядок —
// как в макете страницы «Услуги»
export const SERVICES: Localized<Service[]> = { ru: SERVICES_RU, en: SERVICES_EN }

// --- Страница «Услуги» --------------------------------------------------------------------
export const SERVICES_PAGE = localized(
  {
    title: 'Услуги',
    eyebrow: 'Премиум сервис',
    heading: 'Дополнительные',
    headingAccent: 'услуги DriveLux',
    lead: 'Мы заботимся о вашем комфорте и предлагаем дополнительные услуги, чтобы аренда автомобиля стала ещё удобнее и приятнее.',
    priceNote: 'Цены на этой странице — демонстрационные: сайт — концепт для портфолио.',
    from: 'от',
    more: 'Узнать подробнее',
    moreAbout: (title: string) => ` об услуге «${title}»`,
    photos: 'Фото: Pexels —',
  },
  {
    title: 'Services',
    eyebrow: 'Premium service',
    heading: 'Additional',
    headingAccent: 'DriveLux services',
    lead: 'We take care of your comfort and offer additional services to make renting a car even easier and more enjoyable.',
    priceNote: 'Prices on this page are for demonstration: this is a portfolio concept site.',
    from: 'from',
    more: 'Learn more',
    moreAbout: (title: string) => ` about “${title}”`,
    photos: 'Photos: Pexels —',
  },
)

export const SERVICES_HERO_IMAGE = {
  src: heroImage,
  small: heroSmall,
  credit: { author: 'Paul Lichtblau', url: 'https://www.pexels.com/photo/35319488/' },
}

// --- Адреса ---------------------------------------------------------------------------------
// Адрес страницы услуги — в serviceLinks.ts (его использует и подвал)
export { serviceHref }

export function getService(slug: string | undefined, lang: Lang): Service | undefined {
  return SERVICES[lang].find((item) => item.slug === slug)
}
