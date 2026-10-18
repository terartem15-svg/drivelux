import { CAR_PHOTOS, carPhotoSrcSet, carPhotoUrl } from './carPhotos'
import { interiorOf, type InteriorPhoto } from './interiors'
import { PHOTO_CREDITS, type PhotoCredit } from './photoCredits'
import { EXTRA_VEHICLES } from './vehiclesExtra'

// Демонстрационный автопарк DriveLux — единый источник данных о машинах:
// каталог, страница машины, избранное, бронирование и «Лучшие предложения»
// на главной берут машины отсюда. Сайт — концепт для портфолио: машины,
// цены и наличие вымышленные, а характеристики взяты у реальных моделей
// тех же версий и годов, чтобы цифры не противоречили фото.

// --- Справочники -----------------------------------------------------------------
// Значения — латинские ключи: они же попадают в адрес страницы каталога
// (/fleet?brand=bmw&class=sport). Русские подписи — в content/fleet.ts
export type BrandKey =
  | 'lamborghini'
  | 'mercedes'
  | 'bmw'
  | 'porsche'
  | 'audi'
  | 'rolls-royce'
  | 'bentley'
  | 'range-rover'
  | 'tesla'
  | 'mclaren'
  | 'ferrari'
  // Расширенный автопарк: премиум, комфорт и эконом
  | 'aston-martin'
  | 'maserati'
  | 'land-rover'
  | 'lexus'
  | 'genesis'
  | 'volvo'
  | 'cadillac'
  | 'chevrolet'
  | 'ford'
  | 'nissan'
  | 'toyota'
  | 'lotus'
  | 'li-auto'
  | 'zeekr'
  | 'volkswagen'
  | 'skoda'
  | 'hyundai'
  | 'kia'
  | 'mazda'
  | 'mini'
  | 'fiat'
  | 'renault'
  | 'lada'
  | 'haval'
  | 'chery'
  | 'geely'
  | 'exeed'
  | 'tank'

export type VehicleClass = 'economy' | 'comfort' | 'business' | 'premium' | 'luxury' | 'sport' | 'suv'
export type BodyType = 'coupe' | 'sedan' | 'suv' | 'convertible' | 'hatchback' | 'wagon' | 'minivan'
export type Transmission = 'automatic' | 'manual'
export type Fuel = 'petrol' | 'diesel' | 'hybrid' | 'electric'
export type Drive = 'awd' | 'rwd' | 'fwd'

// Названия марок — как их пишут сами производители
export const BRAND_NAMES: Record<BrandKey, string> = {
  lamborghini: 'Lamborghini',
  mercedes: 'Mercedes-Benz',
  bmw: 'BMW',
  porsche: 'Porsche',
  audi: 'Audi',
  'rolls-royce': 'Rolls-Royce',
  bentley: 'Bentley',
  'range-rover': 'Range Rover',
  tesla: 'Tesla',
  mclaren: 'McLaren',
  ferrari: 'Ferrari',
  'aston-martin': 'Aston Martin',
  maserati: 'Maserati',
  'land-rover': 'Land Rover',
  lexus: 'Lexus',
  genesis: 'Genesis',
  volvo: 'Volvo',
  cadillac: 'Cadillac',
  chevrolet: 'Chevrolet',
  ford: 'Ford',
  nissan: 'Nissan',
  toyota: 'Toyota',
  lotus: 'Lotus',
  'li-auto': 'Li Auto',
  zeekr: 'Zeekr',
  volkswagen: 'Volkswagen',
  skoda: 'Škoda',
  hyundai: 'Hyundai',
  kia: 'Kia',
  mazda: 'Mazda',
  mini: 'MINI',
  fiat: 'Fiat',
  renault: 'Renault',
  lada: 'Lada',
  haval: 'Haval',
  chery: 'Chery',
  geely: 'Geely',
  exeed: 'Exeed',
  tank: 'Tank',
}

// --- Фото -------------------------------------------------------------------------
// Файлы и их опись — в public/cars и content/carPhotos.ts. У каждого фото
// есть уменьшенная копия для карточек каталога: большие нужны только
// галерее на странице машины. srcSet — оба файла с настоящей шириной:
// браузер сам выберет нужный под ширину карточки и плотность экрана
export interface VehiclePhoto {
  src: string
  small: string
  srcSet?: string
  credit?: PhotoCredit
}

function photosOf(id: string): VehiclePhoto[] {
  const credits = PHOTO_CREDITS[id] ?? []
  const [count] = CAR_PHOTOS[id] ?? [0]
  return Array.from({ length: count }, (_, index) => ({
    src: carPhotoUrl(id, index + 1),
    small: carPhotoUrl(id, index + 1, true),
    srcSet: carPhotoSrcSet(id, index + 1),
    credit: credits[index],
  }))
}

// --- Модель данных ------------------------------------------------------------------
// rank — место в «Рекомендуемых» (сортировка каталога по умолчанию):
// меньше — выше. Порядок задан вручную, чтобы первая страница каталога
// показывала разные классы, а не шесть спорткаров подряд
export interface Vehicle {
  id: string
  brand: BrandKey
  model: string
  // Марка и модель целиком — для заголовков, alt и подписей кнопок
  name: string
  year: number
  pricePerDay: number // €, без скидок программы лояльности
  class: VehicleClass
  body: BodyType
  transmission: Transmission
  fuel: Fuel
  drive: Drive
  power: number // л.с.
  acceleration: number // 0–100 км/ч, секунды
  seats: number
  rank: number
  photos: VehiclePhoto[]
  // Фото салона — отдельный блок страницы машины; у части машин его нет
  interior?: InteriorPhoto
}

export type VehicleInput = Omit<Vehicle, 'name' | 'photos' | 'interior'>

function vehicle(input: VehicleInput): Vehicle {
  return { ...input, name: `${BRAND_NAMES[input.brand]} ${input.model}`, photos: photosOf(input.id), interior: interiorOf(input.id) }
}

// --- Автопарк -----------------------------------------------------------------------
// Порядок в массиве — по маркам, как в фильтре; на экране его задаёт
// сортировка. Пять машин из «Лучших предложений» сохранили названия, цены
// и характеристики с главной
export const VEHICLES: Vehicle[] = [
  vehicle({
    id: 'huracan',
    brand: 'lamborghini',
    model: 'Huracán',
    year: 2023,
    pricePerDay: 300,
    class: 'sport',
    body: 'coupe',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'rwd',
    power: 640,
    acceleration: 3.2,
    seats: 2,
    rank: 1,
  }),
  vehicle({
    id: 'urus',
    brand: 'lamborghini',
    model: 'Urus',
    year: 2022,
    pricePerDay: 280,
    class: 'suv',
    body: 'suv',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 650,
    acceleration: 3.6,
    seats: 5,
    rank: 5,
  }),
  vehicle({
    id: 'g-class',
    brand: 'mercedes',
    model: 'G-Class',
    year: 2023,
    pricePerDay: 250,
    class: 'suv',
    body: 'suv',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 585,
    acceleration: 4.5,
    seats: 5,
    rank: 2,
  }),
  vehicle({
    id: 's-class',
    brand: 'mercedes',
    model: 'S-Class',
    year: 2022,
    pricePerDay: 220,
    class: 'business',
    body: 'sedan',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 503,
    acceleration: 4.4,
    seats: 5,
    rank: 6,
  }),
  vehicle({
    id: 'a-class',
    brand: 'mercedes',
    model: 'A-Class',
    year: 2022,
    pricePerDay: 55,
    class: 'economy',
    body: 'sedan',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'fwd',
    power: 163,
    acceleration: 8.2,
    seats: 5,
    rank: 23,
  }),
  vehicle({
    id: 'sl-63',
    brand: 'mercedes',
    model: 'AMG SL 63',
    year: 2023,
    pricePerDay: 300,
    class: 'sport',
    body: 'convertible',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 585,
    acceleration: 3.6,
    seats: 4,
    rank: 15,
  }),
  vehicle({
    id: 'm8',
    brand: 'bmw',
    model: 'M8 Gran Coupé',
    year: 2022,
    pricePerDay: 220,
    class: 'premium',
    body: 'coupe',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 625,
    acceleration: 3.2,
    seats: 5,
    rank: 10,
  }),
  vehicle({
    id: 'bmw-7',
    brand: 'bmw',
    model: '7 Series',
    year: 2021,
    pricePerDay: 170,
    class: 'business',
    body: 'sedan',
    transmission: 'automatic',
    fuel: 'hybrid',
    drive: 'awd',
    power: 394,
    acceleration: 5.3,
    seats: 5,
    rank: 20,
  }),
  vehicle({
    id: 'x7',
    brand: 'bmw',
    model: 'X7',
    year: 2023,
    pricePerDay: 190,
    class: 'suv',
    body: 'suv',
    transmission: 'automatic',
    fuel: 'diesel',
    drive: 'awd',
    power: 352,
    acceleration: 5.9,
    seats: 7,
    rank: 16,
  }),
  vehicle({
    id: '911-gt3',
    brand: 'porsche',
    model: '911 GT3',
    year: 2023,
    pricePerDay: 320,
    class: 'sport',
    body: 'coupe',
    transmission: 'manual',
    fuel: 'petrol',
    drive: 'rwd',
    power: 510,
    acceleration: 3.9,
    seats: 2,
    rank: 4,
  }),
  vehicle({
    id: 'taycan',
    brand: 'porsche',
    model: 'Taycan 4S',
    year: 2022,
    pricePerDay: 190,
    class: 'premium',
    body: 'sedan',
    transmission: 'automatic',
    fuel: 'electric',
    drive: 'awd',
    power: 571,
    acceleration: 4.0,
    seats: 4,
    rank: 12,
  }),
  vehicle({
    id: 'cayenne',
    brand: 'porsche',
    model: 'Cayenne Turbo GT',
    year: 2022,
    pricePerDay: 280,
    class: 'suv',
    body: 'suv',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 640,
    acceleration: 3.3,
    seats: 4,
    rank: 18,
  }),
  vehicle({
    id: 'rs6',
    brand: 'audi',
    model: 'RS 6 Avant',
    year: 2021,
    pricePerDay: 200,
    class: 'premium',
    body: 'wagon',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 600,
    acceleration: 3.6,
    seats: 5,
    rank: 14,
  }),
  vehicle({
    id: 'rs3',
    brand: 'audi',
    model: 'RS 3 Sportback',
    year: 2022,
    pricePerDay: 150,
    class: 'premium',
    body: 'hatchback',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 400,
    acceleration: 3.8,
    seats: 5,
    rank: 24,
  }),
  vehicle({
    id: 'r8',
    brand: 'audi',
    model: 'R8 V10 performance',
    year: 2021,
    pricePerDay: 260,
    class: 'sport',
    body: 'coupe',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 620,
    acceleration: 3.1,
    seats: 2,
    rank: 17,
  }),
  vehicle({
    id: 'phantom',
    brand: 'rolls-royce',
    model: 'Phantom',
    year: 2022,
    pricePerDay: 500,
    class: 'luxury',
    body: 'sedan',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'rwd',
    power: 571,
    acceleration: 5.3,
    seats: 5,
    rank: 13,
  }),
  vehicle({
    id: 'cullinan',
    brand: 'rolls-royce',
    model: 'Cullinan',
    year: 2022,
    pricePerDay: 600,
    class: 'luxury',
    body: 'suv',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 600,
    acceleration: 4.9,
    seats: 5,
    rank: 3,
  }),
  vehicle({
    id: 'continental-gt',
    brand: 'bentley',
    model: 'Continental GT',
    year: 2018,
    pricePerDay: 320,
    class: 'luxury',
    body: 'coupe',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 528,
    acceleration: 4.5,
    seats: 4,
    rank: 11,
  }),
  vehicle({
    id: 'range-rover',
    brand: 'range-rover',
    model: 'Autobiography',
    year: 2023,
    pricePerDay: 240,
    class: 'luxury',
    body: 'suv',
    transmission: 'automatic',
    fuel: 'diesel',
    drive: 'awd',
    power: 350,
    acceleration: 6.1,
    seats: 5,
    rank: 8,
  }),
  vehicle({
    id: 'range-rover-sport',
    brand: 'range-rover',
    model: 'Sport SVR',
    year: 2021,
    pricePerDay: 210,
    class: 'suv',
    body: 'suv',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'awd',
    power: 575,
    acceleration: 4.5,
    seats: 5,
    rank: 21,
  }),
  vehicle({
    id: 'model-s',
    brand: 'tesla',
    model: 'Model S',
    year: 2021,
    pricePerDay: 140,
    class: 'business',
    body: 'sedan',
    transmission: 'automatic',
    fuel: 'electric',
    drive: 'awd',
    power: 670,
    acceleration: 3.2,
    seats: 5,
    rank: 19,
  }),
  vehicle({
    id: 'model-3',
    brand: 'tesla',
    model: 'Model 3',
    year: 2023,
    pricePerDay: 85,
    class: 'comfort',
    body: 'sedan',
    transmission: 'automatic',
    fuel: 'electric',
    drive: 'awd',
    power: 440,
    acceleration: 4.4,
    seats: 5,
    rank: 22,
  }),
  vehicle({
    id: 'mclaren-765lt',
    brand: 'mclaren',
    model: '765LT',
    year: 2021,
    pricePerDay: 350,
    class: 'sport',
    body: 'coupe',
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'rwd',
    power: 765,
    acceleration: 2.8,
    seats: 2,
    rank: 7,
  }),
  vehicle({
    id: 'ferrari-296',
    brand: 'ferrari',
    model: '296 GTB',
    year: 2023,
    pricePerDay: 450,
    class: 'sport',
    body: 'coupe',
    transmission: 'automatic',
    fuel: 'hybrid',
    drive: 'rwd',
    power: 830,
    acceleration: 2.9,
    seats: 2,
    rank: 9,
  }),
  // Расширенный автопарк — в vehiclesExtra.ts
  ...EXTRA_VEHICLES.map(vehicle),
]

// --- Поиск по id ----------------------------------------------------------------------
const BY_ID = new Map(VEHICLES.map((item) => [item.id, item]))

export function getVehicle(id: string | null | undefined): Vehicle | undefined {
  return id ? BY_ID.get(id) : undefined
}
