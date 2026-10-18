import { localized } from '@/i18n/lang'
import { ROUTES } from './site'
import { getVehicle, type Vehicle } from './vehicles'

// «Лучшие предложения» — карусель под первым экраном. Машины берутся из
// автопарка (content/vehicles.ts), здесь — только их выбор и порядок, как
// в референсе. McLaren 765LT стоит на месте Porsche 911 Turbo из референса
const POPULAR_IDS = ['huracan', 'g-class', 'm8', 'mclaren-765lt', 'phantom']

export const POPULAR_CARS: Vehicle[] = POPULAR_IDS.map((id) => {
  const item = getVehicle(id)
  if (!item) throw new Error(`«Лучшие предложения»: машины ${id} нет в автопарке`)
  return item
})

export const POPULAR_SECTION = localized(
  {
    eyebrow: 'Популярные автомобили',
    title: 'Лучшие предложения',
    link: { label: 'Весь автопарк', href: ROUTES.fleet },
    details: 'Подробнее',
    detailsAbout: 'о',
    prev: 'Предыдущие автомобили',
    next: 'Следующие автомобили',
  },
  {
    eyebrow: 'Popular cars',
    title: 'Best offers',
    link: { label: 'Whole fleet', href: ROUTES.fleet },
    details: 'Details',
    detailsAbout: 'about',
    prev: 'Previous cars',
    next: 'Next cars',
  },
)
