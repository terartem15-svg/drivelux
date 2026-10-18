import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useDismiss } from '@/utils/useDismiss'
import { useMediaQuery } from '@/utils/useMediaQuery'
import styles from './SearchPanel.module.css'

// Всплывающий блок поля панели поиска: места и даты получения и возврата,
// класс машины. На десктопе и планшете — выпадающая карточка под полем, на
// телефоне — шторка снизу экрана поверх затемнения: под пальцем ей нужен
// весь экран по ширине. Шторка выносится в конец <body> (портал), чтобы её
// не обрезали и не сдвигали родительские блоки первого экрана.
//
// Закрывается кликом мимо, клавишей Esc (фокус возвращается на поле) и
// кнопкой «Готово» внутри. При открытии фокус переходит на сам блок —
// скринридер читает его название, Tab ведёт по содержимому
const PHONE = '(max-width: 640px)'

interface FieldPopoverProps {
  open: boolean
  onClose: () => void
  trigger: RefObject<HTMLElement | null>
  label: string
  closeLabel: string
  align?: 'start' | 'end'
  wide?: boolean
  children: ReactNode
  id: string
}

export function FieldPopover({
  open,
  onClose,
  trigger,
  label,
  closeLabel,
  align = 'start',
  wide = false,
  children,
  id,
}: FieldPopoverProps) {
  const isPhone = useMediaQuery(PHONE)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(open, onClose, ref, trigger)

  useEffect(() => {
    if (open) ref.current?.focus({ preventScroll: !isPhone })
  }, [open, isPhone])

  // Шторка на телефоне: страница под ней не прокручивается
  useEffect(() => {
    if (!open || !isPhone) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [open, isPhone])

  if (!open) return null

  const popover = (
    <div
      ref={ref}
      id={id}
      className={isPhone ? styles.sheet : styles.popover}
      data-align={align}
      data-wide={wide ? '' : undefined}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
    >
      {isPhone && (
        <div className={styles.sheetHead}>
          <p className={styles.sheetTitle}>{label}</p>
          <button className={styles.sheetClose} type="button" aria-label={closeLabel} onClick={onClose}>
            <X size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      )}
      {children}
    </div>
  )

  if (!isPhone) return popover

  return createPortal(
    <>
      <div className={styles.sheetBackdrop} aria-hidden="true" />
      {popover}
    </>,
    document.body,
  )
}
