import type { CSSProperties, ReactNode } from 'react'
import { CalendarDays, CarFront, ShieldHalf } from 'lucide-react'
import { Support24 } from '@/components/icons/Support24'
import { FEATURES, FEATURES_TITLE, type FeatureIcon } from '@/content/features'
import { useLang } from '@/i18n/lang'
import styles from './Features.module.css'

// Иконки преимуществ по ключу из content/features.ts. Все — тонкий золотой
// штрих в одинаковом размере: четыре пункта читаются одним рядом
const ICONS: Record<FeatureIcon, ReactNode> = {
  fleet: <CarFront size={22} strokeWidth={1.5} />,
  support: <Support24 size={22} strokeWidth={1.5} />,
  insurance: <ShieldHalf size={22} strokeWidth={1.5} />,
  terms: <CalendarDays size={22} strokeWidth={1.5} />,
}

// Ряд из четырёх преимуществ под панелью поиска: кружок с иконкой, заголовок
// и короткое пояснение, между пунктами — тонкие вертикальные линии, под
// рядом — линия во всю ширину колонки, отделяющая первый экран от каталога
export function Features() {
  const lang = useLang()
  return (
    <section className="container" aria-labelledby="features-title">
      {/* Заголовок только для скринридеров: визуально ряд говорит сам за
          себя, а в структуре страницы секция не должна быть безымянной */}
      <h2 className="visually-hidden" id="features-title">
        {FEATURES_TITLE[lang]}
      </h2>
      <ul className={styles.list}>
        {FEATURES.map((feature, index) => (
          <li
            key={feature.icon}
            className={styles.item}
            data-reveal
            style={{ '--reveal-order': index } as CSSProperties}
          >
            <span className={styles.icon} aria-hidden="true">
              {ICONS[feature.icon]}
            </span>
            <div>
              <h3 className={styles.title}>{feature.title[lang]}</h3>
              <p className={styles.text}>
                {feature.text[lang].map((line, lineIndex) => (
                  <span key={line} className={styles.textLine}>
                    {lineIndex > 0 && ' '}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
