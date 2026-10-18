import { useSyncExternalStore } from 'react'

// Совпадает ли медиазапрос сейчас — и перерисовка при повороте телефона или
// изменении окна. Для решений, которые CSS не принимает: например, какой
// раскладкой рисовать карточки или закрыть ли панель фильтров
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}
