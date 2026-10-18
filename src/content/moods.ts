import businessImage from '@/assets/moods/business.webp'
import specialImage from '@/assets/moods/special.webp'
import sportImage from '@/assets/moods/sport.webp'
import suvImage from '@/assets/moods/suv.webp'
import { localized, type Localized } from '@/i18n/lang'
import { ROUTES } from './site'
import { VEHICLES, type VehicleClass } from './vehicles'

// «Автомобиль под настроение»: четыре категории автопарка. Клик открывает
// каталог с отбором по классу (/fleet?class=…): «Для особого случая» — это
// класс «Люкс», Rolls-Royce, Bentley и Range Rover. Число машин считается
// по автопарку (content/vehicles.ts) и совпадает с выдачей каталога.
// image — путь к фото: у категории без фото своя заглушка-атмосфера
// (sections/Moods/Moods.module.css)
export type MoodId = 'sport' | 'business' | 'suv' | 'special'

const MOOD_CLASS: Record<MoodId, VehicleClass> = {
  sport: 'sport',
  business: 'business',
  suv: 'suv',
  special: 'luxury',
}

function countOf(id: MoodId) {
  return VEHICLES.filter((item) => item.class === MOOD_CLASS[id]).length
}

export function moodHref(id: MoodId) {
  return `${ROUTES.fleet}?class=${MOOD_CLASS[id]}`
}

// Фото категорий — снимки целиком, без обрезки: карточки мозаики меняют
// форму от экрана к экрану («Спорт» на десктопе вертикальный, на планшете —
// широкий), и кадр под карточку выбирает браузер (object-fit: cover).
// focus — точка снимка, которая остаётся в кадре при обрезке (object-position):
// подобрана так, чтобы машина была целиком и выше текста карточки.
// focusTall — своя точка для высокой карточки («Спорт» на десктопе): там в
// кадр входит почти весь снимок, и машину можно поднять в середину, отдав
// низ под текст; в широкой карточке та же точка увела бы машину из кадра.
// tone — CSS-фильтр, приглушающий светлый снимок до ночной палитры сайта:
// туман, снег и дневное солнце рядом с тёмными карточками выглядели бы
// вырезанными из другого сайта. Тёмным снимкам он не нужен
export interface MoodImage {
  src: string
  focus: string
  focusTall?: string
  tone?: string
}

export interface Mood {
  id: MoodId
  title: Localized<string>
  text: Localized<string>
  count: number
  image?: MoodImage
}

// В текстах — неразрывные пробелы после коротких слов («и», «с», «до»):
// на узкой карточке предлог не повиснет в конце строки
export const MOODS: Mood[] = [
  {
    id: 'sport',
    title: { ru: 'Спорт', en: 'Sport' },
    text: {
      ru: 'Lamborghini, Ferrari, Porsche и McLaren: до сотни меньше чем за 4 секунды',
      en: 'Lamborghini, Ferrari, Porsche and McLaren: 0–100 km/h in under 4 seconds',
    },
    count: countOf('sport'),
    // Porsche 911 GT3 RS на горной дороге в тумане: машина на 50–72% высоты,
    // ниже — асфальт, под текст
    image: { src: sportImage, focus: '50% 64%', focusTall: '50% 92%', tone: 'brightness(0.7)' },
  },
  {
    id: 'business',
    title: { ru: 'Бизнес', en: 'Business' },
    text: {
      ru: 'S-Class, BMW 7 и Tesla Model S для встреч и трансферов — с водителем или без',
      en: 'S-Class, BMW 7 and Tesla Model S for meetings and transfers — with or without a chauffeur',
    },
    count: countOf('business'),
    // Mercedes S-Class Coupé анфас: фары и решётка — выше текста карточки
    image: { src: businessImage, focus: '50% 75%' },
  },
  {
    id: 'suv',
    title: { ru: 'Внедорожники', en: 'SUVs' },
    text: {
      ru: 'G-Class, Range Rover и Cayenne для загородных дорог и поездок за город',
      en: 'G-Class, Range Rover and Cayenne for country roads and weekend getaways',
    },
    count: countOf('suv'),
    // Range Rover на снежном склоне: низ кадра — снег, его и отдаём под текст.
    // Снег — самое светлое на странице, приглушён сильнее остальных
    image: { src: suvImage, focus: '50% 90%', tone: 'brightness(0.62) saturate(0.85)' },
  },
  {
    id: 'special',
    title: { ru: 'Для особого случая', en: 'For a special occasion' },
    text: {
      ru: 'Свадьба, юбилей или предложение руки: Rolls-Royce, Bentley и Range Rover — с водителем или без',
      en: 'A wedding, an anniversary or a proposal: Rolls-Royce, Bentley and Range Rover — with or without a chauffeur',
    },
    count: countOf('special'),
    // Белый Rolls-Royce Ghost и тёмный Rolls за ним на солнечной улице:
    // машины на 46–71% высоты, в широкой карточке остаётся полоса через
    // капоты и решётки. Дневной снимок — приглушён и яркость, и цвет
    // (зелень пальм и синее небо), чтобы он сел в ночную палитру
    image: { src: specialImage, focus: '50% 62%', tone: 'brightness(0.62) saturate(0.7)' },
  },
]

export const MOODS_SECTION = localized(
  {
    eyebrow: 'Категории',
    title: 'Автомобиль под настроение',
    note: 'Выберите повод — каталог откроется с подходящими машинами',
    cars: 'авто',
  },
  {
    eyebrow: 'Categories',
    title: 'A car for every mood',
    note: 'Pick the occasion — the catalogue opens with matching cars',
    cars: 'cars',
  },
)
