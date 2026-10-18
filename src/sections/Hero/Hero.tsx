import { Play, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { SearchPanel } from '@/components/SearchPanel/SearchPanel'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { HERO, HERO_SLIDES } from '@/content/hero'
import { BOOKING_ANCHOR } from '@/content/site'
import { useLang } from '@/i18n/lang'
import { formatEuro } from '@/utils/price'
import styles from './Hero.module.css'

// Первый экран по референсу: слева надзаголовок, двухстрочный заголовок
// (вторая строка золотая), описание и две кнопки; справа — фото машины,
// плашка с её названием и ценой и счётчик слайдов; снизу — панель поиска.
//
// Фото — целиком, со всем городом вокруг машины: небоскрёбами слева,
// освещённым холлом справа и отражениями на мокром асфальте. Под всем
// экраном лежит размытая копия того же кадра — ночные огни заполняют
// экран от края до края, а резкий кадр стоит справа от текста: машина в
// кадре по центре, и если растянуть кадр на весь экран, заголовок лёг бы
// на её капот (расчёт — в Hero.module.css, .photo).
//
// Фото декоративное — название машины уже есть в плашке, поэтому alt
// пустой. fetchPriority="high" — это самая крупная картинка первого
// экрана, браузер должен грузить её раньше остальных. У слайда без фото —
// заглушка-атмосфера ночного города (.media и .placeholder в CSS).
//
// Слайдер — следующий этап: сейчас показан первый слайд, счётчик статичный.
export function Hero() {
  const lang = useLang()
  const text = HERO[lang]
  const slide = HERO_SLIDES[0]

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true">
        {slide.image ? (
          <img className={styles.ambient} src={slide.image} alt="" />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      <div className={`container ${styles.inner}`}>
        {slide.image && <img className={styles.photo} src={slide.image} alt="" fetchPriority="high" />}

        <div className={styles.content}>
          <p className={styles.eyebrow}>{text.eyebrow}</p>
          <h1 className={styles.title} id="hero-title">
            <span className={styles.titleLine}>{text.titleLines[0]}</span>{' '}
            <span className={`${styles.titleLine} ${styles.titleAccent}`}>{text.titleLines[1]}</span>
          </h1>
          <p className={styles.lead}>
            <span className={styles.leadLine}>{text.lead[0]}</span> {text.lead[1]}
          </p>

          <div className={styles.actions}>
            <Button href={text.primary.href} size="lg" arrow>
              {text.primary.label}
            </Button>
            {/* Ведёт к секции «Как это работает» ниже по странице */}
            <SiteLink className={styles.howItWorks} href={text.secondary.href}>
              <span className={styles.playCircle} aria-hidden="true">
                <Play size={14} strokeWidth={1.5} fill="currentColor" />
              </span>
              {text.secondary.label}
            </SiteLink>
          </div>
        </div>

        {/* Плашка слайда: машина, цена и под ними счётчик слайдов — одним
            стеклянным блоком на фасаде здания, над кормой машины */}
        <div className={styles.stage}>
          <div className={styles.slideCard}>
            <div className={styles.slideInfo}>
              <ShieldCheck className={styles.slideIcon} size={28} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <p className={styles.slideName} translate="no">
                  {slide.name}
                </p>
                <p className={styles.slidePrice}>
                  {text.from} {formatEuro(slide.pricePerDay, lang)} {text.perDay}
                </p>
              </div>
            </div>

            {/* Счётчик слайдов: текущий — белый, линия после него — тоже белая
                (прогресс), остальные приглушены */}
            <ol className={styles.pager} aria-label={text.slides}>
              {HERO_SLIDES.map((item, index) => (
                <li key={item.name} aria-current={index === 0 ? 'true' : undefined}>
                  <span className="visually-hidden">{text.slide} </span>
                  {String(index + 1).padStart(2, '0')}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <SearchPanel className={styles.search} id={BOOKING_ANCHOR} />
      </div>
    </section>
  )
}
