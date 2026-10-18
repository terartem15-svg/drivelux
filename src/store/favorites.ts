import { useSyncExternalStore } from 'react'
import { getVehicle } from '@/content/vehicles'

// Избранное — список id машин в localStorage. Один источник на весь сайт:
// сердечки на карточках, кнопка на странице машины, счётчик в шапке и
// страница «Избранное» подписаны на одно хранилище и меняются вместе.
// Сервера нет: список живёт в браузере и переживает перезагрузку и
// переходы по страницам.
//
// Порядок — от последнего добавленного: на странице «Избранное» свежая
// машина оказывается первой

const STORAGE_KEY = 'drivelux:favorites'

// --- Чтение и запись -----------------------------------------------------------------
// localStorage может быть недоступен (приватный режим Safari, запрет cookie)
// или хранить мусор — тогда избранное просто работает до перезагрузки.
// id, которых больше нет в автопарке, отбрасываются при чтении
function read(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string' && getVehicle(id) !== undefined)
  } catch {
    return []
  }
}

let ids: string[] = read()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function write(next: string[]) {
  ids = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Хранилище недоступно — состояние остаётся в памяти до перезагрузки
  }
  emit()
}

// Избранное, изменённое в соседней вкладке, приходит событием storage —
// сердечки в этой вкладке обновляются сами
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    ids = read()
    emit()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// --- Действия ------------------------------------------------------------------------
export function toggleFavorite(id: string) {
  write(ids.includes(id) ? ids.filter((item) => item !== id) : [id, ...ids])
}

export function clearFavorites() {
  write([])
}

// --- Хук ------------------------------------------------------------------------------
// Снимок — сам массив: он заменяется целиком при каждом изменении, поэтому
// React перерисовывает подписчиков только когда список правда поменялся
export function useFavorites() {
  return useSyncExternalStore(subscribe, () => ids)
}

export function useIsFavorite(id: string) {
  return useSyncExternalStore(subscribe, () => ids.includes(id))
}
