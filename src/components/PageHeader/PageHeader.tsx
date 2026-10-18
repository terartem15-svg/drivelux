import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs/Breadcrumbs'
import styles from './PageHeader.module.css'

// Шапка внутренней страницы: хлебные крошки, заголовок h1 и вводный текст.
// Справа — своё содержимое страницы (поиск в каталоге, кнопка «Очистить»
// в избранном), снизу — children (быстрые категории каталога)
interface PageHeaderProps {
  crumbs: Crumb[]
  title: ReactNode
  lead?: ReactNode
  aside?: ReactNode
  children?: ReactNode
}

export function PageHeader({ crumbs, title, lead, aside, children }: PageHeaderProps) {
  return (
    <div className={`container ${styles.head}`}>
      <Breadcrumbs crumbs={crumbs} />

      <div className={styles.row}>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>

      {children}
    </div>
  )
}
