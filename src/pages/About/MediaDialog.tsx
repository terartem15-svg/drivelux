import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { ABOUT_PAGE, FILM, type GalleryPhoto } from '@/content/about'
import { useLang } from '@/i18n/lang'
import styles from './MediaDialog.module.css'

// Окна страницы «О компании»: лайтбокс галереи и плеер видео. Оба —
// нативный <dialog> в модальном режиме, как мобильное меню: браузер держит
// фокус внутри и возвращает его на кнопку, с которой окно открыли, Esc
// закрывает, страница под окном не прокручивается (global.css). Клик по
// затемнению вокруг кадра тоже закрывает окно

// --- Общий каркас окна -------------------------------------------------------------------
// open управляет showModal()/close(); закрытие с клавиатуры (Esc) или
// кликом мимо кадра сообщается наверх через onClose — состояние живёт у
// страницы
interface MediaDialogProps {
  open: boolean
  label: string
  onClose: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void
  children: ReactNode
}

function MediaDialog({ open, label, onClose, onKeyDown, children }: MediaDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const text = ABOUT_PAGE[useLang()]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {/* Кнопка закрытия — первая в окне: на неё браузер ставит фокус при
          открытии, и Tab начинается с понятного действия */}
      <button className={styles.close} type="button" aria-label={text.close} onClick={onClose}>
        <X size={22} strokeWidth={1.6} aria-hidden="true" />
      </button>
      {children}
    </dialog>
  )
}

// --- Лайтбокс ---------------------------------------------------------------------------------
// index — открытое фото или null, когда окно закрыто. Листать можно
// стрелками на экране, клавишами ← и → и свайпом по кадру. Счётчик —
// живой регион: скринридер скажет «Фото 2 из 6» при смене кадра
interface LightboxProps {
  photos: GalleryPhoto[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
}

export function Lightbox({ photos, index, onIndexChange, onClose }: LightboxProps) {
  const lang = useLang()
  const text = ABOUT_PAGE[lang]
  const swipeStart = useRef<number | null>(null)
  const count = photos.length
  // Пока окно закрыто, в нём остаётся последнее показанное фото — так оно
  // не мигает пустотой во время закрытия
  const [lastIndex, setLastIndex] = useState(0)
  if (index !== null && index !== lastIndex) setLastIndex(index)
  const shown = index ?? lastIndex
  const current = photos[shown]

  const go = (step: number) => onIndexChange((shown + step + count) % count)

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') go(-1)
    else if (event.key === 'ArrowRight') go(1)
    else return
    event.preventDefault()
  }

  // Свайп: палец сдвинулся по горизонтали больше чем на 40px — листаем
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
    <MediaDialog open={index !== null} label={current.caption[lang]} onClose={onClose} onKeyDown={handleKeyDown}>
      <figure className={styles.figure}>
        <div
          className={styles.frame}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {/* key — новый кадр проявляется анимацией, а не подменяется
              посреди загрузки */}
          <img
            key={current.src}
            className={styles.photo}
            src={current.src}
            alt={current.alt[lang]}
            style={{ filter: current.tone }}
            draggable={false}
          />
        </div>

        <figcaption className={styles.caption}>
          <span className={styles.captionTitle}>{current.caption[lang]}</span>
          <span className={styles.captionMeta}>
            <span aria-live="polite">{text.photoOf(shown + 1, count)}</span>
            <span aria-hidden="true"> · </span>
            <a href={current.credit.url} target="_blank" rel="noreferrer">
              {current.credit.author}
            </a>
            , {current.credit.source}
          </span>
        </figcaption>
      </figure>

      <button className={`${styles.arrow} ${styles.prev}`} type="button" aria-label={text.prev} onClick={() => go(-1)}>
        <ChevronLeft size={22} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label={text.next} onClick={() => go(1)}>
        <ChevronRight size={22} strokeWidth={1.6} aria-hidden="true" />
      </button>
    </MediaDialog>
  )
}

// --- Видео -------------------------------------------------------------------------------------
// Плеер появляется в разметке только в открытом окне: файл не грузится,
// пока гость не нажал «Смотреть видео», а закрытие окна останавливает его
// вместе с <video>. Звука в ролике нет — muted разрешает автозапуск во
// всех браузерах, управление — встроенное
export function FilmDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const text = ABOUT_PAGE[useLang()]

  return (
    <MediaDialog open={open} label={text.filmTitle} onClose={onClose}>
      <figure className={styles.figure}>
        <div className={`${styles.frame} ${styles.filmFrame}`}>{open && <Film />}</div>
        <figcaption className={styles.caption}>
          <span className={styles.captionTitle}>{text.filmTitle}</span>
          <span className={styles.captionMeta}>
            {text.filmNote}{' '}
            <a href={FILM.credit.url} target="_blank" rel="noreferrer">
              {FILM.credit.author}
            </a>
            , {FILM.credit.source}
          </span>
        </figcaption>
      </figure>
    </MediaDialog>
  )
}

// Ролик — H.264 в MP4: его играют все современные браузеры. Если браузер
// всё же не справился (нет кодека, файл не загрузился), вместо чёрного
// кадра — постер и понятное сообщение. Компонент создаётся заново при
// каждом открытии окна — ошибка прошлого раза не остаётся
function Film() {
  const text = ABOUT_PAGE[useLang()]
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={styles.filmError}
        style={{ backgroundImage: `linear-gradient(rgb(2 7 11 / 0.7), rgb(2 7 11 / 0.7)), url(${FILM.poster})` }}
      >
        <p role="status">{text.filmFallback}</p>
      </div>
    )
  }

  return (
    <video
      className={styles.film}
      src={FILM.src}
      poster={FILM.poster}
      controls
      autoPlay
      muted
      playsInline
      loop
      onError={() => setFailed(true)}
    >
      {text.filmFallback}
    </video>
  )
}
