import { Heart } from 'lucide-react'
import { useState } from 'react'
import { localized, useLang } from '@/i18n/lang'
import { toggleFavorite, useIsFavorite } from '@/store/favorites'
import styles from './FavoriteButton.module.css'

// Кнопка «в избранное» — одна на весь сайт, состояние берёт из общего
// хранилища (store/favorites): нажал на карточке — сердечко сразу
// закрасилось и на странице машины, и в счётчике шапки.
//  - icon — круглая кнопка поверх фото карточки;
//  - full — кнопка с подписью на странице машины.
// У круглой кнопки подпись для скринридера не меняется, а выбрана ли машина,
// говорит aria-pressed — «Избранное: Lamborghini Huracán, нажата». У кнопки
// с подписью состояние видно в самом тексте («В избранное» → «В избранном»),
// и aria-pressed там не нужен: иначе скринридер сказал бы его дважды.
// Сердечко «подпрыгивает» только в момент добавления, а не при каждой
// отрисовке уже выбранной машины
const TEXT = localized(
  { label: (name: string) => `Избранное: ${name}`, add: 'В избранное', added: 'В избранном' },
  { label: (name: string) => `Favourite: ${name}`, add: 'Add to favourites', added: 'In favourites' },
)

interface FavoriteButtonProps {
  id: string
  name: string
  variant?: 'icon' | 'full'
  className?: string
}

export function FavoriteButton({ id, name, variant = 'icon', className }: FavoriteButtonProps) {
  const active = useIsFavorite(id)
  const text = TEXT[useLang()]
  const [pop, setPop] = useState(false)

  function handleClick() {
    if (!active) setPop(true)
    toggleFavorite(id)
  }

  return (
    <button
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      type="button"
      aria-pressed={variant === 'icon' ? active : undefined}
      aria-label={variant === 'icon' ? text.label(name) : undefined}
      data-active={active ? '' : undefined}
      onClick={handleClick}
    >
      <Heart
        className={styles.heart}
        data-pop={pop ? '' : undefined}
        onAnimationEnd={() => setPop(false)}
        size={18}
        strokeWidth={1.6}
        aria-hidden="true"
      />
      {variant === 'full' && <span>{active ? text.added : text.add}</span>}
    </button>
  )
}
