import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useLang } from '@/i18n/lang'
import styles from './FleetPage.module.css'

// Выдвижная панель фильтров для планшета и телефона — нативный <dialog>
// в модальном режиме (showModal): браузер сам держит фокус внутри панели,
// закрывает её по Esc и делает страницу под ней недоступной для Tab и
// скринридера. Клик по затемнению вокруг панели тоже закрывает её.
// Выезд справа и затухание фона — в CSS (FleetPage.module.css, .drawer).
//
// Внизу — закреплённая строка с действиями: «Сбросить» и «Показать N
// автомобилей»; число меняется вместе с фильтрами, видно, к чему ведёт выбор
interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  footer: ReactNode
}

export function FilterDrawer({ open, onClose, children, footer }: FilterDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lang = useLang()

  // Фокус при открытии — на саму панель, а не на крестик (браузер по
  // умолчанию выбрал бы первую кнопку и обвёл бы её золотым контуром).
  // Скринридер прочтёт название панели, Tab поведёт по фильтрам
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      panelRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-labelledby="filters-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div ref={panelRef} className={styles.drawerPanel} tabIndex={-1}>
        <div className={styles.drawerHead}>
          <h2 className={styles.drawerTitle} id="filters-title">
            {lang === 'ru' ? 'Фильтры' : 'Filters'}
          </h2>
          <button
            className={styles.drawerClose}
            type="button"
            aria-label={lang === 'ru' ? 'Закрыть фильтры' : 'Close filters'}
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.drawerBody}>{children}</div>
        <div className={styles.drawerFoot}>{footer}</div>
      </div>
    </dialog>
  )
}
