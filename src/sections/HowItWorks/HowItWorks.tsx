import type { CSSProperties, ReactNode } from 'react'
import { BadgeCheck, IdCard, UserRound } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { SectionHeading } from '@/components/SectionHeading/SectionHeading'
import { HOW_IT_WORKS, REQUIREMENTS, STEPS, type RequirementIcon } from '@/content/howItWorks'
import { useLang } from '@/i18n/lang'
import { StepVisual } from './StepVisual'
import styles from './HowItWorks.module.css'
import { SiteLink } from '@/components/SiteLink/SiteLink'

const REQUIREMENT_ICONS: Record<RequirementIcon, ReactNode> = {
  passport: <IdCard size={18} strokeWidth={1.5} />,
  license: <BadgeCheck size={18} strokeWidth={1.5} />,
  age: <UserRound size={18} strokeWidth={1.5} />,
}

// «Как это работает»: слева заголовок, короткое пояснение, что понадобится
// для аренды, и кнопки «Забронировать» и «Условия аренды»; справа — три
// шага карточками, соединёнными линией. Нумерация здесь по делу: шаги
// действительно идут друг за другом.
//
// Сюда ведёт кнопка «Как это работает» первого экрана
export function HowItWorks() {
  const lang = useLang()
  const text = HOW_IT_WORKS[lang]
  return (
    <section className={`container ${styles.section}`} id="how-it-works" aria-labelledby="how-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <SectionHeading id="how-title" eyebrow={text.eyebrow} title={text.title} />
          <p className={styles.lead} data-reveal>
            {text.lead}
          </p>

          <div className={styles.needs} data-reveal style={{ '--reveal-order': 1 } as CSSProperties}>
            <p className={styles.needsTitle} id="how-needs">
              {text.requirementsTitle}
            </p>
            <ul className={styles.needsList} aria-labelledby="how-needs">
              {REQUIREMENTS.map((item) => (
                <li key={item.icon} className={styles.need}>
                  <span className={styles.needIcon} aria-hidden="true">
                    {REQUIREMENT_ICONS[item.icon]}
                  </span>
                  {item.label[lang]}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.actions} data-reveal style={{ '--reveal-order': 2 } as CSSProperties}>
            <Button href={text.primary.href} arrow>
              {text.primary.label}
            </Button>
            <SiteLink className={styles.rulesLink} href={text.secondary.href}>
              {text.secondary.label}
            </SiteLink>
          </div>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.id} className={styles.step} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>{step.title[lang]}</h3>
                <p className={styles.stepDescription}>{step.text[lang]}</p>
              </div>
              <StepVisual step={step.id} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
