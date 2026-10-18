import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import styles from './SectionHeading.module.css'
import { SiteLink } from '@/components/SiteLink/SiteLink'

// Шапка секции по референсу: мелкий надзаголовок с разрядкой, под ним —
// заголовок. Справа — ссылка вида «Весь автопарк →» и/или своё содержимое
// (рейтинг в отзывах, пояснение в категориях).
//
// id — у заголовка: на него ссылается aria-labelledby секции, так у секции
// в дереве доступности то же имя, что и на экране. Шапка проявляется при
// прокрутке (data-reveal, components/RevealManager) — первой в своей секции
interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: ReactNode
  link?: { label: string; href: string }
  aside?: ReactNode
  className?: string
}

export function SectionHeading({ id, eyebrow, title, link, aside, className }: SectionHeadingProps) {
  return (
    <div className={[styles.head, className].filter(Boolean).join(' ')} data-reveal>
      <hgroup>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title} id={id}>
          {title}
        </h2>
      </hgroup>

      {(aside || link) && (
        <div className={styles.side}>
          {aside}
          {link && (
            <SiteLink className={styles.link} href={link.href}>
              {link.label}
              <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </SiteLink>
          )}
        </div>
      )}
    </div>
  )
}
