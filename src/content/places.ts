import type { Localized } from '@/i18n/lang'

// Места получения и возврата машины в Москве — общий справочник для панели
// поиска на главной, страницы бронирования и колонки «Где получить» в
// подвале. id попадает в адрес страницы бронирования (/booking?from=svo).
//
// kind — тип места: по нему выбирается иконка и группа в списке.
// fee — доплата за подачу в евро: по Москве и в аэропорты бесплатно, за
// МКАД (Рублёвка, Сколково) — демо-цена, как в услуге «Доставка».
// needsAddress — для «Моего адреса» и отеля на странице бронирования
// появляется поле адреса
export type PlaceKind = 'office' | 'airport' | 'station' | 'city' | 'address'

export interface Place {
  id: string
  kind: PlaceKind
  label: Localized<string>
  // Короткое название — в поле панели поиска, где мало места
  short: Localized<string>
  note: Localized<string>
  fee: number
  needsAddress?: boolean
}

export const PLACES: Place[] = [
  {
    id: 'office',
    kind: 'office',
    label: { ru: 'Офис DriveLux — Москва-Сити', en: 'DriveLux office — Moscow City' },
    short: { ru: 'Москва-Сити, офис', en: 'Moscow City office' },
    note: { ru: 'Пресненская наб., 12 · 08:00–22:00', en: '12 Presnenskaya Emb. · 08:00–22:00' },
    fee: 0,
  },
  {
    id: 'svo',
    kind: 'airport',
    label: { ru: 'Аэропорт Шереметьево (SVO)', en: 'Sheremetyevo Airport (SVO)' },
    short: { ru: 'Москва, Шереметьево', en: 'Moscow, Sheremetyevo' },
    note: { ru: 'Встреча у выхода из терминала', en: 'Meet & greet at the terminal exit' },
    fee: 0,
  },
  {
    id: 'vko',
    kind: 'airport',
    label: { ru: 'Аэропорт Внуково (VKO)', en: 'Vnukovo Airport (VKO)' },
    short: { ru: 'Москва, Внуково', en: 'Moscow, Vnukovo' },
    note: { ru: 'Встреча у выхода из терминала', en: 'Meet & greet at the terminal exit' },
    fee: 0,
  },
  {
    id: 'dme',
    kind: 'airport',
    label: { ru: 'Аэропорт Домодедово (DME)', en: 'Domodedovo Airport (DME)' },
    short: { ru: 'Москва, Домодедово', en: 'Moscow, Domodedovo' },
    note: { ru: 'Встреча у выхода из терминала', en: 'Meet & greet at the terminal exit' },
    fee: 0,
  },
  {
    id: 'leningradsky',
    kind: 'station',
    label: { ru: 'Ленинградский вокзал', en: 'Leningradsky railway station' },
    short: { ru: 'Ленинградский вокзал', en: 'Leningradsky station' },
    note: { ru: 'Поезда из Санкт-Петербурга', en: 'Trains from St Petersburg' },
    fee: 0,
  },
  {
    id: 'kievsky',
    kind: 'station',
    label: { ru: 'Киевский вокзал', en: 'Kievsky railway station' },
    short: { ru: 'Киевский вокзал', en: 'Kievsky station' },
    note: { ru: 'Аэроэкспресс во Внуково', en: 'Aeroexpress to Vnukovo' },
    fee: 0,
  },
  {
    id: 'belorussky',
    kind: 'station',
    label: { ru: 'Белорусский вокзал', en: 'Belorussky railway station' },
    short: { ru: 'Белорусский вокзал', en: 'Belorussky station' },
    note: { ru: 'Аэроэкспресс в Шереметьево', en: 'Aeroexpress to Sheremetyevo' },
    fee: 0,
  },
  {
    id: 'tverskaya',
    kind: 'city',
    label: { ru: 'Отель в центре — Тверская', en: 'Hotel in the centre — Tverskaya' },
    short: { ru: 'Москва, Тверская', en: 'Moscow, Tverskaya St' },
    note: { ru: 'Подача к отелю в пределах Садового кольца', en: 'Hotel delivery inside the Garden Ring' },
    fee: 0,
    needsAddress: true,
  },
  {
    id: 'rublyovka',
    kind: 'city',
    label: { ru: 'Рублёвка и Барвиха', en: 'Rublyovka & Barvikha' },
    short: { ru: 'Барвиха', en: 'Barvikha' },
    note: { ru: 'За МКАД — от 50 € в одну сторону', en: 'Outside the ring road — from €50 one way' },
    fee: 50,
    needsAddress: true,
  },
  {
    id: 'skolkovo',
    kind: 'city',
    label: { ru: 'Сколково', en: 'Skolkovo' },
    short: { ru: 'Сколково', en: 'Skolkovo' },
    note: { ru: 'За МКАД — от 50 € в одну сторону', en: 'Outside the ring road — from €50 one way' },
    fee: 50,
    needsAddress: true,
  },
  {
    id: 'address',
    kind: 'address',
    label: { ru: 'Мой адрес в Москве', en: 'My address in Moscow' },
    short: { ru: 'Мой адрес', en: 'My address' },
    note: { ru: 'Подача к дому или офису — бесплатно', en: 'Delivery to your home or office — free' },
    fee: 0,
    needsAddress: true,
  },
]

// Группы списка мест — в таком порядке они идут в выпадающем списке
export const PLACE_GROUPS: { kind: PlaceKind; label: Localized<string> }[] = [
  { kind: 'office', label: { ru: 'Офис', en: 'Office' } },
  { kind: 'airport', label: { ru: 'Аэропорты', en: 'Airports' } },
  { kind: 'station', label: { ru: 'Вокзалы', en: 'Railway stations' } },
  { kind: 'city', label: { ru: 'Город и пригород', en: 'City & suburbs' } },
  { kind: 'address', label: { ru: 'Доставка', en: 'Delivery' } },
]

const BY_ID = new Map(PLACES.map((place) => [place.id, place]))

export function getPlace(id: string | null | undefined): Place | undefined {
  return id ? BY_ID.get(id) : undefined
}

// Место по умолчанию — Шереметьево: в референсе поиск начинается с аэропорта
export const DEFAULT_PLACE = 'svo'
