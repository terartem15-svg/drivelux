import { ArrowRight, Info } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { useParams } from 'react-router'
import { Accordion } from '@/components/Accordion/Accordion'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/components/Button/Button'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { VehicleCard } from '@/components/VehicleCard/VehicleCard'
import { getService, serviceHref, SERVICES_PAGE, type Service } from '@/content/services'
import { ROUTES } from '@/content/site'
import { getVehicle, type Vehicle } from '@/content/vehicles'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import { localized, useLang } from '@/i18n/lang'
import { formatEuro } from '@/utils/price'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import { OrderForm } from './OrderForm'
import { SERVICE_ICONS } from './serviceIcons'
import styles from './ServicePage.module.css'

// Страница услуги: /services/:slug. Один шаблон на все услуги — блоки
// строятся из объекта услуги в content/services.ts. Неизвестный slug —
// «Услуга не найдена» (общая страница 404 со своим текстом).
//
// Порядок блоков:
//  1. первый экран: текст слева, крупное фото справа (асимметрично);
//  2. описание и преимущества услуги;
//  3. «Как это работает» — шаги с крупной нумерацией и линией между ними;
//  4. условия именно этой услуги (#terms);
//  5. подборка машин с кнопкой «Выбрать» (#cars), если у услуги она есть;
//  6. демо-форма заказа (#order);
//  7. вопросы по услуге;
//  8. другие услуги.
//
// Выбранная машина — общее состояние страницы: её ставит кнопка «Выбрать»
// в подборке и меняет список в форме, а форма показывает её карточкой
const TEXT = localized(
  {
    notFound: 'Услуга не найдена',
    notFoundText: 'Такой услуги у DriveLux нет — возможно, ссылка устарела. Посмотрите список услуг или автопарк.',
    home: 'Главная',
    services: 'Услуги',
    order: 'Заказать услугу',
    demoPrice: 'демо-цена',
    photo: 'Фото',
    benefitsEyebrow: 'Преимущества',
    benefitsTitle: 'Что вы получаете',
    howEyebrow: 'Как это работает',
    steps: (count: number) => `${STEP_WORDS.ru[count] ?? count} ${count < 5 ? 'простых шага' : 'простых шагов'}`,
    termsEyebrow: 'Условия',
    termsDemo: 'Демонстрационные условия: сайт — концепт для портфолио. Точные условия уточняются при заказе.',
    carsEyebrow: 'Автопарк',
    carsTitle: 'Подберите автомобиль для вашей поездки',
    allFleet: 'Весь автопарк',
    inForm: 'в форме заказа.',
    toOrder: 'Перейти к заказу',
    faqEyebrow: 'Вопросы',
    faqTitle: 'Частые вопросы об услуге',
    faqNote: 'Ответы демонстрационные и не являются действующими правилами компании.',
    relatedTitle: 'Другие услуги DriveLux',
    allServices: 'Все услуги',
  },
  {
    notFound: 'Service not found',
    notFoundText: 'DriveLux has no such service — the link may be out of date. Take a look at the list of services or the fleet.',
    home: 'Home',
    services: 'Services',
    order: 'Order the service',
    demoPrice: 'demo price',
    photo: 'Photo',
    benefitsEyebrow: 'Benefits',
    benefitsTitle: 'What you get',
    howEyebrow: 'How it works',
    steps: (count: number) => `${STEP_WORDS.en[count] ?? count} simple steps`,
    termsEyebrow: 'Terms',
    termsDemo: 'Demonstration terms: this is a portfolio concept site. Exact terms are confirmed when you order.',
    carsEyebrow: 'Fleet',
    carsTitle: 'Pick a car for your trip',
    allFleet: 'Whole fleet',
    inForm: 'is in the order form.',
    toOrder: 'Go to the order',
    faqEyebrow: 'Questions',
    faqTitle: 'Service FAQ',
    faqNote: 'The answers are for demonstration and are not the company’s actual rules.',
    relatedTitle: 'Other DriveLux services',
    allServices: 'All services',
  },
)

export function ServicePage() {
  const { slug } = useParams()
  const lang = useLang()
  const text = TEXT[lang]
  const service = getService(slug, lang)
  useDocumentTitle(service ? service.title : text.notFound)

  if (!service) {
    return <NotFoundPage title={text.notFound} text={text.notFoundText} />
  }

  // key — при переходе к другой услуге страница собирается заново: форма,
  // выбранная машина и анимации начинаются с чистого листа
  return <ServiceDetails key={service.slug} service={service} />
}

function ServiceDetails({ service }: { service: Service }) {
  const lang = useLang()
  const text = TEXT[lang]
  const [carId, setCarId] = useState('')
  const cars = service.cars.map((id) => getVehicle(id)).filter((item): item is Vehicle => Boolean(item))
  const related = service.related
    .map((slug) => getService(slug, lang))
    .filter((item): item is Service => Boolean(item))
  const chosen = getVehicle(carId)
  const Icon = SERVICE_ICONS[service.icon]

  return (
    <div className={styles.page}>
      {/* --- Первый экран ---------------------------------------------------------------- */}
      <section className={`container ${styles.hero}`} aria-labelledby="service-title">
        <Breadcrumbs
          crumbs={[
            { label: text.home, href: ROUTES.home },
            { label: text.services, href: ROUTES.services },
            { label: service.title },
          ]}
        />

        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowIcon} aria-hidden="true">
                <Icon size={16} strokeWidth={1.6} />
              </span>
              DriveLux services
            </p>
            <h1 className={styles.title} id="service-title">
              {service.title}
            </h1>
            <p className={styles.tagline}>{service.tagline}</p>
            <p className={styles.lead}>{service.lead}</p>

            <div className={styles.heroActions}>
              <Button href="#order" size="lg" arrow>
                {text.order}
              </Button>
              <Button href={service.secondary.href} variant="ghost" size="lg">
                {service.secondary.label}
              </Button>
            </div>
          </div>

          <figure className={styles.heroMedia}>
            <img
              src={service.image.src}
              srcSet={`${service.image.small} 960w, ${service.image.src} 2000w`}
              sizes="(max-width: 1023px) 100vw, 60vw"
              alt={service.image.alt}
              fetchPriority="high"
              style={{ objectPosition: service.image.focus }}
            />
            {/* Цена — стеклянной плашкой на фото: заметна, но не спорит с заголовком */}
            <figcaption className={styles.priceChip}>
              <span className={styles.priceFrom}>{SERVICES_PAGE[lang].from}</span>
              <span className={styles.priceAmount}>{formatEuro(service.price.from, lang)}</span>
              <span className={styles.priceUnit}>{service.price.unit}</span>
              {service.price.note && (
                <span className={styles.priceNote}>
                  {service.price.note} · {text.demoPrice}
                </span>
              )}
            </figcaption>
          </figure>
        </div>
        <p className={styles.photoCredit}>
          {text.photo}:{' '}
          <a href={service.image.credit.url} target="_blank" rel="noreferrer">
            {service.image.credit.author}
          </a>
          , Pexels
        </p>
      </section>

      {/* --- Описание и преимущества -------------------------------------------------------- */}
      <section className={`container ${styles.about}`} aria-labelledby="benefits-title">
        <div className={styles.aboutIntro} data-reveal>
          <p className={styles.sectionEyebrow}>{text.benefitsEyebrow}</p>
          <h2 className={styles.sectionTitle} id="benefits-title">
            {text.benefitsTitle}
          </h2>
          <p className={styles.aboutText}>{service.description}</p>
        </div>

        <ul className={styles.benefits}>
          {service.benefits.map((benefit, index) => {
            const BenefitIcon = SERVICE_ICONS[benefit.icon]
            return (
              <li
                key={benefit.title}
                className={styles.benefit}
                data-reveal
                style={{ '--reveal-order': index } as CSSProperties}
              >
                <span className={styles.benefitIcon} aria-hidden="true">
                  <BenefitIcon size={22} strokeWidth={1.4} />
                </span>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitText}>{benefit.text}</p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* --- Как это работает ---------------------------------------------------------------- */}
      <section className={`container ${styles.how}`} aria-labelledby="how-title">
        <div className={styles.sectionHead} data-reveal>
          <p className={styles.sectionEyebrow}>{text.howEyebrow}</p>
          <h2 className={styles.sectionTitle} id="how-title">
            {text.steps(service.steps.length)}
          </h2>
        </div>

        <ol className={styles.steps} style={{ '--steps': service.steps.length } as CSSProperties}>
          {service.steps.map((step, index) => (
            <li key={step.title} className={styles.step} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
              <span className={styles.stepNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* --- Условия ----------------------------------------------------------------------------- */}
      <section className={`container ${styles.terms}`} id="terms" aria-labelledby="terms-title">
        <div className={styles.termsPanel} data-reveal>
          <div className={styles.termsIntro}>
            <p className={styles.sectionEyebrow}>{text.termsEyebrow}</p>
            <h2 className={styles.sectionTitle} id="terms-title">
              {service.termsTitle}
            </h2>
            <p className={styles.demoNote}>
              <Info size={16} strokeWidth={1.6} aria-hidden="true" />
              {text.termsDemo}
            </p>
          </div>

          <dl className={styles.termsList}>
            {service.terms.map((term) => (
              <div key={term.label + term.value} className={styles.term}>
                <dt className={styles.termLabel}>{term.label}</dt>
                <dd className={styles.termValue}>{term.value}</dd>
                <dd className={styles.termText}>{term.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* --- Подборка машин ------------------------------------------------------------------ */}
      {cars.length > 0 && (
        <section className={`container ${styles.cars}`} id="cars" aria-labelledby="cars-title">
          <div className={styles.carsHead} data-reveal>
            <div>
              <p className={styles.sectionEyebrow}>{text.carsEyebrow}</p>
              <h2 className={styles.sectionTitle} id="cars-title">
                {text.carsTitle}
              </h2>
              {service.carsLead && <p className={styles.carsLead}>{service.carsLead}</p>}
            </div>
            <SiteLink className={styles.textLink} href={ROUTES.fleet}>
              {text.allFleet}
              <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </SiteLink>
          </div>

          <ul className={styles.carsGrid}>
            {cars.map((vehicle, index) => (
              <li key={vehicle.id}>
                <VehicleCard
                  vehicle={vehicle}
                  order={index}
                  select={{
                    selected: vehicle.id === carId,
                    onSelect: () => setCarId(vehicle.id === carId ? '' : vehicle.id),
                  }}
                />
              </li>
            ))}
          </ul>

          {/* Подтверждение выбора — живой регион: скринридер скажет, что машина
              попала в форму, а ссылка ведёт к форме */}
          <p className={styles.chosen} aria-live="polite">
            {chosen && (
              <>
                <span>
                  <span translate="no">{chosen.name}</span> — {text.inForm}
                </span>
                <SiteLink className={styles.textLink} href="#order">
                  {text.toOrder}
                  <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
                </SiteLink>
              </>
            )}
          </p>
        </section>
      )}

      {/* --- Форма заказа -------------------------------------------------------------------- */}
      <section className={`container ${styles.order}`} id="order" aria-labelledby="order-title">
        <OrderForm service={service} carId={carId} onCarChange={setCarId} hasCarList={cars.length > 0} />
      </section>

      {/* --- Вопросы ------------------------------------------------------------------------- */}
      <section className={`container ${styles.faq}`} aria-labelledby="faq-title">
        <div className={styles.faqIntro} data-reveal>
          <p className={styles.sectionEyebrow}>{text.faqEyebrow}</p>
          <h2 className={styles.sectionTitle} id="faq-title">
            {text.faqTitle}
          </h2>
          <p className={styles.faqNote}>{text.faqNote}</p>
        </div>
        <Accordion
          name={`faq-${service.slug}`}
          items={service.faq.map((item, index) => ({ id: String(index), ...item }))}
        />
      </section>

      {/* --- Другие услуги ------------------------------------------------------------------- */}
      {related.length > 0 && (
        <section className={`container ${styles.related}`} aria-labelledby="related-title">
          <div className={styles.carsHead} data-reveal>
            <h2 className={styles.sectionTitle} id="related-title">
              {text.relatedTitle}
            </h2>
            <SiteLink className={styles.textLink} href={ROUTES.services}>
              {text.allServices}
              <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </SiteLink>
          </div>
          <ul className={styles.relatedGrid}>
            {related.map((item, index) => (
              <li key={item.slug} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
                <RelatedCard service={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

// Карточка другой услуги: фото, название, короткое описание и кнопка.
// Фото — дубль ссылки для мыши и пальца, скрыт от клавиатуры
function RelatedCard({ service }: { service: Service }) {
  const href = serviceHref(service.slug)
  const text = SERVICES_PAGE[useLang()]
  return (
    <article className={styles.relatedCard}>
      <SiteLink className={styles.relatedMedia} href={href} tabIndex={-1} aria-hidden="true">
        <img src={service.image.small} alt="" loading="lazy" style={{ objectPosition: service.image.focus }} />
      </SiteLink>
      <div className={styles.relatedBody}>
        <h3 className={styles.relatedTitle}>
          <SiteLink className={styles.relatedLink} href={href}>
            {service.title}
          </SiteLink>
        </h3>
        <p className={styles.relatedText}>{service.summary}</p>
        <Button className={styles.relatedButton} href={href} variant="ghost" size="sm">
          {text.more}
          <span className="visually-hidden">{text.moreAbout(service.title)}</span>
        </Button>
      </div>
    </article>
  )
}

// «Три простых шага», «Четыре простых шага»; другое число — цифрой
const STEP_WORDS: Record<'ru' | 'en', Record<number, string>> = {
  ru: { 2: 'Два', 3: 'Три', 4: 'Четыре', 5: 'Пять' },
  en: { 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five' },
}
