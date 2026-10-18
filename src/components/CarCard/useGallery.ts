import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'

// --- Листание фото курсором ----------------------------------------------------
// Общий хук карточек «Лучших предложений» (CarCard) и каталога «Автопарк»
// (VehicleCard).
//
// Мышь: окно фото поделено по ширине на столько полос, сколько фото, и курсор
// над полосой показывает её фото. Ведёшь влево — фото идут назад, вправо —
// вперёд; ушёл с карточки — снова обложка. Листает именно окно фото, а не
// вся карточка: по пути курсора к «Подробнее» (по центру) фото не прыгает.
// Смена мгновенная, без затухания: кадр привязан к движению руки, и любая
// анимация ощущалась бы как задержка.
//
// Палец: наведения нет, а свайп по ленте листает сами карточки, поэтому
// тап по правой половине фото — следующее, по левой — предыдущее, по кругу.
//
// Остальные фото не грузятся, пока гость не проявил интерес к карточке
// (навёл курсор или коснулся): пять карточек по пять фото — лишние ~350 КБ
// для тех, кто просто прокручивает страницу. Пока выбранное фото
// догружается, под ним видна обложка — она всегда лежит нижним слоем
export function useGallery(count: number) {
  const [index, setIndex] = useState(0)
  const [primed, setPrimed] = useState(false)
  // Тип указателя последнего нажатия: click сам по себе не говорит, мышь
  // это или палец, а мышью листают наведением, не кликом
  const lastPress = useRef('')

  function prime() {
    setPrimed(true)
  }

  function reset(event: PointerEvent) {
    // pointerleave бывает и после тапа — сбрасываем только уход мыши
    if (event.pointerType === 'mouse') setIndex(0)
  }

  function scrub(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || count < 2) return
    const rect = event.currentTarget.getBoundingClientRect()
    const strip = Math.floor(((event.clientX - rect.left) / rect.width) * count)
    setIndex(Math.min(count - 1, Math.max(0, strip)))
  }

  function press(event: PointerEvent) {
    lastPress.current = event.pointerType
    setPrimed(true)
  }

  function tap(event: MouseEvent<HTMLElement>) {
    if (lastPress.current === 'mouse' || count < 2) return
    // Тап по сердечку — это «в избранное», а не листание
    if ((event.target as Element).closest('button')) return
    const rect = event.currentTarget.getBoundingClientRect()
    const step = event.clientX - rect.left < rect.width / 2 ? -1 : 1
    setIndex((current) => (current + step + count) % count)
  }

  return { index, primed, prime, reset, scrub, press, tap }
}
