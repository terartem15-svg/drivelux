import { ArrowRight, ArrowUp, Clock3, Mail, MapPin, Phone, Star } from 'lucide-react'
import { useState, type CSSProperties, type FormEvent } from 'react'
import { LangSwitch } from '@/components/LangSwitch/LangSwitch'
import { Logo } from '@/components/Logo/Logo'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { SimpleIcon } from '@/components/icons/SimpleIcon'
import { SOCIAL_PATHS } from '@/components/icons/logoPaths'
import { CLASS_ORDER, CLASS_TITLES, classHref } from '@/content/fleet'
import { PLACES } from '@/content/places'
import { SERVICE_ORDER, SERVICE_TITLES, serviceHref } from '@/content/serviceLinks'
import { CONTACTS, FOOTER, PAYMENT_METHODS, ROUTES, SOCIALS } from '@/content/site'
import { VEHICLES } from '@/content/vehicles'
import { useLang } from '@/i18n/lang'
import styles from './Footer.module.css'

// Год в копирайте — текущий; считается один раз при загрузке страницы
const YEAR = new Date().getFullYear()

// Классы, которые есть в парке, — для колонки «Автопарк»
const CLASSES = CLASS_ORDER.filter((key) => VEHICLES.some((item) => item.class === key))

// Места для колонки «Где получить»: офис, аэропорты и два вокзала. Ссылка
// открывает бронирование с уже выбранным местом получения
const FOOTER_PLACES = ['office', 'svo', 'vko', 'dme', 'leningradsky', 'belorussky']
  .map((id) => PLACES.find((place) => place.id === id))
  .filter((place) => place !== undefined)

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Подвал — развёрнутый, по мотивам подвалов прокатов и премиальных
// сервисов (Europcar, Blacklane, Sixt):
//  1. полоса сверху: подписка на закрытые предложения (демо — адрес никуда
//     не уходит) и быстрый контакт: телефон, мессенджеры, адрес, часы;
//  2. логотип, описание и соцсети + пять колонок ссылок: классы автопарка,
//     услуги, клиентам, места получения, компания;
//  3. рейтинги на картах со ссылкой на отзывы и способы оплаты;
//  4. копирайт с пометкой о концепте, правовые ссылки, язык и «наверх».
// Колонки проявляются лесенкой при прокрутке (data-reveal)
export function Footer() {
  const lang = useLang()
  const text = FOOTER[lang]

  const columns = [
    {
      title: text.columns.fleet,
      links: [
        ...CLASSES.map((key) => ({ label: CLASS_TITLES[lang][key], href: classHref(key) })),
        { label: text.allCars, href: ROUTES.fleet },
      ],
    },
    {
      title: text.columns.services,
      links: SERVICE_ORDER.map((slug) => ({ label: SERVICE_TITLES[slug][lang], href: serviceHref(slug) })),
    },
    { title: text.columns.clients, links: text.clientLinks },
    {
      title: text.columns.places,
      links: FOOTER_PLACES.map((place) => ({ label: place.short[lang], href: `${ROUTES.booking}?from=${place.id}` })),
    },
    { title: text.columns.company, links: text.companyLinks },
  ]

  return (
    <footer className={styles.footer} id="contacts">
      {/* --- Подписка и быстрый контакт --------------------------------------------------- */}
      <div className={`container ${styles.band}`} data-reveal>
        <Newsletter />
        <div className={styles.call}>
          <p className={styles.callTitle}>{text.callTitle}</p>
          <a className={styles.callPhone} href={CONTACTS.phone.href}>
            <Phone size={20} strokeWidth={1.6} aria-hidden="true" />
            {CONTACTS.phone.label}
          </a>
          <ul className={styles.callFacts}>
            <li>
              <Clock3 size={15} strokeWidth={1.6} aria-hidden="true" />
              {text.callText}
            </li>
            <li>
              <Mail size={15} strokeWidth={1.6} aria-hidden="true" />
              <a href={CONTACTS.email.href}>{CONTACTS.email.label}</a>
            </li>
            <li>
              <MapPin size={15} strokeWidth={1.6} aria-hidden="true" />
              {CONTACTS.address[lang]}
            </li>
          </ul>
          <div className={styles.messengers}>
            <SiteLink className={styles.messenger} href={CONTACTS.telegram}>
              <SimpleIcon className={styles.messengerLogo} path={SOCIAL_PATHS.telegram} />
              Telegram
            </SiteLink>
            <SiteLink className={styles.messenger} href={CONTACTS.whatsapp}>
              <SimpleIcon className={styles.messengerLogo} path={SOCIAL_PATHS.whatsapp} />
              WhatsApp
            </SiteLink>
          </div>
        </div>
      </div>

      {/* --- Логотип и колонки ссылок -------------------------------------------------------- */}
      <div className={`container ${styles.top}`}>
        <div className={styles.about} data-reveal>
          <SiteLink className={styles.brand} href={ROUTES.home} aria-label={text.home}>
            <Logo />
          </SiteLink>
          <p className={styles.aboutText}>{text.about}</p>
          <ul className={styles.socials}>
            {SOCIALS.map((social) => (
              <li key={social.id}>
                <SiteLink className={styles.social} href={social.href} aria-label={social.label}>
                  <SimpleIcon className={styles.socialLogo} path={SOCIAL_PATHS[social.id]} />
                </SiteLink>
              </li>
            ))}
          </ul>
          <p className={styles.hours}>
            {CONTACTS.hours[lang].map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        {columns.map((column, index) => (
          <nav
            key={column.title}
            className={styles.column}
            aria-label={column.title}
            data-reveal
            style={{ '--reveal-order': index + 1 } as CSSProperties}
          >
            <h2 className={styles.columnTitle}>{column.title}</h2>
            <ul className={styles.links}>
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <SiteLink className={styles.link} href={link.href}>
                    {link.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* --- Рейтинги и оплата -------------------------------------------------------------- */}
      <div className={`container ${styles.trust}`}>
        <div className={styles.ratings}>
          <p className={styles.trustTitle}>{text.ratingsTitle}</p>
          <ul className={styles.ratingList}>
            {text.ratings.map((rating) => (
              <li key={rating.source} className={styles.rating}>
                <Star size={14} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
                <span className={styles.ratingValue}>{rating.value}</span>
                <span className={styles.ratingSource}>{rating.source}</span>
              </li>
            ))}
          </ul>
          <SiteLink className={styles.reviewsLink} href={ROUTES.reviews}>
            {text.reviewsLink}
            <ArrowRight size={14} strokeWidth={1.6} aria-hidden="true" />
          </SiteLink>
        </div>
        <div className={styles.payments}>
          <p className={styles.trustTitle}>{text.paymentTitle}</p>
          <ul className={styles.paymentList}>
            {PAYMENT_METHODS[lang].map((method) => (
              <li key={method} className={styles.payment} translate="no">
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Низ ------------------------------------------------------------------------------ */}
      <div className={`container ${styles.bottom}`}>
        <div className={styles.copy}>
          <p className={styles.copyright}>
            © {YEAR} DriveLux. {text.rights}
          </p>
          <p className={styles.concept}>{text.concept}</p>
        </div>
        <div className={styles.bottomActions}>
          <ul className={styles.legal}>
            {text.legal.map((link) => (
              <li key={link.label}>
                <SiteLink className={styles.legalLink} href={link.href}>
                  {link.label}
                </SiteLink>
              </li>
            ))}
          </ul>
          <LangSwitch placement="top" />
          <SiteLink className={styles.toTop} href="#top" aria-label={text.toTop}>
            <ArrowUp size={18} strokeWidth={1.6} aria-hidden="true" />
          </SiteLink>
        </div>
      </div>
    </footer>
  )
}

// --- Подписка ---------------------------------------------------------------------------
// Демо: адрес проверяется и никуда не отправляется — об этом говорит и
// сообщение после нажатия
function Newsletter() {
  const lang = useLang()
  const text = FOOTER[lang].newsletter
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'invalid' | 'done'>('idle')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setState('invalid')
      return
    }
    setState('done')
    setEmail('')
  }

  return (
    <div className={styles.newsletter}>
      <p className={styles.newsletterTitle}>{text.title}</p>
      <p className={styles.newsletterText}>{text.text}</p>
      <form className={styles.subscribe} onSubmit={handleSubmit} noValidate>
        <label className="visually-hidden" htmlFor="footer-email">
          {text.label}
        </label>
        <input
          className={styles.subscribeInput}
          id="footer-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={text.placeholder}
          aria-invalid={state === 'invalid' || undefined}
          aria-describedby="footer-email-status"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (state !== 'idle') setState('idle')
          }}
        />
        <button className={styles.subscribeButton} type="submit">
          {text.submit}
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </form>
      <p className={styles.subscribeStatus} id="footer-email-status" role="status" data-state={state}>
        {state === 'invalid' ? text.invalid : state === 'done' ? text.done : ''}
      </p>
    </div>
  )
}
