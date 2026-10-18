import type { BrandId } from '@/components/icons/logoPaths'
import { localized } from '@/i18n/lang'
import { ROUTES } from './site'
import { BRAND_NAMES, VEHICLES, type BrandKey } from './vehicles'

// «Бренды»: все марки автопарка бегущей строкой (sections/Brands): лента
// плавно и бесконечно едет вправо и останавливается под курсором. Под
// логотипом — сколько
// машин марки в автопарке, клик открывает каталог с отбором по марке
// (/fleet?brand=…). Числа считаются по content/vehicles.ts, поэтому
// всегда совпадают с тем, что покажет каталог.
//
// Порядок — как в референсе, Range Rover — в конце: его логотипа нет в
// simple-icons, вместо него словесный знак (sections/Brands).
// scale — оптическая поправка размера: логотипы-«полоски» (кольца Audi,
// крылья Bentley, стрела McLaren) в квадрате 24×24 занимают малую часть
// высоты и рядом с гербами выглядят мельче, поэтому их чуть увеличиваем
export interface Brand {
  id: BrandKey
  logo?: BrandId
  name: string
  count: number
  href: string
  scale?: number
}

function countOf(id: string) {
  return VEHICLES.filter((item) => item.brand === id).length
}

const ROW: { id: BrandKey; logo?: BrandId; scale?: number }[] = [
  { id: 'lamborghini', logo: 'lamborghini' },
  { id: 'mercedes', logo: 'mercedes' },
  { id: 'bmw', logo: 'bmw' },
  { id: 'porsche', logo: 'porsche' },
  { id: 'rolls-royce', logo: 'rolls-royce' },
  { id: 'audi', logo: 'audi', scale: 1.45 },
  { id: 'ferrari', logo: 'ferrari' },
  { id: 'bentley', logo: 'bentley', scale: 1.4 },
  { id: 'mclaren', logo: 'mclaren', scale: 1.8 },
  { id: 'tesla', logo: 'tesla' },
  { id: 'range-rover' },
  // Премиальные марки расширенного автопарка. У Land Rover, Lexus и
  // Genesis нет логотипов в simple-icons — у них словесный знак, как у Range Rover
  { id: 'aston-martin', logo: 'aston-martin', scale: 1.6 },
  { id: 'maserati', logo: 'maserati' },
  { id: 'land-rover' },
  { id: 'lexus' },
  { id: 'genesis' },
]

export const BRANDS: Brand[] = ROW.map((brand) => ({
  ...brand,
  name: BRAND_NAMES[brand.id],
  count: countOf(brand.id),
  href: `${ROUTES.fleet}?brand=${brand.id}`,
}))

export const BRANDS_SECTION = localized(
  {
    eyebrow: 'Бренды',
    title: 'Топовые марки автомобилей',
    link: { label: 'Все бренды', href: ROUTES.fleet },
    cars: 'авто',
  },
  {
    eyebrow: 'Brands',
    title: 'Top car makes',
    link: { label: 'All brands', href: ROUTES.fleet },
    cars: 'cars',
  },
)
