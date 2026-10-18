import type { Localized } from '@/i18n/lang'
import type { ServiceSlug } from './services'
import { ROUTES } from './site'

// Названия и адреса услуг — отдельно от их полных текстов (services.ru.ts,
// services.en.ts). Подвал есть на каждой странице и показывает список услуг;
// если бы он брал названия из полных текстов, все пять страниц услуг на
// двух языках грузились бы вместе с главной. Полные тексты берут названия
// отсюда же — расхождения между подвалом и страницей услуги не бывает
export const SERVICE_ORDER: ServiceSlug[] = ['delivery', 'equipment', 'long-term-rental', 'corporate', 'chauffeur']

export const SERVICE_TITLES: Record<ServiceSlug, Localized<string>> = {
  delivery: { ru: 'Доставка автомобиля', en: 'Car delivery' },
  equipment: { ru: 'Дополнительное оборудование', en: 'Additional equipment' },
  'long-term-rental': { ru: 'Долгосрочная аренда', en: 'Long-term rental' },
  corporate: { ru: 'Корпоративная аренда', en: 'Corporate rental' },
  chauffeur: { ru: 'Аренда с водителем', en: 'Chauffeur service' },
}

export function serviceHref(slug: ServiceSlug) {
  return `${ROUTES.services}/${slug}`
}
