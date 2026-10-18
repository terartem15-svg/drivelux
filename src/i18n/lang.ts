import { useSyncExternalStore } from 'react'

// Язык сайта — русский или английский. Один источник на весь сайт: шапка,
// подвал, страницы и тексты из content/ подписаны на это хранилище и
// перерисовываются вместе, без перезагрузки страницы и без сброса форм.
//
// Выбор хранится в localStorage и переживает перезагрузку. Адреса страниц
// одинаковые для обоих языков: сайт — концепт без сервера, отдельные /en/…
// здесь ничего бы не дали. При первом визите — русский: это основной язык
// сайта, английский включается переключателем в шапке.
//
// <html lang> меняется вместе с языком: по нему скринридер выбирает
// произношение, а браузер — правила переносов и кавычек
export type Lang = 'ru' | 'en'

export const LANGS: Lang[] = ['ru', 'en']

// Значение на каждом языке: строка, список, объект с текстами блока
export type Localized<T> = Record<Lang, T>

// Тексты блока на двух языках с одинаковой формой: английский обязан
// повторить все поля русского — забытый перевод станет ошибкой типов
export function localized<T>(ru: T, en: NoInfer<T>): Localized<T> {
  return { ru, en }
}

// Локали для Intl: числа, даты, правила множественного числа
export const LOCALES: Localized<string> = { ru: 'ru-RU', en: 'en-GB' }

const STORAGE_KEY = 'drivelux:lang'

// --- Чтение и запись --------------------------------------------------------------
// localStorage может быть недоступен (приватный режим, запрет cookie) —
// тогда язык живёт до перезагрузки
function read(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ru'
  } catch {
    return 'ru'
  }
}

let current: Lang = read()
const listeners = new Set<() => void>()

function apply(lang: Lang) {
  if (typeof document !== 'undefined') document.documentElement.lang = lang
}

apply(current)

export function setLang(next: Lang) {
  if (next === current) return
  current = next
  apply(next)
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Не запомнится — не страшно
  }
  listeners.forEach((listener) => listener())
}

// Язык, сменённый в соседней вкладке, приходит событием storage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    const next = read()
    if (next === current) return
    current = next
    apply(next)
    listeners.forEach((listener) => listener())
  })
}

export function getLang(): Lang {
  return current
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// --- Хук ---------------------------------------------------------------------------
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang)
}
