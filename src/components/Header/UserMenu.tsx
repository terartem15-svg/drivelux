import { ChevronDown, Crown, Heart, LogOut } from 'lucide-react'
import { useCallback, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { ROUTES } from '@/content/site'
import { localized, useLang } from '@/i18n/lang'
import { initials, logout, type Account } from '@/store/auth'
import { useFavorites } from '@/store/favorites'
import { useDismiss } from '@/utils/useDismiss'
import styles from './UserMenu.module.css'

// Меню вошедшего гостя — на месте кнопки «Войти»: кружок с инициалами и
// имя. Нажатие открывает короткий список: избранное, программа
// лояльности и выход. Личного кабинета у демо нет — аккаунт нужен, чтобы
// показать, как работает вход, и хранится только в этом браузере
const TEXT = localized(
  {
    label: (name: string) => `Аккаунт: ${name}`,
    favorites: 'Избранное',
    loyalty: 'Программа лояльности',
    logout: 'Выйти',
    note: 'Аккаунт хранится только в этом браузере',
  },
  {
    label: (name: string) => `Account: ${name}`,
    favorites: 'Favourites',
    loyalty: 'Loyalty programme',
    logout: 'Sign out',
    note: 'The account lives only in this browser',
  },
)

export function UserMenu({ user, className }: { user: Account; className?: string }) {
  const lang = useLang()
  const text = TEXT[lang]
  const favorites = useFavorites()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const close = useCallback(() => setOpen(false), [])
  useDismiss(open, close, rootRef, buttonRef)

  // Переход на другую страницу закрывает меню
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpen(false)
  }

  const firstName = user.name.split(/\s+/)[0] ?? user.name

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      <button
        ref={buttonRef}
        className={styles.button}
        type="button"
        aria-label={text.label(user.name)}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.avatar} aria-hidden="true">
          {initials(user.name)}
        </span>
        <span className={styles.name} aria-hidden="true">
          {firstName}
        </span>
        <ChevronDown className={styles.chevron} size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <div className={styles.menu} id={menuId} hidden={!open}>
        <div className={styles.head}>
          <p className={styles.fullName}>{user.name}</p>
          <p className={styles.email}>{user.email}</p>
        </div>
        <ul className={styles.list}>
          <li>
            <SiteLink className={styles.item} href={ROUTES.favorites}>
              <Heart size={16} strokeWidth={1.6} aria-hidden="true" />
              {text.favorites}
              {favorites.length > 0 && <span className={styles.count}>{favorites.length}</span>}
            </SiteLink>
          </li>
          <li>
            <SiteLink className={styles.item} href={ROUTES.loyalty}>
              <Crown size={16} strokeWidth={1.6} aria-hidden="true" />
              {text.loyalty}
            </SiteLink>
          </li>
          <li>
            <button
              className={styles.item}
              type="button"
              onClick={() => {
                logout()
                setOpen(false)
              }}
            >
              <LogOut size={16} strokeWidth={1.6} aria-hidden="true" />
              {text.logout}
            </button>
          </li>
        </ul>
        <p className={styles.note}>{text.note}</p>
      </div>
    </div>
  )
}
