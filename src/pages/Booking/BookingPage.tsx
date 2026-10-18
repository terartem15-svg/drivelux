import {
  BadgeCheck,
  Baby,
  Camera,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Flower2,
  Fuel,
  Gauge,
  Infinity as InfinityIcon,
  Info,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Signpost,
  Sparkles,
  Tag,
  UserRound,
  UsersRound,
  Wifi,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { Accordion } from '@/components/Accordion/Accordion'
import { Button } from '@/components/Button/Button'
import { Calendar } from '@/components/Calendar/Calendar'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import {
  BOOKING_PAGE,
  EXTRAS_OPTIONS,
  LONG_TERM,
  PAYMENTS,
  PROMO,
  PROTECTIONS,
  type ExtraIcon,
  type ExtraId,
  type PaymentId,
  type ProtectionId,
} from '@/content/booking'
import { FAQ } from '@/content/faq'
import { CLASS_LABELS, CLASS_ORDER, CLASS_TITLES, depositFor, INCLUDED, UNITS, vehicleHref } from '@/content/fleet'
import { getPlace, PLACE_GROUPS, PLACES } from '@/content/places'
import { REVIEWS } from '@/content/reviews'
import { CONTACTS, ROUTES } from '@/content/site'
import { getVehicle, VEHICLES, type Vehicle, type VehicleClass } from '@/content/vehicles'
import { useLang } from '@/i18n/lang'
import { ReviewCard } from '@/sections/Reviews/ReviewCard'
import { useUser } from '@/store/auth'
import { firstPickupDate, pickupSlots, returnSlots, TIME_SLOTS, updateTrip, useTrip } from '@/store/trip'
import { addDays, countLabel, daysBetween, formatIsoDate, formatShortDate, todayIso } from '@/utils/format'
import { formatEuro } from '@/utils/price'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import styles from './BookingPage.module.css'

// Бронирование — демо: /booking?car=<id>&from=<место>. Сервера нет, поэтому
// заявка никуда не уходит, и страница прямо об этом говорит — и в начале,
// и после нажатия «Отправить заявку». Сообщения «бронь подтверждена» здесь
// нет и быть не должно.
//
// Шесть шагов на одной странице, сверху вниз:
//  1. машина — карточка выбранной и витрина остальных с фильтром по классу;
//  2. когда и где — места в Москве, календарь срока и время;
//  3. защита — три пакета страховки;
//  4. опции — водитель, кресло, безлимитный пробег, украшение и другие;
//  5. контакты — у вошедшего гостя заполняются из аккаунта;
//  6. оплата, промокод и согласие.
// Справа — смета, которая пересчитывается на каждое изменение: аренда,
// скидка за срок, промокод, защита, опции, подача, итог и залог. Ниже
// формы — что входит в каждую аренду, отзывы об этой машине и вопросы.
//
// Места, даты и время — общие с панелью поиска на главной (store/trip):
// поездка, собранная там, уже стоит здесь, а изменения отсюда видны там.
// Машина живёт в адресе (?car=), место из ссылки подвала — в ?from=
const EXTRA_ICONS: Record<ExtraIcon, LucideIcon> = {
  baby: Baby,
  users: UsersRound,
  chauffeur: UserRound,
  infinity: InfinityIcon,
  wifi: Wifi,
  sign: Signpost,
  fuel: Fuel,
  flower: Flower2,
  camera: Camera,
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const STEPS = 6

type ErrorKey = keyof (typeof BOOKING_PAGE)['ru']['errors']
type Errors = Partial<Record<ErrorKey, true>>

// Скидка за срок: самая большая из подходящих
function longTermDiscount(days: number) {
  return LONG_TERM.find((rule) => days >= rule.days)?.discount ?? 0
}

// Следующая ступень скидки за срок — для подсказки «ещё 2 суток — и 10%»
function nextLongTerm(days: number) {
  return [...LONG_TERM].reverse().find((rule) => days < rule.days)
}

export function BookingPage() {
  const lang = useLang()
  const text = BOOKING_PAGE[lang]
  useDocumentTitle(text.title)
  const [params, setParams] = useSearchParams()
  const vehicle = getVehicle(params.get('car'))
  const trip = useTrip()
  const user = useUser()
  const formId = useId()
  const formRef = useRef<HTMLFormElement>(null)

  // Место из ссылки подвала «Где получить» (?from=svo) — один раз при открытии
  const fromParam = params.get('from')
  useEffect(() => {
    if (fromParam && getPlace(fromParam)) updateTrip({ from: fromParam, to: fromParam })
  }, [fromParam])

  // --- Состояние формы -------------------------------------------------------------------
  const [protection, setProtection] = useState<ProtectionId>('plus')
  const [extras, setExtras] = useState<Partial<Record<ExtraId, number>>>({})
  const [address, setAddress] = useState('')
  const [contacts, setContacts] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
  })
  const [flight, setFlight] = useState('')
  const [comment, setComment] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<'none' | 'ok' | 'bad'>('none')
  const [payment, setPayment] = useState<PaymentId>('card')
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  const fromPlace = getPlace(trip.from)
  const toPlace = getPlace(trip.to)
  const needsAddress = Boolean(fromPlace?.needsAddress || toPlace?.needsAddress)
  const isTransport = fromPlace?.kind === 'airport' || fromPlace?.kind === 'station'

  // --- Смета ---------------------------------------------------------------------------
  const days = daysBetween(trip.start, trip.end)
  const price = useMemo(() => {
    const rent = vehicle ? vehicle.pricePerDay * days : 0
    const longTerm = Math.round(rent * longTermDiscount(days))
    const promoCut = promo === 'ok' ? Math.round((rent - longTerm) * PROMO.discount) : 0
    const plan = PROTECTIONS.find((item) => item.id === protection) ?? PROTECTIONS[0]
    const protectionCost = plan.perDay * days
    const extrasCost = EXTRAS_OPTIONS.reduce((sum, extra) => {
      const count = extras[extra.id] ?? 0
      if (!count) return sum
      return sum + count * ((extra.perDay ?? 0) * days + (extra.once ?? 0))
    }, 0)
    const delivery = (fromPlace?.fee ?? 0) + (trip.to !== trip.from ? (toPlace?.fee ?? 0) : 0)
    const total = rent - longTerm - promoCut + protectionCost + extrasCost + delivery
    const deposit = vehicle ? Math.round(depositFor(vehicle) * plan.depositShare) : 0
    return { rent, longTerm, promoCut, protectionCost, extrasCost, delivery, total, deposit }
  }, [vehicle, days, promo, protection, extras, fromPlace, toPlace, trip.from, trip.to])

  // --- Действия -------------------------------------------------------------------------
  function changeCar(id: string) {
    const next = new URLSearchParams(params)
    if (id) next.set('car', id)
    else next.delete('car')
    next.delete('from')
    setParams(next, { replace: true, preventScrollReset: true })
    setErrors((current) => ({ ...current, car: undefined }))
  }

  function setExtra(id: ExtraId, count: number) {
    setExtras((current) => ({ ...current, [id]: count }))
  }

  function applyPromo() {
    const ok = promoInput.trim().toUpperCase() === PROMO.code
    setPromo(ok ? 'ok' : 'bad')
  }

  function validate(): Errors {
    const result: Errors = {}
    if (!vehicle) result.car = true
    if (needsAddress && address.trim().length < 4) result.address = true
    if (contacts.name.trim().length < 2) result.name = true
    if (contacts.phone.replace(/\D/g, '').length < 10) result.phone = true
    if (contacts.email.trim() && !EMAIL.test(contacts.email.trim())) result.email = true
    if (!terms) result.terms = true
    return result
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const result = validate()
    setErrors(result)
    const first = (['car', 'address', 'name', 'phone', 'email', 'terms'] as ErrorKey[]).find((key) => result[key])
    if (first) {
      const target = formRef.current?.querySelector<HTMLElement>(`[data-error-target="${first}"]`)
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const crumbs = [
    { label: text.home, href: ROUTES.home },
    { label: text.fleet, href: ROUTES.fleet },
    ...(vehicle ? [{ label: vehicle.name, href: vehicleHref(vehicle.id) }] : []),
    { label: text.title },
  ]

  // --- После «Отправить заявку» -----------------------------------------------------------
  if (submitted) {
    const plan = PROTECTIONS.find((item) => item.id === protection)
    const chosenExtras = EXTRAS_OPTIONS.filter((extra) => extras[extra.id])
      .map((extra) => `${extra.title[lang]}${(extras[extra.id] ?? 0) > 1 ? ` × ${extras[extra.id]}` : ''}`)
      .join(', ')
    return (
      <>
        <PageHeader crumbs={crumbs} title={text.notSentTitle} />
        <div className={`container ${styles.body}`}>
          <div className={styles.demo} role="status">
            <Info className={styles.demoIcon} size={22} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <h2 className={styles.demoTitle}>{text.demoTitle}</h2>
              <p className={styles.demoText}>{text.demoText}</p>
            </div>
          </div>

          <dl className={styles.recap}>
            <RecapRow label={text.recap.car} value={vehicle?.name ?? '—'} />
            <RecapRow
              label={text.recap.pickup}
              value={`${formatIsoDate(trip.start, lang)}, ${trip.startTime} · ${fromPlace?.label[lang] ?? ''}${address && fromPlace?.needsAddress ? `, ${address}` : ''}`}
            />
            <RecapRow
              label={text.recap.dropoff}
              value={`${formatIsoDate(trip.end, lang)}, ${trip.endTime} · ${toPlace?.label[lang] ?? ''}${address && toPlace?.needsAddress ? `, ${address}` : ''}`}
            />
            <RecapRow label={text.recap.term} value={countLabel(days, text.days, lang)} />
            <RecapRow label={text.recap.protection} value={plan?.title[lang] ?? ''} />
            <RecapRow label={text.recap.extras} value={chosenExtras || text.recap.none} />
            <RecapRow
              label={text.recap.payment}
              value={PAYMENTS.find((item) => item.id === payment)?.title[lang] ?? ''}
            />
            <RecapRow
              label={text.recap.contact}
              value={[contacts.name, contacts.phone, contacts.email].filter(Boolean).join(', ')}
            />
            <RecapRow label={text.recap.total} value={formatEuro(price.total, lang)} strong />
          </dl>

          <div className={styles.recapActions}>
            <Button variant="ghost" onClick={() => setSubmitted(false)}>
              {text.edit}
            </Button>
            <Button href={ROUTES.fleet} arrow>
              {text.backToFleet}
            </Button>
          </div>
        </div>
      </>
    )
  }

  // --- Форма ---------------------------------------------------------------------------------
  const errorCount = Object.values(errors).filter(Boolean).length
  const next = nextLongTerm(days)
  const carReviews = vehicle
    ? (() => {
        const own = REVIEWS.filter((review) => review.car === vehicle.id)
        const sameClass = REVIEWS.filter(
          (review) => review.car !== vehicle.id && getVehicle(review.car)?.class === vehicle.class,
        )
        return [...own, ...sameClass].slice(0, 3)
      })()
    : REVIEWS.filter((review) => review.rating === 5).slice(0, 3)
  const ownReviews = vehicle ? REVIEWS.some((review) => review.car === vehicle.id) : false
  const faqItems = FAQ.filter((item) => ['deposit', 'cancel', 'documents', 'payment', 'age'].includes(item.id)).map(
    (item) => ({
      id: item.id,
      question: item.question[lang],
      answer: item.answer[lang],
    }),
  )
  const cancelUntil = addDays(trip.start, -2)

  // Подсказка про скидку за срок: какая уже действует и сколько суток до следующей
  function longTermText() {
    const current = Math.round(longTermDiscount(days) * 100)
    const upcoming = next
      ? text.longTermHint(countLabel(next.days - days, text.days, lang), Math.round(next.discount * 100))
      : ''
    if (current && upcoming) return text.longTermBoth(current, upcoming)
    return current ? text.longTermOn(current) : upcoming
  }

  return (
    <>
      <PageHeader crumbs={crumbs} title={text.title} lead={text.lead} />

      {/* --- Гарантии ------------------------------------------------------------------------ */}
      <ul className={`container ${styles.trust}`}>
        {text.trust.map((item, index) => {
          const Icon = [BadgeCheck, ShieldCheck, Clock3, Sparkles][index]
          return (
            <li key={item}>
              <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
              {item}
            </li>
          )
        })}
      </ul>

      <div className={`container ${styles.body} ${styles.layout}`}>
        <form
          ref={formRef}
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby={`${formId}-title`}
        >
          <h2 className="visually-hidden" id={`${formId}-title`}>
            {text.title}
          </h2>

          {/* --- 1. Машина ---------------------------------------------------------------------- */}
          <Step number={1} title={text.steps.car}>
            <CarStep vehicle={vehicle} onChange={changeCar} error={errors.car} />
          </Step>

          {/* --- 2. Когда и где ------------------------------------------------------------------ */}
          <Step number={2} title={text.steps.when}>
            <div className={styles.pair}>
              <PlaceSelect
                label={text.pickupPlace}
                value={trip.from}
                onChange={(id) => updateTrip(trip.to === trip.from ? { from: id, to: id } : { from: id })}
              />
              <PlaceSelect label={text.returnPlace} value={trip.to} onChange={(id) => updateTrip({ to: id })} />
            </div>
            {needsAddress && (
              <Field
                label={text.address}
                error={errors.address ? text.errors.address : undefined}
                id={`${formId}-address`}
              >
                <input
                  className={styles.control}
                  id={`${formId}-address`}
                  data-error-target="address"
                  autoComplete="street-address"
                  placeholder={text.addressPlaceholder}
                  aria-invalid={errors.address ? true : undefined}
                  aria-describedby={errors.address ? `${formId}-address-error` : undefined}
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value)
                    if (errors.address) setErrors((current) => ({ ...current, address: undefined }))
                  }}
                />
              </Field>
            )}
            <DateStep />
            <p className={styles.longTerm} data-active={longTermDiscount(days) > 0 ? '' : undefined}>
              <Tag size={16} strokeWidth={1.6} aria-hidden="true" />
              {longTermText()}
            </p>
          </Step>

          {/* --- 3. Защита ------------------------------------------------------------------------ */}
          <Step number={3} title={text.steps.protection}>
            <div className={styles.protections} role="radiogroup" aria-label={text.steps.protection}>
              {PROTECTIONS.map((plan) => (
                <label
                  key={plan.id}
                  className={styles.protection}
                  data-checked={protection === plan.id ? '' : undefined}
                >
                  <input
                    type="radio"
                    name="protection"
                    value={plan.id}
                    checked={protection === plan.id}
                    onChange={() => setProtection(plan.id)}
                  />
                  {plan.id === 'plus' && <span className={styles.recommended}>{text.recommended}</span>}
                  <span className={styles.protectionHead}>
                    <span className={styles.protectionTitle}>{plan.title[lang]}</span>
                    <span className={styles.protectionPrice}>
                      {plan.perDay ? `+${formatEuro(plan.perDay, lang)} ${text.perDay}` : text.included}
                    </span>
                  </span>
                  <ul className={styles.protectionPoints}>
                    {plan.points[lang].map((point) => (
                      <li key={point}>
                        <Check size={14} strokeWidth={2} aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </label>
              ))}
            </div>
          </Step>

          {/* --- 4. Опции ------------------------------------------------------------------------- */}
          <Step number={4} title={text.steps.extras}>
            <ul className={styles.extras}>
              {EXTRAS_OPTIONS.map((extra) => {
                const Icon = EXTRA_ICONS[extra.icon]
                const count = extras[extra.id] ?? 0
                const cost = extra.perDay
                  ? `+${formatEuro(extra.perDay, lang)} ${text.perDay}`
                  : extra.once
                    ? `+${formatEuro(extra.once, lang)} ${text.once}`
                    : text.free
                return (
                  <li key={extra.id} className={styles.extra} data-checked={count ? '' : undefined}>
                    <label className={styles.extraMain}>
                      <input
                        type="checkbox"
                        checked={count > 0}
                        onChange={(event) => setExtra(extra.id, event.target.checked ? 1 : 0)}
                      />
                      <span className={styles.extraIcon} aria-hidden="true">
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <span className={styles.extraText}>
                        <span className={styles.extraTitle}>{extra.title[lang]}</span>
                        <span className={styles.extraNote}>{extra.text[lang]}</span>
                      </span>
                      <span className={styles.extraPrice} data-free={cost === text.free ? '' : undefined}>
                        {cost}
                      </span>
                    </label>
                    {extra.max && count > 0 && (
                      <div
                        className={styles.stepper}
                        role="group"
                        aria-label={`${extra.title[lang]}: ${text.quantity}`}
                      >
                        <button
                          type="button"
                          aria-label={text.less}
                          disabled={count <= 1}
                          onClick={() => setExtra(extra.id, count - 1)}
                        >
                          <Minus size={14} strokeWidth={2} aria-hidden="true" />
                        </button>
                        <span aria-live="polite">{count}</span>
                        <button
                          type="button"
                          aria-label={text.more}
                          disabled={count >= extra.max}
                          onClick={() => setExtra(extra.id, count + 1)}
                        >
                          <Plus size={14} strokeWidth={2} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Step>

          {/* --- 5. Контакты ------------------------------------------------------------------------ */}
          <Step number={5} title={text.steps.contacts}>
            {user ? (
              <p className={styles.account}>
                <UserRound size={16} strokeWidth={1.6} aria-hidden="true" />
                {text.signedIn(user.name)}
              </p>
            ) : (
              <p className={styles.account}>
                <UserRound size={16} strokeWidth={1.6} aria-hidden="true" />
                <span>
                  {text.signInHint}{' '}
                  <SiteLink
                    className={styles.inlineLink}
                    href={`${ROUTES.login}?next=${encodeURIComponent(`${ROUTES.booking}${vehicle ? `?car=${vehicle.id}` : ''}`)}`}
                  >
                    {text.signIn}
                  </SiteLink>{' '}
                  {text.signInRest}
                </span>
              </p>
            )}
            <Field label={text.name} error={errors.name ? text.errors.name : undefined} id={`${formId}-name`}>
              <input
                className={styles.control}
                id={`${formId}-name`}
                data-error-target="name"
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                value={contacts.name}
                onChange={(event) => {
                  setContacts((current) => ({ ...current, name: event.target.value }))
                  if (errors.name) setErrors((current) => ({ ...current, name: undefined }))
                }}
              />
            </Field>
            <div className={styles.pair}>
              <Field label={text.phone} error={errors.phone ? text.errors.phone : undefined} id={`${formId}-phone`}>
                <input
                  className={styles.control}
                  id={`${formId}-phone`}
                  data-error-target="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 916 123-45-67"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
                  value={contacts.phone}
                  onChange={(event) => {
                    setContacts((current) => ({ ...current, phone: event.target.value }))
                    if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }))
                  }}
                />
              </Field>
              <Field
                label={text.email}
                optional={text.optional}
                error={errors.email ? text.errors.email : undefined}
                id={`${formId}-email`}
              >
                <input
                  className={styles.control}
                  id={`${formId}-email`}
                  data-error-target="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                  value={contacts.email}
                  onChange={(event) => {
                    setContacts((current) => ({ ...current, email: event.target.value }))
                    if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
                  }}
                />
              </Field>
            </div>
            {isTransport && (
              <Field label={text.flight} optional={text.optional} id={`${formId}-flight`}>
                <input
                  className={styles.control}
                  id={`${formId}-flight`}
                  placeholder={text.flightPlaceholder}
                  value={flight}
                  onChange={(event) => setFlight(event.target.value)}
                />
              </Field>
            )}
            <Field label={text.comment} optional={text.optional} id={`${formId}-comment`}>
              <textarea
                className={`${styles.control} ${styles.textarea}`}
                id={`${formId}-comment`}
                rows={3}
                maxLength={500}
                placeholder={text.commentPlaceholder}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </Field>
          </Step>

          {/* --- 6. Оплата ------------------------------------------------------------------------- */}
          <Step number={6} title={text.steps.payment}>
            <fieldset className={styles.payments}>
              <legend className={styles.label}>{text.paymentTitle}</legend>
              <div className={styles.paymentGrid}>
                {PAYMENTS.map((item) => (
                  <label key={item.id} className={styles.payment} data-checked={payment === item.id ? '' : undefined}>
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === item.id}
                      onChange={() => setPayment(item.id)}
                    />
                    <span className={styles.paymentText}>
                      <span className={styles.paymentTitle}>{item.title[lang]}</span>
                      <span className={styles.paymentNote}>{item.text[lang]}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.promo}>
              <label className={styles.label} htmlFor={`${formId}-promo`}>
                {text.promo}
              </label>
              <div className={styles.promoRow}>
                <input
                  className={styles.control}
                  id={`${formId}-promo`}
                  placeholder={text.promoPlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={promo === 'ok'}
                  aria-describedby={`${formId}-promo-status`}
                  value={promoInput}
                  onChange={(event) => {
                    setPromoInput(event.target.value)
                    if (promo === 'bad') setPromo('none')
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      applyPromo()
                    }
                  }}
                />
                {promo === 'ok' ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPromo('none')
                      setPromoInput('')
                    }}
                  >
                    {text.promoRemove}
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={applyPromo} disabled={!promoInput.trim()}>
                    {text.promoApply}
                  </Button>
                )}
              </div>
              <p className={styles.promoStatus} id={`${formId}-promo-status`} data-state={promo} role="status">
                {promo === 'ok'
                  ? text.promoOk(PROMO.code)
                  : promo === 'bad'
                    ? text.promoBad
                    : text.promoHint(PROMO.code)}
              </p>
            </div>

            <label className={styles.terms}>
              <input
                type="checkbox"
                data-error-target="terms"
                checked={terms}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? `${formId}-terms-error` : undefined}
                onChange={(event) => {
                  setTerms(event.target.checked)
                  if (event.target.checked) setErrors((current) => ({ ...current, terms: undefined }))
                }}
              />
              <span>{text.terms}</span>
            </label>
            {errors.terms && (
              <p className={styles.error} id={`${formId}-terms-error`}>
                {text.errors.terms}
              </p>
            )}

            <p className={styles.errorSummary} role="alert">
              {errorCount > 0 ? text.errorSummary : ''}
            </p>

            <div className={styles.submitRow}>
              <Button type="submit" size="lg" arrow>
                {text.submit}
                {vehicle && <span className={styles.submitTotal}> · {formatEuro(price.total, lang)}</span>}
              </Button>
              <p className={styles.submitNote}>{text.submitNote}</p>
            </div>
          </Step>
        </form>

        {/* --- Смета ------------------------------------------------------------------------------ */}
        <aside className={styles.summary} aria-label={text.summary}>
          {vehicle ? (
            <>
              <div className={styles.summaryPhoto}>
                {vehicle.photos[0] ? (
                  <img src={vehicle.photos[0].small} alt="" />
                ) : (
                  <CarFront size={40} strokeWidth={1} aria-hidden="true" />
                )}
              </div>
              <div className={styles.summaryBody}>
                <p className={styles.summaryClass}>{CLASS_LABELS[lang][vehicle.class]}</p>
                <p className={styles.summaryName} translate="no">
                  <SiteLink href={vehicleHref(vehicle.id)}>{vehicle.name}</SiteLink>
                </p>
                <p className={styles.summaryTrip}>
                  <span>
                    {formatShortDate(trip.start, lang)}, {trip.startTime} — {formatShortDate(trip.end, lang)},{' '}
                    {trip.endTime}
                  </span>
                  <span className={styles.summaryPlace}>
                    {fromPlace?.short[lang]}
                    {trip.to !== trip.from && ` → ${toPlace?.short[lang]}`}
                  </span>
                </p>
                <dl className={styles.summaryRows}>
                  <PriceRow
                    label={text.rows.rent(countLabel(days, text.days, lang), formatEuro(vehicle.pricePerDay, lang))}
                    value={formatEuro(price.rent, lang)}
                  />
                  {price.longTerm > 0 && (
                    <PriceRow label={text.rows.longTerm} value={`−${formatEuro(price.longTerm, lang)}`} accent />
                  )}
                  {price.promoCut > 0 && (
                    <PriceRow label={text.rows.promo} value={`−${formatEuro(price.promoCut, lang)}`} accent />
                  )}
                  <PriceRow
                    label={`${text.rows.protection}: ${PROTECTIONS.find((item) => item.id === protection)?.title[lang]}`}
                    value={price.protectionCost ? formatEuro(price.protectionCost, lang) : text.included}
                  />
                  {price.extrasCost > 0 && (
                    <PriceRow label={text.rows.extras} value={formatEuro(price.extrasCost, lang)} />
                  )}
                  <PriceRow
                    label={text.rows.delivery}
                    value={price.delivery ? formatEuro(price.delivery, lang) : text.free}
                  />
                </dl>
                <p className={styles.total}>
                  <span>{text.rows.total}</span>
                  <span className={styles.totalAmount} aria-live="polite">
                    {formatEuro(price.total, lang)}
                  </span>
                </p>
                <p className={styles.deposit}>
                  {text.rows.deposit}: <strong>{formatEuro(price.deposit, lang)}</strong> — {text.rows.depositNote}
                </p>
                {cancelUntil >= todayIso() && (
                  <p className={styles.freeCancel}>
                    <BadgeCheck size={16} strokeWidth={1.6} aria-hidden="true" />
                    {text.freeCancel(formatIsoDate(cancelUntil, lang))}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className={styles.summaryEmpty}>
              <CarFront size={32} strokeWidth={1.2} aria-hidden="true" />
              <p>{text.summaryEmpty}</p>
              <Button href={ROUTES.fleet} variant="ghost" size="sm">
                {text.openFleet}
              </Button>
            </div>
          )}
          <div className={styles.help}>
            <p className={styles.helpTitle}>{text.help}</p>
            <p className={styles.helpText}>{text.helpText}</p>
            <a className={styles.helpPhone} href={CONTACTS.phone.href}>
              <Phone size={16} strokeWidth={1.6} aria-hidden="true" />
              {CONTACTS.phone.label}
            </a>
          </div>
        </aside>
      </div>

      {/* --- Что включено ----------------------------------------------------------------------- */}
      <section className={`container ${styles.section}`} aria-labelledby={`${formId}-included`}>
        <div className={styles.includedPanel} data-reveal>
          <div>
            <h2 className={styles.sectionTitle} id={`${formId}-included`}>
              {text.includedTitle}
            </h2>
            <p className={styles.sectionLead}>{text.includedLead}</p>
          </div>
          <ul className={styles.includedList}>
            {INCLUDED[lang].map((item, index) => {
              const Icon = [ShieldCheck, Clock3, Sparkles, Gauge][index] ?? Check
              return (
                <li key={item} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                  {item}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* --- Отзывы -------------------------------------------------------------------------------- */}
      {carReviews.length > 0 && (
        <section className={`container ${styles.section}`} aria-labelledby={`${formId}-reviews`}>
          <div className={styles.sectionHead} data-reveal>
            <h2 className={styles.sectionTitle} id={`${formId}-reviews`}>
              {vehicle && ownReviews ? text.reviewsTitle(vehicle.name) : text.reviewsClassTitle}
            </h2>
            <SiteLink className={styles.textLink} href={ROUTES.reviews}>
              {text.allReviews}
            </SiteLink>
          </div>
          <ul className={styles.reviews}>
            {carReviews.map((review, index) => (
              <li key={review.id} data-reveal style={{ '--reveal-order': index } as CSSProperties}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- Вопросы ------------------------------------------------------------------------------- */}
      <section className={`container ${styles.section} ${styles.faq}`} aria-labelledby={`${formId}-faq`}>
        <h2 className={styles.sectionTitle} id={`${formId}-faq`} data-reveal>
          {text.faqTitle}
        </h2>
        <div data-reveal>
          <Accordion name="booking-faq" items={faqItems} />
        </div>
      </section>
    </>
  )
}

// --- Шаг формы -------------------------------------------------------------------------------
// Номер шага в золотом кружке и заголовок; содержимое — карточкой под ними
function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  const lang = useLang()
  const id = useId()
  return (
    <section className={styles.step} aria-labelledby={id}>
      <div className={styles.stepHead}>
        <span className={styles.stepNumber} aria-hidden="true">
          {number}
        </span>
        <h3 className={styles.stepTitle} id={id}>
          <span className="visually-hidden">{BOOKING_PAGE[lang].stepOf(number, STEPS)}: </span>
          {title}
        </h3>
      </div>
      <div className={styles.stepBody}>{children}</div>
    </section>
  )
}

// --- Шаг 1: машина ------------------------------------------------------------------------------
// Выбранная машина — крупной карточкой с ценой и ключевыми цифрами;
// «Сменить» раскрывает витрину всего парка с фильтром по классу. Если
// машина не выбрана, витрина открыта сразу
function CarStep({ vehicle, onChange, error }: { vehicle?: Vehicle; onChange: (id: string) => void; error?: boolean }) {
  const lang = useLang()
  const text = BOOKING_PAGE[lang]
  const units = UNITS[lang]
  const [open, setOpen] = useState(!vehicle)
  const [filter, setFilter] = useState<VehicleClass | null>(vehicle?.class ?? null)
  const classes = CLASS_ORDER.filter((key) => VEHICLES.some((item) => item.class === key))
  const list = [...VEHICLES].filter((item) => !filter || item.class === filter).sort((a, b) => a.rank - b.rank)

  return (
    <div className={styles.carStep}>
      {vehicle ? (
        <div className={styles.carCard}>
          <div className={styles.carPhoto}>
            {vehicle.photos[0] ? (
              <img src={vehicle.photos[0].small} alt="" />
            ) : (
              <CarFront size={36} strokeWidth={1} aria-hidden="true" />
            )}
          </div>
          <div className={styles.carInfo}>
            <p className={styles.carClass}>
              {CLASS_LABELS[lang][vehicle.class]} · {vehicle.year}
            </p>
            <p className={styles.carName} translate="no">
              {vehicle.name}
            </p>
            <p className={styles.carSpecs}>
              {vehicle.power} {units.hp} · 0–100{' '}
              {vehicle.acceleration.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB')} {units.seconds} ·{' '}
              {countLabel(vehicle.seats, units.seats, lang)}
            </p>
            <p className={styles.carPrice}>
              {formatEuro(vehicle.pricePerDay, lang)} <span>{units.perDay}</span>
            </p>
          </div>
          <Button
            className={styles.carChange}
            variant="ghost"
            size="sm"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? text.collapse : text.change}
            <ChevronDown
              className={styles.carChevron}
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              data-open={open ? '' : undefined}
            />
          </Button>
        </div>
      ) : (
        <p className={styles.noCar} data-error-target="car" tabIndex={-1} data-error={error ? '' : undefined}>
          <CarFront size={18} strokeWidth={1.5} aria-hidden="true" />
          {error ? text.errors.car : text.noCar}
        </p>
      )}

      {open && (
        <div className={styles.picker}>
          <div className={styles.pickerFilters} role="group" aria-label={text.steps.car}>
            <button
              className={styles.pickerChip}
              type="button"
              aria-pressed={filter === null}
              onClick={() => setFilter(null)}
            >
              {text.allClasses}
            </button>
            {classes.map((key) => (
              <button
                key={key}
                className={styles.pickerChip}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {CLASS_TITLES[lang][key]}
              </button>
            ))}
          </div>
          <ul className={styles.pickerList}>
            {list.map((item) => {
              const selected = item.id === vehicle?.id
              return (
                <li key={item.id}>
                  <button
                    className={styles.pickerCar}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      onChange(item.id)
                      setOpen(false)
                    }}
                  >
                    <span className={styles.pickerPhoto}>
                      {item.photos[0] && <img src={item.photos[0].small} alt="" loading="lazy" decoding="async" />}
                      {selected && (
                        <span className={styles.pickerCheck} aria-hidden="true">
                          <Check size={14} strokeWidth={2.4} />
                        </span>
                      )}
                    </span>
                    <span className={styles.pickerName} translate="no">
                      {item.name}
                    </span>
                    <span className={styles.pickerPrice}>
                      {formatEuro(item.pricePerDay, lang)} {units.perDay}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

// --- Шаг 2: даты ------------------------------------------------------------------------------
// Две вкладки — «Получение» и «Возврат» — и один календарь: он правит ту
// дату, чья вкладка выбрана, и подсвечивает весь срок. После выбора даты
// получения календарь сам переходит к возврату
function DateStep() {
  const lang = useLang()
  const text = BOOKING_PAGE[lang]
  const trip = useTrip()
  const [side, setSide] = useState<'start' | 'end'>('start')
  const startTimeId = useId()
  const endTimeId = useId()

  return (
    <div className={styles.dates}>
      <div className={styles.dateTabs}>
        {(['start', 'end'] as const).map((key) => (
          <button
            key={key}
            className={styles.dateTab}
            type="button"
            aria-pressed={side === key}
            aria-label={key === 'start' ? text.editPickup : text.editDropoff}
            onClick={() => setSide(key)}
          >
            <span className={styles.dateTabLabel}>{key === 'start' ? text.pickup : text.dropoff}</span>
            <span className={styles.dateTabValue}>{formatIsoDate(key === 'start' ? trip.start : trip.end, lang)}</span>
          </button>
        ))}
      </div>

      <div className={styles.dateBody}>
        <Calendar
          label={text.calendar}
          value={side === 'start' ? trip.start : trip.end}
          min={side === 'start' ? firstPickupDate() : trip.start}
          rangeStart={trip.start}
          rangeEnd={trip.end}
          onSelect={(iso) => {
            if (side === 'start') {
              updateTrip({ start: iso })
              setSide('end')
            } else {
              updateTrip({ end: iso })
            }
          }}
        />
        <div className={styles.times}>
          <TimeSelect
            id={startTimeId}
            label={`${text.pickup}: ${text.time.toLowerCase()}`}
            value={trip.startTime}
            allowed={pickupSlots(trip.start)}
            onChange={(value) => updateTrip({ startTime: value })}
          />
          <TimeSelect
            id={endTimeId}
            label={`${text.dropoff}: ${text.time.toLowerCase()}`}
            value={trip.endTime}
            allowed={returnSlots(trip)}
            onChange={(value) => updateTrip({ endTime: value })}
          />
        </div>
      </div>
    </div>
  )
}

// Время, которое уже прошло или раньше получения, видно в списке, но
// недоступно (allowed — что можно выбрать)
function TimeSelect({
  id,
  label,
  value,
  allowed,
  onChange,
}: {
  id: string
  label: string
  value: string
  allowed: string[]
  onChange: (value: string) => void
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <span className={styles.selectBox}>
        <select className={styles.control} id={id} value={value} onChange={(event) => onChange(event.target.value)}>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot} disabled={!allowed.includes(slot)}>
              {slot}
            </option>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
      </span>
    </div>
  )
}

// Список мест группами: офис, аэропорты, вокзалы, город, доставка
function PlaceSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  const lang = useLang()
  const id = useId()
  const place = getPlace(value)
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <span className={styles.selectBox}>
        <select className={styles.control} id={id} value={value} onChange={(event) => onChange(event.target.value)}>
          {PLACE_GROUPS.map((group) => (
            <optgroup key={group.kind} label={group.label[lang]}>
              {PLACES.filter((item) => item.kind === group.kind).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label[lang]}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
      </span>
      {place && <p className={styles.hint}>{place.note[lang]}</p>}
    </div>
  )
}

function Field({
  label,
  optional,
  error,
  id,
  children,
}: {
  label: string
  optional?: string
  error?: string
  id: string
  children: ReactNode
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {optional && <span className={styles.optional}>{optional}</span>}
      </label>
      {children}
      {error && (
        <p className={styles.error} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

function PriceRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={styles.priceRow}>
      <dt>{label}</dt>
      <dd data-accent={accent ? '' : undefined}>{value}</dd>
    </div>
  )
}

function RecapRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={styles.recapRow} data-strong={strong ? '' : undefined}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
