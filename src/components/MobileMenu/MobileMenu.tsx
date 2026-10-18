import { Heart, LogOut, Phone, UserRound, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { Button } from '@/components/Button/Button'
import { LangToggle } from '@/components/LangSwitch/LangSwitch'
import { Logo } from '@/components/Logo/Logo'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { SOCIAL_PATHS } from '@/components/icons/logoPaths'
import { SimpleIcon } from '@/components/icons/SimpleIcon'
import { CLASS_ORDER, CLASS_TITLES, classHref } from '@/content/fleet'
import { CONTACTS, HEADER_ACTIONS, NAV_LINKS, ROUTES } from '@/content/site'
import { VEHICLES } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { initials, logout, useUser } from '@/store/auth'
import { useFavorites } from '@/store/favorites'
import styles from './MobileMenu.module.css'

// Мобильное меню — панель справа по кнопке-бургеру (≤1240px, когда пункты
// меню не помещаются в шапку). Нативный <dialog> в модальном режиме, как
// панель фильтров каталога: браузер держит фокус внутри, Esc и клик по
// затемнению закрывают её, страница под ней не прокручивается.
//
// Внутри — всё, что в шапке не поместилось: разделы сайта (у «Автопарка» —
// классы машин), программа лояльности и отзывы, язык, вход или имя
// вошедшего, «Забронировать» и телефон. Переход по любой ссылке закрывает
// меню — его закрывает смена адреса страницы
const TEXT = localized(
  {
    title: 'Меню',
    close: 'Закрыть меню',
    loyalty: 'Программа лояльности',
    reviews: 'Отзывы',
    language: 'Язык',
    account: 'Аккаунт',
    register: 'Регистрация',
    favorites: 'Избранное',
    logout: 'Выйти',
    support: 'Поддержка 24/7',
  },
  {
    title: 'Menu',
    close: 'Close menu',
    loyalty: 'Loyalty programme',
    reviews: 'Reviews',
    language: 'Language',
    account: 'Account',
    register: 'Sign up',
    favorites: 'Favourites',
    logout: 'Sign out',
    support: 'Support 24/7',
  },
)

const CLASSES = CLASS_ORDER.map((key) => ({ key, count: VEHICLES.filter((item) => item.class === key).length })).filter(
  (item) => item.count > 0,
)

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const lang = useLang()
  const text = TEXT[lang]
  const user = useUser()
  const favorites = useFavorites()
  const location = useLocation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      panelRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Переход на другую страницу или к секции — меню закрывается
  const address = `${location.pathname}${location.search}${location.hash}`
  const lastAddress = useRef(address)
  useEffect(() => {
    if (lastAddress.current === address) return
    lastAddress.current = address
    onClose()
  }, [address, onClose])

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      aria-label={text.title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div ref={panelRef} className={styles.panel} tabIndex={-1}>
        <div className={styles.head}>
          <SiteLink className={styles.brand} href={ROUTES.home} aria-label="DriveLux" onClick={onClose}>
            <Logo />
          </SiteLink>
          <button className={styles.close} type="button" aria-label={text.close} onClick={onClose}>
            <X size={22} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          {/* --- Разделы ------------------------------------------------------------------ */}
          <nav aria-label={text.title}>
            <ul className={styles.nav}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <SiteLink className={styles.navLink} href={link.href} nav onClick={onClose}>
                    {link.label[lang]}
                  </SiteLink>
                  {link.href === ROUTES.fleet && (
                    <ul className={styles.classes}>
                      {CLASSES.map((item) => (
                        <li key={item.key}>
                          <SiteLink className={styles.classLink} href={classHref(item.key)} onClick={onClose}>
                            {CLASS_TITLES[lang][item.key]}
                            <span className={styles.classCount}>{item.count}</span>
                          </SiteLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <SiteLink className={styles.navLink} href={ROUTES.loyalty} nav onClick={onClose}>
                  {text.loyalty}
                </SiteLink>
              </li>
              <li>
                <SiteLink className={styles.navLink} href={ROUTES.reviews} nav onClick={onClose}>
                  {text.reviews}
                </SiteLink>
              </li>
            </ul>
          </nav>

          {/* --- Аккаунт ------------------------------------------------------------------ */}
          <section className={styles.block} aria-label={text.account}>
            {user ? (
              <div className={styles.user}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(user.name)}
                </span>
                <span className={styles.userText}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </span>
                <button className={styles.iconAction} type="button" aria-label={text.logout} onClick={logout}>
                  <LogOut size={18} strokeWidth={1.6} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Button
                  variant="outline"
                  href={ROUTES.login}
                  icon={<UserRound size={18} strokeWidth={1.6} aria-hidden="true" />}
                >
                  {HEADER_ACTIONS.login.label[lang]}
                </Button>
                <Button variant="ghost" href={ROUTES.register}>
                  {text.register}
                </Button>
              </div>
            )}
            <SiteLink className={styles.favorites} href={ROUTES.favorites} onClick={onClose}>
              <Heart size={18} strokeWidth={1.6} aria-hidden="true" />
              {text.favorites}
              {favorites.length > 0 && <span className={styles.badge}>{favorites.length}</span>}
            </SiteLink>
          </section>

          <section className={styles.block} aria-label={text.language}>
            <p className={styles.blockTitle} aria-hidden="true">
              {text.language}
            </p>
            <LangToggle />
          </section>
        </div>

        {/* --- Низ: бронь и связь -------------------------------------------------------------- */}
        <div className={styles.foot}>
          <Button className={styles.book} href={HEADER_ACTIONS.book.href} size="lg" arrow>
            {HEADER_ACTIONS.book.label[lang]}
          </Button>
          <div className={styles.contacts}>
            <a className={styles.phone} href={CONTACTS.phone.href}>
              <Phone size={16} strokeWidth={1.6} aria-hidden="true" />
              <span>
                {CONTACTS.phone.label}
                <span className={styles.phoneNote}>{text.support}</span>
              </span>
            </a>
            <SiteLink className={styles.messenger} href={CONTACTS.telegram} aria-label="Telegram" onClick={onClose}>
              <SimpleIcon className={styles.messengerLogo} path={SOCIAL_PATHS.telegram} />
            </SiteLink>
            <SiteLink className={styles.messenger} href={CONTACTS.whatsapp} aria-label="WhatsApp" onClick={onClose}>
              <SimpleIcon className={styles.messengerLogo} path={SOCIAL_PATHS.whatsapp} />
            </SiteLink>
          </div>
        </div>
      </div>
    </dialog>
  )
}
