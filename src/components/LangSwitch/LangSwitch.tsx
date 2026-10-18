import { Check, ChevronDown, Globe } from 'lucide-react'
import { useCallback, useId, useRef, useState } from 'react'
import { LANGS, setLang, useLang, type Lang, type Localized } from '@/i18n/lang'
import { useDismiss } from '@/utils/useDismiss'
import styles from './LangSwitch.module.css'

// Переключатель языка из референса: «RU» и стрелка вниз в тонкой рамке.
// Нажатие открывает короткий список языков; выбор меняет язык всего сайта
// сразу, без перезагрузки (i18n/lang). Стоит в шапке рядом с поиском и в
// подвале; в подвале список открывается вверх — снизу нет места.
//
// Названия языков — каждое на своём языке («Русский», «English»), с
// атрибутом lang: так их узнает и прочтёт правильно любой посетитель
const NAMES: Localized<string> = { ru: 'Русский', en: 'English' }

const LABEL: Localized<(name: string) => string> = {
  ru: (name) => `Язык сайта: ${name.toLowerCase()}`,
  en: (name) => `Site language: ${name}`,
}

interface LangSwitchProps {
  className?: string
  placement?: 'bottom' | 'top'
}

export function LangSwitch({ className, placement = 'bottom' }: LangSwitchProps) {
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const close = useCallback(() => setOpen(false), [])
  useDismiss(open, close, rootRef, buttonRef)

  function choose(next: Lang) {
    setLang(next)
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      <button
        ref={buttonRef}
        className={styles.lang}
        type="button"
        aria-label={LABEL[lang](NAMES[lang])}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{lang.toUpperCase()}</span>
        <ChevronDown className={styles.chevron} size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <ul
        className={styles.menu}
        id={listId}
        data-open={open ? '' : undefined}
        data-placement={placement}
        hidden={!open}
      >
        {LANGS.map((code) => (
          <li key={code}>
            <button
              className={styles.option}
              type="button"
              lang={code}
              aria-current={code === lang ? 'true' : undefined}
              onClick={() => choose(code)}
            >
              <Globe className={styles.optionIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className={styles.optionName}>{NAMES[code]}</span>
              <span className={styles.optionCode} aria-hidden="true">
                {code.toUpperCase()}
              </span>
              {code === lang && <Check className={styles.check} size={16} strokeWidth={2} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Переключатель-«таблетки» для мобильного меню: оба языка видны сразу,
// выбор — одним касанием
export function LangToggle({ className }: { className?: string }) {
  const lang = useLang()
  return (
    <div
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      role="group"
      aria-label={lang === 'ru' ? 'Язык сайта' : 'Site language'}
    >
      {LANGS.map((code) => (
        <button
          key={code}
          className={styles.toggleButton}
          type="button"
          lang={code}
          aria-pressed={code === lang}
          onClick={() => setLang(code)}
        >
          {NAMES[code]}
        </button>
      ))}
    </div>
  )
}
