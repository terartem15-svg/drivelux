import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

// Пустое состояние — когда показывать нечего: фильтры ничего не нашли,
// в избранном пусто, машины с таким адресом нет. Не «ничего нет», а
// подсказка, что делать дальше: иконка, короткий заголовок, одно-два
// предложения и действие
interface EmptyStateProps {
  icon: ReactNode
  title: string
  text: ReactNode
  action?: ReactNode
  headingLevel?: 'h1' | 'h2' | 'h3'
}

export function EmptyState({ icon, title, text, action, headingLevel: Heading = 'h2' }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <Heading className={styles.title}>{title}</Heading>
      <p className={styles.text}>{text}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
