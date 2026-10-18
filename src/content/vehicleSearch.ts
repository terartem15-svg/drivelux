import { LANGS, type Localized } from '@/i18n/lang'
import { words } from '@/utils/search'
import { BODY_LABELS, BRAND_OPTIONS, CLASS_LABELS, CLASS_TITLES, DRIVE_LABELS, FUEL_LABELS } from './fleet'
import { BRAND_NAMES, type BrandKey, type Vehicle } from './vehicles'

// Поиск машины по словам запроса — один на весь сайт: поле каталога
// (/fleet?q=…) и поиск в шапке находят одни и те же машины. Поэтому
// «Все результаты в автопарке (N)» в окне поиска открывает каталог ровно с
// этими N машинами, а не с пустой выдачей.
//
// Каждое слово запроса должно быть началом какого-то слова машины (utils/search):
//  - сильное совпадение — марка, её русские написания («мерседес», «рендж»)
//    и модель;
//  - слабое — класс, кузов, топливо и привод на обоих языках и год
//    («спорт», «suv», «электро», «кабриолет», «2024»). Слабое — только от
//    двух букв: иначе одна «s» в «мерс s» нашла бы ещё и все седаны и SUV,
//    а не только S-Class и SL

// --- Слова марок ------------------------------------------------------------------
export const BRAND_WORDS = new Map<BrandKey, string[]>(
  BRAND_OPTIONS.map((option) => [option.key, words([BRAND_NAMES[option.key], ...option.aliases].join(' '))]),
)

// --- Слова машины -----------------------------------------------------------------
interface VehicleWords {
  name: string[]
  traits: string[]
}

function bothLangs(map: Localized<Record<string, string>>, key: string) {
  return LANGS.map((lang) => map[lang][key]).join(' ')
}

// Слова считаются один раз на машину: каталог проверяет каждую машину на
// каждый фильтр, и пересобирать их на каждый вызов незачем
const cache = new Map<string, VehicleWords>()

function wordsOf(vehicle: Vehicle): VehicleWords {
  let entry = cache.get(vehicle.id)
  if (!entry) {
    entry = {
      name: [...(BRAND_WORDS.get(vehicle.brand) ?? []), ...words(vehicle.model)],
      traits: words(
        [
          bothLangs(CLASS_LABELS, vehicle.class),
          bothLangs(CLASS_TITLES, vehicle.class),
          bothLangs(BODY_LABELS, vehicle.body),
          bothLangs(FUEL_LABELS, vehicle.fuel),
          bothLangs(DRIVE_LABELS, vehicle.drive),
          String(vehicle.year),
        ].join(' '),
      ),
    }
    cache.set(vehicle.id, entry)
  }
  return entry
}

// --- Совпадение -------------------------------------------------------------------
const TRAIT_MIN_LENGTH = 2

// Очки совпадения: 2 за слово, найденное в марке или модели, 1 — в
// характеристиках. null — какое-то слово запроса не нашлось совсем.
// Пустой запрос подходит любой машине
export function vehicleMatchScore(vehicle: Vehicle, queryWords: string[]): number | null {
  const { name, traits } = wordsOf(vehicle)
  let score = 0
  for (const word of queryWords) {
    if (name.some((item) => item.startsWith(word))) score += 2
    else if (word.length >= TRAIT_MIN_LENGTH && traits.some((item) => item.startsWith(word))) score += 1
    else return null
  }
  return score
}
