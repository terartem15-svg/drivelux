import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/SectionHeading/SectionHeading'
import { MOODS, MOODS_SECTION, moodHref } from '@/content/moods'
import { useLang } from '@/i18n/lang'
import styles from './Moods.module.css'
import { SiteLink } from '@/components/SiteLink/SiteLink'

// «Автомобиль под настроение»: четыре категории большими карточками-фото
// в мозаике — «Спорт» высокой карточкой слева, справа сверху «Бизнес» и
// «Внедорожники», под ними широкая «Для особого случая». После ровного ряда
// машин и строки логотипов мозаика меняет ритм страницы.
//
// Вся карточка — ссылка в каталог с отбором по категории. Фото на всю
// карточку декоративное (alt пустой): категорию называет заголовок. У
// категории без фото — своя атмосфера из градиентов: огни трассы у спорта,
// холодное стекло у бизнеса, закат над холмами у внедорожников и тёплые
// огоньки праздника у особого случая
export function Moods() {
  const lang = useLang()
  const text = MOODS_SECTION[lang]
  return (
    <section className={`container ${styles.section}`} id="services" aria-labelledby="moods-title">
      <SectionHeading
        id="moods-title"
        eyebrow={text.eyebrow}
        title={text.title}
        aside={<p className={styles.note}>{text.note}</p>}
      />

      <ul className={styles.grid}>
        {MOODS.map((mood, index) => (
          <li
            key={mood.id}
            className={`${styles.item} ${styles[mood.id]}`}
            data-reveal
            style={{ '--reveal-order': index } as CSSProperties}
          >
            <SiteLink className={styles.card} href={moodHref(mood.id)}>
              <div className={styles.media} aria-hidden="true">
                {mood.image ? (
                  <img
                    className={styles.photo}
                    src={mood.image.src}
                    alt=""
                    loading="lazy"
                    style={
                      {
                        '--focus': mood.image.focus,
                        '--focus-tall': mood.image.focusTall,
                        '--tone': mood.image.tone,
                      } as CSSProperties
                    }
                  />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>

              <div className={styles.text}>
                <h3 className={styles.title}>{mood.title[lang]}</h3>
                <p className={styles.description}>{mood.text[lang]}</p>
              </div>

              {/* Число машин — в углу карточки, но в разметке после текста:
                  скринридер сначала прочтёт название категории */}
              <span className={styles.count}>
                {mood.count}&nbsp;{text.cars}
              </span>
              <span className={styles.arrow} aria-hidden="true">
                <ArrowUpRight size={20} strokeWidth={1.5} />
              </span>
            </SiteLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
