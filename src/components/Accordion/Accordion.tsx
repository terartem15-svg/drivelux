import { Plus } from 'lucide-react'
import styles from './Accordion.module.css'

// Список вопросов с раскрывающимися ответами — «Частые вопросы» на главной
// и вопросы на странице услуги.
//
// Вопросы — нативные <details>/<summary>: раскрываются без скриптов, с
// клавиатуры и скринридером «из коробки», повторное нажатие закрывает
// ответ. Общий name делает список «аккордеоном» — открытие одного ответа
// закрывает другой. Плавное раскрытие — чистым CSS (::details-content), где
// браузер его умеет
export interface AccordionItem {
  id: string
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  name: string
  // Открыть первый ответ сразу
  openFirst?: boolean
  className?: string
}

export function Accordion({ items, name, openFirst = false, className }: AccordionProps) {
  return (
    <div className={[styles.list, className].filter(Boolean).join(' ')}>
      {items.map((item, index) => (
        <details key={item.id} className={styles.item} name={name} open={openFirst && index === 0}>
          <summary className={styles.question}>
            <span>{item.question}</span>
            <span className={styles.toggle} aria-hidden="true">
              <Plus size={18} strokeWidth={1.6} />
            </span>
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
