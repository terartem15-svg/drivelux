import { Heart, Menu, Search, UserRound } from 'lucide-react'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { LangSwitch } from '@/components/LangSwitch/LangSwitch'
import { Logo } from '@/components/Logo/Logo'
import { MobileMenu } from '@/components/MobileMenu/MobileMenu'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { HEADER_ACTIONS, NAV_LINKS, ROUTES } from '@/content/site'
import { localized, useLang } from '@/i18n/lang'
import { useUser } from '@/store/auth'
import { useFavorites } from '@/store/favorites'
import { countLabel } from '@/utils/format'
import { FleetMenu } from './FleetMenu'
import { UserMenu } from './UserMenu'
import styles from './Header.module.css'

// Шапка по раскладке референса: логотип, меню чуть правее него (не по
// центру), справа — поиск, язык, избранное, «Войти» и золотая
// «Забронировать». Под шапкой — тонкая линия во всю ширину экрана.
//
// overlay — на главной шапка лежит поверх фото первого экрана, на остальных
// страницах стоит в потоке над содержимым. Активный пункт меню подсвечивает
// сам роутер (SiteLink с nav): «Автопарк» горит и в каталоге, и на странице
// машины. У «Автопарка» — выпадающее меню с классами и марками (FleetMenu).
//
// Поиск открывает окно поиска по сайту (SiteSearch) — и кнопкой, и с
// клавиатуры: «/» или Ctrl+K. Язык — сразу за поиском. После входа на
// месте «Войти» — меню аккаунта с именем (UserMenu).
//
// На узких экранах (≤1240px) пункты меню уходят за кнопку-бургер — она
// открывает мобильное меню (MobileMenu); на телефоне туда же уходят «Войти»
// и «Забронировать». Поиск, язык и избранное остаются в шапке всегда.
//
// id="top" — цель ссылки «Наверх» в подвале: шапка первая на любой странице
// Окно поиска — отдельным файлом: оно и его индекс (машины, услуги на двух
// языках) грузятся при первом открытии поиска, а не с главной страницей
const SiteSearch = lazy(() =>
  import('@/components/SiteSearch/SiteSearch').then((module) => ({ default: module.SiteSearch })),
)

const TEXT = localized(
  {
    home: 'DriveLux — на главную',
    nav: 'Основное меню',
    search: 'Поиск по сайту',
    menu: 'Открыть меню',
    cars: { one: 'машина', few: 'машины', many: 'машин' },
  },
  {
    home: 'DriveLux — home',
    nav: 'Main menu',
    search: 'Search the site',
    menu: 'Open menu',
    cars: { one: 'car', few: 'cars', many: 'cars' },
  },
)

export function Header({ overlay = false }: { overlay?: boolean }) {
  const lang = useLang()
  const text = TEXT[lang]
  const favorites = useFavorites()
  const user = useUser()
  const [searchOpen, setSearchOpen] = useState(false)
  // Поиск хоть раз открывали — с этого момента окно держится в разметке
  // (закрытое), чтобы повторное открытие было мгновенным
  const [searchUsed, setSearchUsed] = useState(false)
  if (searchOpen && !searchUsed) setSearchUsed(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // «Избранное: 2 машины» — скринридер слышит число, которое видно на капле
  const count = favorites.length
  const favoritesLabel = HEADER_ACTIONS.favorites.label[lang]
  const favoritesAria = count > 0 ? `${favoritesLabel}: ${countLabel(count, text.cars, lang)}` : favoritesLabel

  // --- Горячие клавиши поиска ----------------------------------------------------------
  // «/» — если фокус не в поле ввода (иначе это просто символ), Ctrl+K и ⌘K —
  // откуда угодно
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]')
      const shortcut =
        (event.key === 'k' || event.key === 'K' || event.key === 'л' || event.key === 'Л') &&
        (event.ctrlKey || event.metaKey)
      if (shortcut || (event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey)) {
        if (document.querySelector('dialog[open]') && !searchOpen) return
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [searchOpen])

  return (
    <header className={`${styles.header} ${overlay ? styles.overlay : ''}`} id="top">
      <div className={`container ${styles.inner}`}>
        <SiteLink className={styles.brand} href={ROUTES.home} aria-label={text.home}>
          <Logo />
        </SiteLink>

        <nav className={styles.nav} aria-label={text.nav}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) =>
              link.href === ROUTES.fleet ? (
                <FleetMenu key={link.href} label={link.label[lang]} linkClassName={styles.navLink} />
              ) : (
                <li key={link.href} className={styles.navItem}>
                  <SiteLink className={styles.navLink} href={link.href} nav>
                    {link.label[lang]}
                  </SiteLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.iconButton}
            type="button"
            aria-label={text.search}
            aria-haspopup="dialog"
            aria-keyshortcuts="/ Control+K"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
          <LangSwitch className={styles.lang} />
          <SiteLink
            className={`${styles.iconButton} ${styles.favorites}`}
            href={HEADER_ACTIONS.favorites.href}
            nav
            aria-label={favoritesAria}
          >
            <Heart size={20} strokeWidth={1.6} aria-hidden="true" />
            {count > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {count}
              </span>
            )}
          </SiteLink>
          {user ? (
            <UserMenu className={styles.login} user={user} />
          ) : (
            <Button
              className={styles.login}
              variant="outline"
              href={HEADER_ACTIONS.login.href}
              icon={<UserRound size={18} strokeWidth={1.6} aria-hidden="true" />}
            >
              {/* На средних ширинах подпись прячется, остаётся иконка — но
                  для скринридера слово «Войти» остаётся (Header.module.css) */}
              <span className={styles.loginLabel}>{HEADER_ACTIONS.login.label[lang]}</span>
            </Button>
          )}
          <Button className={styles.book} href={HEADER_ACTIONS.book.href} arrow>
            {HEADER_ACTIONS.book.label[lang]}
          </Button>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={text.menu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>

      {searchUsed && (
        <Suspense fallback={null}>
          <SiteSearch open={searchOpen} onClose={closeSearch} />
        </Suspense>
      )}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  )
}
