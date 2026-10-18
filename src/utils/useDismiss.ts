import { useEffect, type RefObject } from 'react'

// Закрытие всплывающего блока (меню языка, меню профиля, выпадающие списки
// панели поиска): клик или касание за его пределами и клавиша Esc. По Esc
// фокус возвращается на кнопку, которая блок открыла, — с клавиатуры не
// теряется место на странице
export function useDismiss(
  open: boolean,
  close: () => void,
  container: RefObject<HTMLElement | null>,
  trigger?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return

    function handlePointer(event: PointerEvent) {
      const target = event.target as Node
      if (container.current?.contains(target) || trigger?.current?.contains(target)) return
      close()
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      close()
      trigger?.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, close, container, trigger])
}
