import { useSyncExternalStore } from 'react'
import { DEFAULT_PLACE, getPlace } from '@/content/places'
import { CLASS_ORDER } from '@/content/fleet'
import type { VehicleClass } from '@/content/vehicles'
import { addDays, todayIso } from '@/utils/format'

// Поездка, которую гость собрал в панели поиска на главной: где и когда
// забрать машину, где и когда вернуть, какой класс нужен. Каталог
// открывается с отбором по классу, а страница бронирования подставляет
// места, даты и время из поездки — их не нужно вводить второй раз.
//
// Хранится в sessionStorage: живёт, пока открыта вкладка, и не тянется в
// следующий визит через неделю с устаревшими датами. Даты в прошлом при
// чтении заменяются на «сегодня» и «через три дня».
//
// Поездка всегда выполнима: получение не раньше чем через час от текущего
// времени (сегодня в 10:00, когда уже вечер, не выбрать), а возврат в день
// получения — только позже времени получения. Любое изменение проходит
// через normalize, а списки времени отключают недоступные варианты
export interface Trip {
  from: string
  to: string
  start: string // ГГГГ-ММ-ДД
  startTime: string // ЧЧ:ММ
  end: string
  endTime: string
  carClass: VehicleClass | ''
}

const STORAGE_KEY = 'drivelux:trip'

// Время подачи — с 08:00 до 22:00 с шагом в полчаса, как работает офис;
// в аэропорты и на вокзалы машину подают круглосуточно, но в демо одного
// списка достаточно
export const TIME_SLOTS = Array.from({ length: 29 }, (_, index) => {
  const minutes = 8 * 60 + index * 30
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${minutes % 60 === 0 ? '00' : '30'}`
})

// --- Доступное время ------------------------------------------------------------------
// Машину готовят к подаче не меньше часа
const LEAD_MINUTES = 60

function minutesOf(slot: string) {
  const [hours, minutes] = slot.split(':').map(Number)
  return hours * 60 + minutes
}

// Время получения в этот день: сегодня — только то, что наступит не раньше
// чем через час; вечером список пуст, и получение переезжает на завтра
export function pickupSlots(date: string): string[] {
  if (date !== todayIso()) return TIME_SLOTS
  const now = new Date()
  const earliest = now.getHours() * 60 + now.getMinutes() + LEAD_MINUTES
  return TIME_SLOTS.filter((slot) => minutesOf(slot) >= earliest)
}

// Первый день, когда ещё можно получить машину: вечером — уже завтра.
// Это нижняя граница календаря получения
export function firstPickupDate(): string {
  const today = todayIso()
  return pickupSlots(today).length ? today : addDays(today, 1)
}

// Время возврата: в день получения — только позже времени получения
export function returnSlots(trip: Pick<Trip, 'start' | 'startTime' | 'end'>): string[] {
  return trip.end === trip.start ? TIME_SLOTS.filter((slot) => slot > trip.startTime) : TIME_SLOTS
}

// Поправка невыполнимой поездки: дата в прошлом — на сегодня, прошедшее
// время — на ближайшее доступное, возврат раньше получения — на следующий
// день или следующие полчаса после получения
function normalize(trip: Trip): Trip {
  const next = { ...trip }
  const first = firstPickupDate()
  if (next.start < first) next.start = first
  const pickups = pickupSlots(next.start)
  if (!pickups.includes(next.startTime)) next.startTime = pickups[0]

  if (next.end < next.start) next.end = addDays(next.start, 1)
  if (returnSlots(next).length === 0) next.end = addDays(next.start, 1)
  const returns = returnSlots(next)
  if (!returns.includes(next.endTime)) next.endTime = returns[0]
  return next
}

export function defaultTrip(): Trip {
  const today = todayIso()
  return normalize({
    from: DEFAULT_PLACE,
    to: DEFAULT_PLACE,
    start: today,
    startTime: '10:00',
    end: addDays(today, 3),
    endTime: '10:00',
    carClass: '',
  })
}

// --- Чтение и запись -----------------------------------------------------------------
// Всё, что пришло из хранилища, проверяется: незнакомое место или класс,
// неверная дата или время заменяются значениями по умолчанию, а
// невыполнимая поездка поправляется (normalize)
const DATE = /^\d{4}-\d{2}-\d{2}$/

function sanitize(raw: Partial<Trip>): Trip {
  const base = defaultTrip()
  const valid = (value: unknown, pattern: RegExp) => typeof value === 'string' && pattern.test(value)
  const start = valid(raw.start, DATE) ? raw.start! : base.start
  return normalize({
    from: getPlace(raw.from) ? raw.from! : base.from,
    to: getPlace(raw.to) ? raw.to! : base.to,
    start,
    startTime: TIME_SLOTS.includes(raw.startTime ?? '') ? raw.startTime! : base.startTime,
    end: valid(raw.end, DATE) && raw.end! >= start ? raw.end! : addDays(start, 3),
    endTime: TIME_SLOTS.includes(raw.endTime ?? '') ? raw.endTime! : base.endTime,
    carClass: CLASS_ORDER.includes(raw.carClass as VehicleClass) ? (raw.carClass as VehicleClass) : '',
  })
}

function read(): Trip {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}')
    return sanitize(parsed && typeof parsed === 'object' ? (parsed as Partial<Trip>) : {})
  } catch {
    return defaultTrip()
  }
}

let trip: Trip = read()
const listeners = new Set<() => void>()

export function updateTrip(patch: Partial<Trip>) {
  // Получение позже возврата — возврат сдвигается следом
  const next = normalize({ ...trip, ...patch })
  trip = next
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Без хранилища поездка живёт до перезагрузки
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTrip(): Trip {
  return useSyncExternalStore(subscribe, () => trip)
}
