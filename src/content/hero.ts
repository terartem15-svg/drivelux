import huracanImage from '@/assets/hero/huracan.webp'
import { localized } from '@/i18n/lang'
import type { PluralForms } from '@/utils/format'
import { ROUTES } from './site'

// Тексты первого экрана и панели поиска. Копирайт — из референса.
export const HERO = localized(
  {
    eyebrow: 'Премиум аренда автомобилей',
    // Заголовок по строкам: вторая строка — золотая, как в референсе
    titleLines: ['Эмоции, которые', 'не купить'],
    // Описание по фразам: первая фраза — отдельной строкой, вторая
    // переносится по ширине колонки (sections/Hero/Hero.module.css, .lead)
    lead: ['DriveLux — это больше, чем аренда.', 'Это стиль жизни, свобода и возможность быть там, где ты хочешь.'],
    primary: { label: 'Выбрать автомобиль', href: ROUTES.fleet },
    secondary: { label: 'Как это работает', href: '/#how-it-works' },
    from: 'от',
    perDay: '/ день',
    slides: 'Слайды',
    slide: 'Слайд',
  },
  {
    eyebrow: 'Premium car rental',
    titleLines: ['Emotions money', "can't buy"],
    lead: ['DriveLux is more than a rental.', "It's a lifestyle, freedom and the chance to be wherever you want."],
    primary: { label: 'Choose a car', href: ROUTES.fleet },
    secondary: { label: 'How it works', href: '/#how-it-works' },
    from: 'from',
    perDay: '/ day',
    slides: 'Slides',
    slide: 'Slide',
  },
)

// Слайды первого экрана: фото машины и плашка с ценой. Пока рисуется
// только первый — переключение появится вместе со слайдером.
// image — путь к фото; у слайда без фото вместо него стоит заглушка-атмосфера
// (sections/Hero/Hero.module.css, .placeholder). Фото импортируются из
// src/assets: Vite сам добавит хеш к имени файла, и браузер сможет кешировать
// его навсегда. Фото — фон всего первого экрана; раскладка подобрана под
// кадр Huracán (1280×617, машина носом влево, по ширине — 22–84% кадра):
// фото других слайдов нужно кадрировать так же
export interface HeroSlide {
  name: string
  pricePerDay: number
  image?: string
}

export const HERO_SLIDES: HeroSlide[] = [
  { name: 'Lamborghini Huracán', pricePerDay: 300, image: huracanImage },
  { name: 'Rolls-Royce Phantom', pricePerDay: 500 },
  { name: 'McLaren 765LT', pricePerDay: 350 },
]

// Панель поиска: подписи полей и списков. Значения — места, даты, время и
// класс — живут в store/trip (поездка гостя), места — в content/places
export const SEARCH = localized(
  {
    label: 'Поиск автомобиля',
    pickup: 'Получение',
    dropoff: 'Возврат',
    carClass: 'Класс авто',
    anyClass: 'Любой',
    anyClassNote: 'Весь автопарк',
    submit: 'Найти авто',
    place: 'Место',
    date: 'Дата',
    time: 'Время',
    done: 'Готово',
    sameAsPickup: 'Вернуть там же, где получили',
    days: { one: 'сутки', few: 'суток', many: 'суток' } as PluralForms,
    cars: { one: 'авто', few: 'авто', many: 'авто' } as PluralForms,
    close: 'Закрыть',
    free: 'бесплатно',
  },
  {
    label: 'Car search',
    pickup: 'Pick-up',
    dropoff: 'Return',
    carClass: 'Car class',
    anyClass: 'Any',
    anyClassNote: 'The whole fleet',
    submit: 'Find a car',
    place: 'Place',
    date: 'Date',
    time: 'Time',
    done: 'Done',
    sameAsPickup: 'Return where I picked up',
    days: { one: 'day', many: 'days' },
    cars: { one: 'car', many: 'cars' },
    close: 'Close',
    free: 'free',
  },
)
