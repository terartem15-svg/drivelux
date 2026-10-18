import { CarFront, ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { VehiclePhoto } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import styles from './VehiclePage.module.css'

// Галерея на странице машины: большое фото 3:2, стрелки по бокам, счётчик
// и ряд миниатюр под ним. Фото сменяются плавным перекрытием (CSS), а не
// сдвигом ленты: так не видно «стыка» между кадрами разных съёмок.
//
// Листать можно стрелками на экране, миниатюрами, клавишами ← и → (когда
// фокус внутри галереи) и свайпом по фото. Счётчик — живой регион:
// скринридер скажет «Фото 2 из 4» при смене кадра.
//
// Здесь фото — содержание, а не украшение: у каждого описательный alt.
// Под фото — автор снимка со ссылкой и источник. У фото из Wikimedia Commons
// ещё и лицензия, а у лицензий CC BY и CC BY-SA — пометка «изменено»: эти
// лицензии требуют её, а кадры для сайта обрезаны до 3:2 и уменьшены
// (CC0 и фото Unsplash/Pexels такой пометки не требуют)
const TEXT = localized(
  {
    gallery: 'галерея',
    photos: (name: string) => `Фото ${name}`,
    photo: (name: string, index: number, count: number) => `${name}, фото ${index} из ${count}`,
    prev: 'Предыдущее фото',
    next: 'Следующее фото',
    word: 'Фото',
    of: 'из',
    thumb: (index: number, count: number) => `Фото ${index} из ${count}`,
    credit: 'Фото',
    modified: 'изменено',
  },
  {
    gallery: 'gallery',
    photos: (name: string) => `${name} photos`,
    photo: (name: string, index: number, count: number) => `${name}, photo ${index} of ${count}`,
    prev: 'Previous photo',
    next: 'Next photo',
    word: 'Photo',
    of: 'of',
    thumb: (index: number, count: number) => `Photo ${index} of ${count}`,
    credit: 'Photo',
    modified: 'modified',
  },
)

interface GalleryProps {
  photos: VehiclePhoto[]
  name: string
  // Плашка в левом верхнем углу кадра («Популярный»)
  badge?: string
}

export function Gallery({ photos, name, badge }: GalleryProps) {
  const [index, setIndex] = useState(0)
  const swipeStart = useRef<number | null>(null)
  const count = photos.length
  const text = TEXT[useLang()]

  if (count === 0) {
    return (
      <div className={styles.stage}>
        <span className={styles.placeholder} aria-hidden="true">
          <CarFront size={56} strokeWidth={1} />
        </span>
      </div>
    )
  }

  const go = (step: number) => setIndex((current) => (current + step + count) % count)
  const credit = photos[index].credit

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') go(-1)
    else if (event.key === 'ArrowRight') go(1)
    else return
    event.preventDefault()
  }

  // Свайп: палец сдвинулся по горизонтали больше чем на 40px — листаем.
  // Вертикальная прокрутка страницы не мешает: touch-action: pan-y в CSS
  function handlePointerDown(event: PointerEvent) {
    if (event.pointerType !== 'mouse') swipeStart.current = event.clientX
  }

  function handlePointerUp(event: PointerEvent) {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) > 40) go(distance < 0 ? 1 : -1)
  }

  return (
    <div
      className={styles.gallery}
      role="group"
      aria-roledescription={text.gallery}
      aria-label={text.photos(name)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.stage}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
      >
        {photos.map((photo, i) => (
          <img
            key={photo.src}
            className={styles.stagePhoto}
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(max-width: 1023px) 100vw, 58vw"
            alt={text.photo(name, i + 1, count)}
            aria-hidden={i !== index}
            data-active={i === index ? '' : undefined}
            fetchPriority={i === 0 ? 'high' : undefined}
            loading={i === 0 ? undefined : 'lazy'}
            draggable={false}
          />
        ))}

        {badge && (
          <p className={styles.badge}>
            <Flame size={14} strokeWidth={1.6} aria-hidden="true" />
            {badge}
          </p>
        )}

        {count > 1 && (
          <>
            <button
              className={`${styles.stageArrow} ${styles.stagePrev}`}
              type="button"
              aria-label={text.prev}
              onClick={() => go(-1)}
            >
              <ChevronLeft size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
            <button
              className={`${styles.stageArrow} ${styles.stageNext}`}
              type="button"
              aria-label={text.next}
              onClick={() => go(1)}
            >
              <ChevronRight size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </>
        )}

        <p className={styles.counter} aria-live="polite">
          <span className="visually-hidden">{text.word} </span>
          {index + 1}
          <span aria-hidden="true"> / </span>
          <span className="visually-hidden"> {text.of} </span>
          {count}
        </p>
      </div>

      {count > 1 && (
        <ul className={styles.thumbs}>
          {photos.map((photo, i) => (
            <li key={photo.src}>
              <button
                className={styles.thumb}
                type="button"
                aria-label={text.thumb(i + 1, count)}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <img src={photo.small} alt="" loading="lazy" draggable={false} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {credit && (
        <p className={styles.credit}>
          {text.credit}:{' '}
          <a href={credit.url} target="_blank" rel="noreferrer">
            {credit.author}
          </a>
          , {credit.source ?? 'Unsplash'}
          {credit.license && (
            <>
              {' · '}
              <a href={credit.license.url} target="_blank" rel="noreferrer">
                {credit.license.name}
              </a>
              {credit.license.name.startsWith('CC BY') && `, ${text.modified}`}
            </>
          )}
        </p>
      )}
    </div>
  )
}
