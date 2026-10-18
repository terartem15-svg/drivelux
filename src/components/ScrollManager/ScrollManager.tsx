import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// Прокрутка при переходах по сайту. Встроенный <ScrollRestoration> из
// react-router не подошёл: он прокручивает через window.scrollTo без
// параметров, и с плавной прокруткой сайта (global.css) новая страница
// открывалась бы с «проездом» вверх через всю старую. Здесь поведение
// задано явно:
//  - новая страница — сразу наверх, без анимации;
//  - #якорь на той же странице («Как это работает», «Контакты») — плавно,
//    если человек не просил убрать анимации; с другой страницы — сразу
//    на место, без проезда через всю главную;
//  - «Назад» и «Вперёд» — туда, где человек был на той странице;
//  - смена только параметров адреса (фильтры каталога) — никуда: каталог
//    обновляет адрес сам, и экран не должен прыгать.
// Позиции запоминаются на каждой прокрутке под ключом записи истории.
//
// Для скринридеров и клавиатуры: при переходе на новую страницу фокус
// переносится на <main> — чтение и Tab начинаются с содержимого, а не с
// того места старой страницы, где была нажата ссылка
export function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef(new Map<string, number>())
  const current = useRef(location)

  // --- Запоминаем позицию ------------------------------------------------------------
  useEffect(() => {
    let frame = 0
    function save() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => positions.current.set(current.current.key, window.scrollY))
    }
    window.history.scrollRestoration = 'manual'
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', save)
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  // --- Реагируем на переход ----------------------------------------------------------
  // useLayoutEffect — до отрисовки кадра: новая страница сразу появляется
  // в нужном месте, без мигания старой позиции
  useLayoutEffect(() => {
    const previous = current.current
    current.current = location
    if (previous === location) return

    const samePage = previous.pathname === location.pathname
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (navigationType === 'POP') {
      const saved = positions.current.get(location.key)
      if (saved !== undefined || !samePage) window.scrollTo({ top: saved ?? 0, behavior: 'instant' })
      return
    }

    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      // Якоря-заглушки (#privacy, #careers) никуда не ведут — страница стоит на месте
      if (target) {
        target.scrollIntoView({ behavior: samePage && !reduceMotion ? 'smooth' : 'instant' })
      }
      return
    }

    if (samePage && navigationType === 'REPLACE') {
      positions.current.set(location.key, window.scrollY)
      return
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!samePage) document.getElementById('main')?.focus({ preventScroll: true })
  }, [location, navigationType])

  return null
}
