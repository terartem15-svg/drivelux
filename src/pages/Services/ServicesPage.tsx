import { Check } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/components/Button/Button'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { serviceHref, SERVICES, SERVICES_HERO_IMAGE, SERVICES_PAGE } from '@/content/services'
import { ROUTES } from '@/content/site'
import { useLang } from '@/i18n/lang'
import { formatEuro } from '@/utils/price'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import { SERVICE_ICONS } from './serviceIcons'
import styles from './ServicesPage.module.css'

// Страница «Услуги» (/services) по макету: первый экран с ночным фото и
// заголовком, ниже — услуги широкими строками. В строке фото, описание с
// пунктами и колонка цены с кнопкой «Узнать подробнее»; фото чередуется
// слева и справа, чтобы длинный список не превращался в стопку одинаковых
// карточек. Все данные — content/services.ts.
//
// Фото, название и кнопка ведут на страницу услуги. Фото — дубль для мыши
// и пальца: скрыто от клавиатуры и скринридера, как в карточке машины
export function ServicesPage() {
  const lang = useLang()
  const text = SERVICES_PAGE[lang]
  const services = SERVICES[lang]
  useDocumentTitle(text.title)

  return (
    <div>
      {/* --- Первый экран ---------------------------------------------------------------- */}
      <section className={styles.hero} aria-labelledby="services-title">
        <div className={styles.heroMedia} aria-hidden="true">
          <img
            src={SERVICES_HERO_IMAGE.src}
            srcSet={`${SERVICES_HERO_IMAGE.small} 960w, ${SERVICES_HERO_IMAGE.src} 2000w`}
            sizes="70vw"
            alt=""
            fetchPriority="high"
          />
        </div>

        <div className={`container ${styles.heroInner}`}>
          <Breadcrumbs crumbs={[{ label: lang === 'ru' ? 'Главная' : 'Home', href: ROUTES.home }, { label: text.title }]} />
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h1 className={styles.title} id="services-title">
              {text.heading}
              <span className={styles.titleAccent}>{text.headingAccent}</span>
            </h1>
            <p className={styles.lead}>{text.lead}</p>
          </div>
        </div>
      </section>

      {/* --- Услуги ------------------------------------------------------------------------ */}
      <ul className={`container ${styles.list}`}>
        {services.map((service, index) => {
          const Icon = SERVICE_ICONS[service.icon]
          const href = serviceHref(service.slug)
          return (
            <li key={service.slug} data-reveal>
              <article className={styles.row} data-flip={index % 2 === 1 ? '' : undefined}>
                <SiteLink className={styles.media} href={href} tabIndex={-1} aria-hidden="true">
                  <img
                    src={service.image.small}
                    alt=""
                    loading={index < 2 ? undefined : 'lazy'}
                    style={{ objectPosition: service.image.focus }}
                  />
                </SiteLink>

                <div className={styles.body}>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon size={22} strokeWidth={1.4} />
                  </span>
                  <div>
                    <h2 className={styles.rowTitle}>
                      <SiteLink className={styles.rowLink} href={href}>
                        {service.title}
                      </SiteLink>
                    </h2>
                    <p className={styles.tagline}>{service.tagline}</p>
                    <p className={styles.summary}>{service.summary}</p>
                    <ul className={styles.highlights}>
                      {service.highlights.map((item) => (
                        <li key={item}>
                          <Check size={14} strokeWidth={2.2} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.price}>
                  <p className={styles.priceValue}>
                    <span className={styles.priceFrom}>{text.from}</span>
                    <span className={styles.priceAmount}>{formatEuro(service.price.from, lang)}</span>
                    <span className={styles.priceUnit}>{service.price.unit}</span>
                  </p>
                  <Button className={styles.more} href={href} size="sm" arrow>
                    {text.more}
                    <span className="visually-hidden">{text.moreAbout(service.title)}</span>
                  </Button>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      <div className={`container ${styles.notes}`}>
        <p>{text.priceNote}</p>
        <p>
          {text.photos}{' '}
          <a href={SERVICES_HERO_IMAGE.credit.url} target="_blank" rel="noreferrer">
            {SERVICES_HERO_IMAGE.credit.author}
          </a>
          {services.map((service) => (
            <span key={service.slug}>
              ,{' '}
              <a href={service.image.credit.url} target="_blank" rel="noreferrer">
                {service.image.credit.author}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
