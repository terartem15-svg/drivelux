import { Compass } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { ROUTES } from '@/content/site'
import { localized, useLang } from '@/i18n/lang'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import styles from './NotFoundPage.module.css'

// «Страница не найдена» — для неизвестного адреса и для машины, которой
// нет в автопарке (страница машины передаёт свои заголовок и текст).
// Сразу два выхода: в каталог и на главную
const TEXT = localized(
  {
    title: 'Страница не найдена',
    text: 'Такой страницы на сайте нет — возможно, в адресе опечатка. Начните с автопарка или вернитесь на главную.',
    errorTitle: 'Не удалось открыть страницу',
    errorText: 'Похоже, пропало соединение или сайт обновился. Обновите страницу или начните с автопарка.',
    fleet: 'Перейти в автопарк',
    home: 'На главную',
  },
  {
    title: 'Page not found',
    text: 'There is no such page on the site — perhaps there is a typo in the address. Start with the fleet or go back home.',
    errorTitle: 'Could not open the page',
    errorText: 'The connection seems to have dropped or the site has been updated. Reload the page or start with the fleet.',
    fleet: 'Go to the fleet',
    home: 'Back home',
  },
)

// variant="error" — сбой при открытии страницы (не загрузился её файл):
// свой заголовок и текст на языке сайта
interface NotFoundPageProps {
  title?: string
  text?: string
  variant?: 'not-found' | 'error'
}

export function NotFoundPage({ title: customTitle, text: customText, variant = 'not-found' }: NotFoundPageProps) {
  const copy = TEXT[useLang()]
  const title = customTitle ?? (variant === 'error' ? copy.errorTitle : copy.title)
  const text = customText ?? (variant === 'error' ? copy.errorText : copy.text)
  useDocumentTitle(title)

  return (
    <div className={`container ${styles.page}`}>
      <EmptyState
        headingLevel="h1"
        icon={<Compass />}
        title={title}
        text={text}
        action={
          <>
            <Button href={ROUTES.fleet} arrow>
              {copy.fleet}
            </Button>
            <Button href={ROUTES.home} variant="ghost">
              {copy.home}
            </Button>
          </>
        }
      />
    </div>
  )
}
