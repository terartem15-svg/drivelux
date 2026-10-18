import { useEffect } from 'react'
import { useLang, type Localized } from '@/i18n/lang'

// Заголовок вкладки для страницы: «Наш автопарк — DriveLux». null — общий
// заголовок сайта (главная). Его же читает скринридер при переходе
const SITE_TITLE: Localized<string> = {
  ru: 'DriveLux — аренда премиальных автомобилей',
  en: 'DriveLux — premium car rental',
}

export function useDocumentTitle(title: string | null) {
  const lang = useLang()
  useEffect(() => {
    document.title = title ? `${title} — DriveLux` : SITE_TITLE[lang]
  }, [title, lang])
}
