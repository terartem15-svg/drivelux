import { Check, ChevronDown, Crown, Info, Minus } from 'lucide-react'
import { useId, useState, type CSSProperties } from 'react'
import { Accordion } from '@/components/Accordion/Accordion'
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs'
import { Button } from '@/components/Button/Button'
import { Logo } from '@/components/Logo/Logo'
import { BRAND_OPTIONS, UNITS } from '@/content/fleet'
import { LOYALTY_IMAGE, TIERS, type TierId } from '@/content/loyalty'
import { LOYALTY_PAGE } from '@/content/loyaltyPage'
import { ROUTES } from '@/content/site'
import { BRAND_NAMES, getVehicle, VEHICLES } from '@/content/vehicles'
import { useLang } from '@/i18n/lang'
import { PERK_ICONS } from '@/sections/Loyalty/perkIcons'
import { useUser } from '@/store/auth'
import { countLabel } from '@/utils/format'
import { formatEuro } from '@/utils/price'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import styles from './LoyaltyPage.module.css'

// Программа лояльности DriveLux Club — /loyalty, сюда ведёт «Узнать больше»
// с баннера на главной. Порядок блоков — от «что это» к «как начать»:
//  1. первый экран: заголовок, кнопки и карта участника клуба поверх фото
//     салона (на карте — имя вошедшего гостя);
//  2. четыре цифры программы;
//  3. три шага: регистрация → поездки → привилегии;
//  4. уровни Silver, Gold, Platinum карточками и таблица сравнения;
//  5. калькулятор: машина, срок и уровень → сколько стоит аренда со скидкой;
//  6. привилегии подробно, вопросы и призыв зарегистрироваться.
// «Вступить в клуб» ведёт на регистрацию и возвращает сюда (?next=);
// вошедшему гостю кнопка сообщает, что он уже в клубе.
//
// Программа демонстрационная — страница так и подписана
const DEFAULT_CAR = 'g-class'

export function LoyaltyPage() {
  const lang = useLang()
  const text = LOYALTY_PAGE[lang]
  const user = useUser()
  useDocumentTitle(text.title)

  return (
    <div className={styles.page}>
      {/* --- Первый экран ---------------------------------------------------------------- */}
      <section className={`container ${styles.hero}`} aria-labelledby="loyalty-title">
        <Breadcrumbs
          crumbs={[{ label: lang === 'ru' ? 'Главная' : 'Home', href: ROUTES.home }, { label: text.title }]}
        />

        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>
              <Crown size={16} strokeWidth={1.6} aria-hidden="true" />
              {text.eyebrow}
            </p>
            <h1 className={styles.title} id="loyalty-title">
              <span className={styles.titleLine}>{text.heroTitle[0]}</span>{' '}
              <span className={`${styles.titleLine} ${styles.titleAccent}`}>{text.heroTitle[1]}</span>
            </h1>
            <p className={styles.lead}>{text.heroLead}</p>
            <div className={styles.heroActions}>
              {user ? (
                <Button href={ROUTES.fleet} size="lg" arrow>
                  {text.book}
                </Button>
              ) : (
                <Button href={`${ROUTES.register}?next=${encodeURIComponent(ROUTES.loyalty)}`} size="lg" arrow>
                  {text.join}
                </Button>
              )}
              <Button href="#how" variant="ghost" size="lg">
                {text.how}
              </Button>
            </div>
            {user && (
              <p className={styles.member}>
                <Check size={16} strokeWidth={2} aria-hidden="true" />
                {text.joined}
              </p>
            )}
          </div>

          {/* Карта участника — декоративная: имя на ней уже есть в шапке */}
          <div className={styles.heroVisual} aria-hidden="true">
            {LOYALTY_IMAGE && <img className={styles.heroPhoto} src={LOYALTY_IMAGE} alt="" fetchPriority="high" />}
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <Logo />
                <span className={styles.cardTier}>Gold</span>
              </div>
              <span className={styles.cardChip} />
              <div className={styles.cardBottom}>
                <span>
                  <span className={styles.cardLabel}>{text.cardMember}</span>
                  <span className={styles.cardName}>{user?.name ?? text.cardGuest}</span>
                </span>
                <span className={styles.cardSince}>{text.cardSince}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Цифры ----------------------------------------------------------------------- */}
      <ul className={`container ${styles.stats}`}>
        {text.stats.map((stat, index) => (
          <li key={stat.label} className={styles.stat} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </li>
        ))}
      </ul>

      {/* --- Как это работает ------------------------------------------------------------- */}
      <section className={`container ${styles.section}`} id="how" aria-labelledby="how-title">
        <div className={styles.sectionHead} data-reveal>
          <p className={styles.sectionEyebrow}>{text.stepsEyebrow}</p>
          <h2 className={styles.sectionTitle} id="how-title">
            {text.stepsTitle}
          </h2>
        </div>
        <ol className={styles.steps}>
          {text.steps.map((step, index) => (
            <li
              key={step.title}
              className={styles.step}
              data-reveal
              style={{ '--reveal-order': index } as CSSProperties}
            >
              <span className={styles.stepNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* --- Уровни ---------------------------------------------------------------------- */}
      <section className={`container ${styles.section}`} aria-labelledby="tiers-title">
        <div className={styles.sectionHead} data-reveal>
          <p className={styles.sectionEyebrow}>{text.tiersEyebrow}</p>
          <h2 className={styles.sectionTitle} id="tiers-title">
            {text.tiersTitle}
          </h2>
        </div>
        <ol className={styles.tiers}>
          {TIERS.map((tier, index) => (
            <li
              key={tier.id}
              className={styles.tier}
              data-tier={tier.id}
              data-reveal
              style={{ '--reveal-order': index } as CSSProperties}
            >
              {tier.id === 'gold' && <span className={styles.tierBadge}>{text.tierPopular}</span>}
              <p className={styles.tierName}>{text.tierNames[tier.id]}</p>
              <p className={styles.tierFrom}>{text.tierFrom(tier.trips)}</p>
              <p className={styles.tierDiscount}>
                −{Math.round(tier.discount * 100)}%<span className={styles.tierOff}> {text.tierOff}</span>
              </p>
              <ul className={styles.tierPerks}>
                {text.tierPerks[tier.id].map((perk) => (
                  <li key={perk}>
                    <Check size={15} strokeWidth={2} aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* Таблица сравнения: на телефоне прокручивается по горизонтали */}
        <div className={styles.compare} data-reveal>
          <h3 className={styles.compareTitle}>{text.compareTitle}</h3>
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={text.compareTitle}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{text.compareFeature}</th>
                  {TIERS.map((tier) => (
                    <th key={tier.id} scope="col" data-tier={tier.id}>
                      {text.tierNames[tier.id]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {text.compareRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.cells.map((cell, index) => (
                      <td key={TIERS[index].id}>
                        {cell === true ? (
                          <span className={styles.yes}>
                            <Check size={16} strokeWidth={2.2} aria-hidden="true" />
                            <span className="visually-hidden">{text.yes}</span>
                          </span>
                        ) : cell === false ? (
                          <span className={styles.no}>
                            <Minus size={16} strokeWidth={1.8} aria-hidden="true" />
                            <span className="visually-hidden">{text.no}</span>
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- Калькулятор ----------------------------------------------------------------- */}
      <Calculator />

      {/* --- Привилегии ------------------------------------------------------------------ */}
      <section className={`container ${styles.section}`} aria-labelledby="perks-title">
        <div className={styles.sectionHead} data-reveal>
          <p className={styles.sectionEyebrow}>{text.perksEyebrow}</p>
          <h2 className={styles.sectionTitle} id="perks-title">
            {text.perksTitle}
          </h2>
        </div>
        <ul className={styles.perks}>
          {text.perks.map((perk, index) => (
            <li
              key={perk.title}
              className={styles.perk}
              data-reveal
              style={{ '--reveal-order': index } as CSSProperties}
            >
              <span className={styles.perkIcon} aria-hidden="true">
                {PERK_ICONS[perk.icon]}
              </span>
              <h3 className={styles.perkTitle}>{perk.title}</h3>
              <p className={styles.perkText}>{perk.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* --- Вопросы --------------------------------------------------------------------- */}
      <section className={`container ${styles.section} ${styles.faq}`} aria-labelledby="loyalty-faq-title">
        <div className={styles.sectionHead} data-reveal>
          <p className={styles.sectionEyebrow}>{text.faqEyebrow}</p>
          <h2 className={styles.sectionTitle} id="loyalty-faq-title">
            {text.faqTitle}
          </h2>
          <p className={styles.demo}>
            <Info size={16} strokeWidth={1.6} aria-hidden="true" />
            {text.demo}
          </p>
        </div>
        <div data-reveal>
          <Accordion name="loyalty-faq" items={text.faq} openFirst />
        </div>
      </section>

      {/* --- Призыв ---------------------------------------------------------------------- */}
      <section className={`container ${styles.section}`} aria-labelledby="loyalty-cta-title">
        <div className={styles.cta} data-reveal>
          <div>
            <h2 className={styles.ctaTitle} id="loyalty-cta-title">
              {text.ctaTitle}
            </h2>
            <p className={styles.ctaText}>{text.ctaText}</p>
          </div>
          <div className={styles.ctaActions}>
            {!user && (
              <Button href={`${ROUTES.register}?next=${encodeURIComponent(ROUTES.loyalty)}`} arrow>
                {text.join}
              </Button>
            )}
            <Button href={ROUTES.fleet} variant={user ? 'gold' : 'ghost'} arrow={Boolean(user)}>
              {text.ctaFleet}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// --- Калькулятор экономии ---------------------------------------------------------------
// Машина из автопарка, срок от 1 до 30 суток ползунком и уровень клуба —
// итог пересчитывается сразу. Скидка уровня — от цены за сутки × срок
function Calculator() {
  const lang = useLang()
  const text = LOYALTY_PAGE[lang]
  const units = UNITS[lang]
  const id = useId()
  const [carId, setCarId] = useState(DEFAULT_CAR)
  const [days, setDays] = useState(3)
  const [tierId, setTierId] = useState<TierId>('gold')

  const car = getVehicle(carId) ?? VEHICLES[0]
  const tier = TIERS.find((item) => item.id === tierId) ?? TIERS[0]
  const base = car.pricePerDay * days
  const discount = Math.round(base * tier.discount)
  const total = base - discount

  return (
    <section className={`container ${styles.section}`} aria-labelledby="calc-title">
      <div className={styles.calc} data-reveal>
        <div className={styles.calcIntro}>
          <p className={styles.sectionEyebrow}>{text.calcEyebrow}</p>
          <h2 className={styles.sectionTitle} id="calc-title">
            {text.calcTitle}
          </h2>
          <p className={styles.calcLead}>{text.calcLead}</p>
        </div>

        <div className={styles.calcForm}>
          <label className={styles.calcField} htmlFor={`${id}-car`}>
            <span className={styles.calcLabel}>{text.calcCar}</span>
            <span className={styles.selectBox}>
              <select id={`${id}-car`} value={carId} onChange={(event) => setCarId(event.target.value)}>
                {BRAND_OPTIONS.map(({ key }) => {
                  const models = VEHICLES.filter((item) => item.brand === key)
                  if (!models.length) return null
                  return (
                    <optgroup key={key} label={BRAND_NAMES[key]}>
                      {models.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} — {formatEuro(item.pricePerDay, lang)} {units.perDay}
                        </option>
                      ))}
                    </optgroup>
                  )
                })}
              </select>
              <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </label>

          <div className={styles.calcField}>
            <label className={styles.calcLabel} htmlFor={`${id}-days`}>
              {text.calcDays}: <span className={styles.calcDays}>{countLabel(days, text.days, lang)}</span>
            </label>
            <input
              className={styles.range}
              id={`${id}-days`}
              type="range"
              min={1}
              max={30}
              value={days}
              style={{ '--fill': (days - 1) / 29 } as CSSProperties}
              onChange={(event) => setDays(Number(event.target.value))}
            />
          </div>

          <div className={styles.calcField} role="group" aria-labelledby={`${id}-tier`}>
            <span className={styles.calcLabel} id={`${id}-tier`}>
              {text.calcTier}
            </span>
            <div className={styles.segments}>
              {TIERS.map((item) => (
                <button
                  key={item.id}
                  className={styles.segment}
                  type="button"
                  aria-pressed={item.id === tierId}
                  onClick={() => setTierId(item.id)}
                >
                  {text.tierNames[item.id]} · −{Math.round(item.discount * 100)}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.calcResult} aria-live="polite">
          {car.photos[0] && <img className={styles.calcPhoto} src={car.photos[0].small} alt="" loading="lazy" />}
          <dl className={styles.calcRows}>
            <div>
              <dt>{text.calcBase}</dt>
              <dd>{formatEuro(base, lang)}</dd>
            </div>
            <div>
              <dt>{text.calcDiscount}</dt>
              <dd className={styles.calcMinus}>−{formatEuro(discount, lang)}</dd>
            </div>
            <div className={styles.calcTotal}>
              <dt>{text.calcTotal}</dt>
              <dd>{formatEuro(total, lang)}</dd>
            </div>
          </dl>
          <p className={styles.calcSaving}>{text.calcSaving(formatEuro(discount, lang))}</p>
        </div>
      </div>
    </section>
  )
}
