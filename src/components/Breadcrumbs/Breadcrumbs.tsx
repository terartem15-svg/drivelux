import { Fragment } from 'react'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { useLang } from '@/i18n/lang'
import styles from './Breadcrumbs.module.css'

// Хлебные крошки: путь от главной до текущей страницы. Последняя крошка —
// текущая страница: она не ссылка, у неё aria-current. Косые черты между
// крошками — оформление, скринридер их не читает
export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const lang = useLang()
  return (
    <nav className={className} aria-label={lang === 'ru' ? 'Навигационная цепочка' : 'Breadcrumbs'}>
      <ol className={styles.crumbs}>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            <li className={styles.crumb}>
              {crumb.href ? (
                <SiteLink className={styles.link} href={crumb.href}>
                  {crumb.label}
                </SiteLink>
              ) : (
                <span aria-current="page" translate="no">
                  {crumb.label}
                </span>
              )}
            </li>
            {index < crumbs.length - 1 && (
              <li className={styles.separator} aria-hidden="true">
                /
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
