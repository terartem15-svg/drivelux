import { CarFront, CircleCheck, Info, LoaderCircle, PencilLine, RotateCcw } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/Button/Button'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { BRAND_OPTIONS, CLASS_LABELS, UNITS, vehicleHref } from '@/content/fleet'
import type { OrderField, OrderOption, Service } from '@/content/services'
import { ROUTES } from '@/content/site'
import { BRAND_NAMES, getVehicle, VEHICLES } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { formatIsoDate, todayIso } from '@/utils/format'
import { formatEuro } from '@/utils/price'
import styles from './OrderForm.module.css'

// Демо-форма заказа услуги. Сервера нет: данные никуда не уходят и нигде не
// сохраняются, и форма прямо об этом говорит — до отправки и после неё.
// Сообщения «заказ создан» или «подтверждён» здесь нет и быть не должно.
//
// Поля — из объекта услуги (form.fields): у доставки место, адрес и время,
// у долгосрочной аренды срок, у корпоративной компания и число машин.
// Адрес появляется, только если выбранное место его требует (отель, «мой
// адрес»), — или всегда, если места в форме нет.
//
// Проверка — своя, а не браузерная (noValidate): сообщения на языке сайта
// под каждым полем, поле с ошибкой помечено aria-invalid и связано с текстом
// ошибки, фокус переходит на первое неверное поле. Пока человек исправляет
// поле с ошибкой, оно перепроверяется на каждом вводе.
//
// После проверки — короткое «Готовим заявку…» (кнопка недоступна), затем
// итог: «Демонстрационная заявка подготовлена» со сводкой и двумя выходами —
// изменить данные или заполнить форму заново
interface OrderFormProps {
  service: Service
  carId: string
  onCarChange: (id: string) => void
  // Есть ли на странице подборка машин (#cars) — тогда «Заменить» ведёт к ней
  hasCarList: boolean
}

type Values = Record<Exclude<OrderField, 'equipment' | 'car'>, string>
type Errors = Partial<Record<OrderField, string>>
type Status = 'idle' | 'submitting' | 'done'

const EMPTY: Values = {
  company: '',
  fleetSize: '',
  place: '',
  address: '',
  date: '',
  time: '',
  duration: '',
  name: '',
  contact: '',
  comment: '',
}

const TEXT = localized(
  {
    fleetSizes: [
      { value: '1', label: '1 автомобиль' },
      { value: '2-5', label: '2–5 автомобилей' },
      { value: '6+', label: '6 и больше' },
      { value: 'unknown', label: 'Пока не знаю' },
    ] as OrderOption[],
    errors: {
      car: 'Выберите автомобиль — в списке или в подборке выше',
      equipment: 'Отметьте хотя бы один пункт',
      date: 'Укажите дату',
      datePast: 'Дата не может быть в прошлом',
      time: 'Укажите время',
      option: 'Выберите вариант из списка',
      address: 'Укажите адрес',
      addressShort: 'Адрес слишком короткий',
      company: 'Укажите название компании',
      name: 'Укажите имя',
      nameShort: 'Имя слишком короткое',
      contact: 'Укажите телефон или e-mail',
      contactInvalid: 'Похоже, это не телефон и не e-mail. Пример: +7 916 123-45-67 или name@mail.ru',
      comment: (limit: number) => `Не больше ${limit} символов`,
    },
    labels: {
      company: 'Компания',
      fleetSize: 'Сколько машин нужно',
      car: 'Автомобиль',
      place: 'Место получения',
      address: 'Адрес',
      date: 'Дата',
      time: 'Время',
      duration: 'Продолжительность',
      equipment: 'Оборудование',
      name: 'Ваше имя',
      contact: 'Телефон или e-mail',
      comment: 'Комментарий',
    },
    placeholders: {
      company: 'Название компании',
      address: 'Улица, дом',
      name: 'Как к вам обращаться',
      contact: '+7 916 123-45-67',
    },
    doneTitle: 'Демонстрационная заявка подготовлена',
    doneText: (title: string) =>
      `Форма заполнена верно. DriveLux — концепт для портфолио: заявка никуда не отправлена и нигде не сохранена, настоящий заказ не создан. Так выглядела бы заявка на услугу «${title}»:`,
    service: 'Услуга',
    edit: 'Изменить данные',
    restart: 'Заполнить заново',
    chooseCar: 'Выберите автомобиль',
    chooseOption: 'Выберите вариант',
    optional: ' — необязательно',
    eyebrow: 'Заказ',
    title: 'Заказать услугу',
    lead: (title: string) => `${title}: заполните форму — менеджер связался бы с вами, чтобы согласовать детали.`,
    demo: 'Демо-версия: заявка не отправляется, данные остаются только в этой вкладке браузера.',
    chosenCar: 'Выбранный автомобиль',
    carDetails: 'Подробнее о машине',
    replace: 'Заменить',
    noCar: 'Автомобиль не выбран.',
    pickIn: 'Выберите его в',
    selection: 'подборке',
    inList: ', в списке формы или в',
    fleet: 'автопарке',
    pickInForm: 'Выберите его в списке формы.',
    errorSummary: (count: number) => `Проверьте ${count === 1 ? 'поле' : 'поля'} с ошибкой — подсказки под ними.`,
    submitting: 'Готовим заявку…',
    submit: 'Подготовить заявку',
    submitNote: 'Нажимая кнопку, вы ничего не отправляете — это демонстрация.',
  },
  {
    fleetSizes: [
      { value: '1', label: '1 car' },
      { value: '2-5', label: '2–5 cars' },
      { value: '6+', label: '6 or more' },
      { value: 'unknown', label: 'Not sure yet' },
    ],
    errors: {
      car: 'Choose a car — in the list or in the selection above',
      equipment: 'Tick at least one item',
      date: 'Enter a date',
      datePast: 'The date cannot be in the past',
      time: 'Enter a time',
      option: 'Choose an option from the list',
      address: 'Enter an address',
      addressShort: 'The address is too short',
      company: 'Enter the company name',
      name: 'Enter your name',
      nameShort: 'The name is too short',
      contact: 'Enter a phone number or e-mail',
      contactInvalid: 'This does not look like a phone number or e-mail. E.g. +7 916 123-45-67 or name@mail.com',
      comment: (limit: number) => `No more than ${limit} characters`,
    },
    labels: {
      company: 'Company',
      fleetSize: 'How many cars you need',
      car: 'Car',
      place: 'Pick-up place',
      address: 'Address',
      date: 'Date',
      time: 'Time',
      duration: 'Duration',
      equipment: 'Equipment',
      name: 'Your name',
      contact: 'Phone or e-mail',
      comment: 'Comment',
    },
    placeholders: {
      company: 'Company name',
      address: 'Street, building',
      name: 'How should we address you',
      contact: '+7 916 123-45-67',
    },
    doneTitle: 'Demo request prepared',
    doneText: (title: string) =>
      `The form is filled in correctly. DriveLux is a portfolio concept: the request was not sent or stored anywhere and no real order was created. This is what a request for “${title}” would look like:`,
    service: 'Service',
    edit: 'Edit details',
    restart: 'Start over',
    chooseCar: 'Choose a car',
    chooseOption: 'Choose an option',
    optional: ' — optional',
    eyebrow: 'Order',
    title: 'Order the service',
    lead: (title: string) => `${title}: fill in the form — a manager would get in touch to agree the details.`,
    demo: 'Demo version: the request is not sent, the data stays only in this browser tab.',
    chosenCar: 'Selected car',
    carDetails: 'Car details',
    replace: 'Change',
    noCar: 'No car selected.',
    pickIn: 'Choose one in the',
    selection: 'selection',
    inList: ', in the form list or in the',
    fleet: 'fleet',
    pickInForm: 'Choose one in the form list.',
    errorSummary: (count: number) => `Check the ${count === 1 ? 'field' : 'fields'} with errors — hints are below them.`,
    submitting: 'Preparing the request…',
    submit: 'Prepare the request',
    submitNote: 'Pressing the button sends nothing — this is a demonstration.',
  },
)

// Поля во всю ширину формы; остальные на широком экране стоят парами.
// Поле, которому не нашлось пары (следом идёт широкое или форма кончилась),
// тоже растягивается — пустой половины строки в форме не бывает
const WIDE: OrderField[] = ['car', 'address', 'equipment', 'comment', 'place', 'company']

function wideFields(visible: OrderField[]) {
  const wide = new Set<OrderField>()
  let column = 0
  visible.forEach((field, index) => {
    const next = visible[index + 1]
    if (WIDE.includes(field) || (column === 0 && (!next || WIDE.includes(next)))) {
      wide.add(field)
      column = 0
      return
    }
    column = column === 0 ? 1 : 0
  })
  return wide
}

const COMMENT_LIMIT = 500

// Телефон — от 7 цифр, можно +, пробелы, скобки и дефисы; e-mail — имя@домен.зона
const PHONE = /^\+?[\d\s()-]{7,20}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function OrderForm({ service, carId, onCarChange, hasCarList }: OrderFormProps) {
  const { form } = service
  const lang = useLang()
  const text = TEXT[lang]
  const units = UNITS[lang]
  const id = useId()
  const fieldId = (field: OrderField) => `${id}-${field}`
  const has = (field: OrderField) => form.fields.includes(field)

  const [values, setValues] = useState<Values>(EMPTY)
  const [equipment, setEquipment] = useState<string[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [today] = useState(todayIso)
  const timer = useRef<number | undefined>(undefined)
  const resultRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const vehicle = getVehicle(carId)
  const place = form.places?.find((item) => item.value === values.place)
  // Адрес нужен, если места в форме нет вовсе или выбранное место его требует
  const showAddress = has('address') && (!has('place') || Boolean(place?.needsAddress))

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Итог появился — фокус на него: скринридер прочтёт заголовок, а на
  // телефоне экран не останется на месте исчезнувшей кнопки
  useEffect(() => {
    if (status === 'done') resultRef.current?.focus()
  }, [status])

  // --- Проверка ---------------------------------------------------------------------------
  function isRequired(field: OrderField) {
    if (field === 'address') return showAddressFor(values.place) && form.required.includes('address')
    return form.required.includes(field)
  }

  function showAddressFor(placeValue: string) {
    if (!has('address')) return false
    if (!has('place')) return true
    return Boolean(form.places?.find((item) => item.value === placeValue)?.needsAddress)
  }

  function validateField(field: OrderField, state = { values, equipment, carId }): string | undefined {
    const value = field === 'car' ? state.carId : field === 'equipment' ? '' : state.values[field]
    const required = field === 'address' ? showAddressFor(state.values.place) && form.required.includes('address') : isRequired(field)

    switch (field) {
      case 'car':
        return required && !value ? text.errors.car : undefined
      case 'equipment':
        return required && state.equipment.length === 0 ? text.errors.equipment : undefined
      case 'date':
        if (!value) return required ? text.errors.date : undefined
        return value < today ? text.errors.datePast : undefined
      case 'time':
        return required && !value ? text.errors.time : undefined
      case 'place':
      case 'duration':
      case 'fleetSize':
        return required && !value ? text.errors.option : undefined
      case 'address':
        if (!required) return undefined
        if (!value.trim()) return text.errors.address
        return value.trim().length < 4 ? text.errors.addressShort : undefined
      case 'company':
        return required && !value.trim() ? text.errors.company : undefined
      case 'name':
        if (!value.trim()) return required ? text.errors.name : undefined
        return value.trim().length < 2 ? text.errors.nameShort : undefined
      case 'contact': {
        const contact = value.trim()
        if (!contact) return required ? text.errors.contact : undefined
        const ok = contact.includes('@') ? EMAIL.test(contact) : PHONE.test(contact) && contact.replace(/\D/g, '').length >= 7
        return ok ? undefined : text.errors.contactInvalid
      }
      case 'comment':
        return value.length > COMMENT_LIMIT ? text.errors.comment(COMMENT_LIMIT) : undefined
    }
  }

  // Поле с ошибкой перепроверяется на каждом изменении — ошибка уходит,
  // как только значение стало верным
  function recheck(field: OrderField, state: { values: Values; equipment: string[]; carId: string }) {
    setErrors((current) => {
      if (!(field in current)) return current
      const next = { ...current }
      const message = validateField(field, state)
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  function setValue(field: keyof Values, value: string) {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    recheck(field, { values: nextValues, equipment, carId })
    // Сменили место — ошибка адреса могла стать неактуальной
    if (field === 'place') recheck('address', { values: nextValues, equipment, carId })
  }

  function toggleEquipment(value: string) {
    const next = equipment.includes(value) ? equipment.filter((item) => item !== value) : [...equipment, value]
    setEquipment(next)
    recheck('equipment', { values, equipment: next, carId })
  }

  function changeCar(value: string) {
    onCarChange(value)
    recheck('car', { values, equipment, carId: value })
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === 'submitting') return

    const nextErrors: Errors = {}
    for (const field of form.fields) {
      const message = validateField(field)
      if (message) nextErrors[field] = message
    }
    setErrors(nextErrors)

    const first = form.fields.find((field) => nextErrors[field])
    if (first) {
      const target =
        first === 'equipment'
          ? document.querySelector<HTMLInputElement>(`#${CSS.escape(fieldId('equipment'))} input`)
          : document.getElementById(fieldId(first))
      target?.focus()
      return
    }

    // Демо: короткая пауза вместо отправки — так выглядело бы ожидание ответа
    setStatus('submitting')
    timer.current = window.setTimeout(() => setStatus('done'), 900)
  }

  function editAgain() {
    setStatus('idle')
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function startOver() {
    setValues(EMPTY)
    setEquipment([])
    setErrors({})
    onCarChange('')
    setStatus('idle')
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  // --- Подписи и сводка ----------------------------------------------------------------------
  const labels: Record<OrderField, string> = {
    ...text.labels,
    car: form.carLabel ?? text.labels.car,
    place: form.placeLabel ?? text.labels.place,
    address: form.addressLabel ?? text.labels.address,
    date: form.dateLabel ?? text.labels.date,
    time: form.timeLabel ?? text.labels.time,
    duration: form.durationLabel ?? text.labels.duration,
  }

  function display(field: OrderField): string {
    switch (field) {
      case 'car':
        return vehicle?.name ?? ''
      case 'equipment':
        return (form.equipment ?? [])
          .filter((item) => equipment.includes(item.value))
          .map((item) => item.label)
          .join(', ')
      case 'place':
        return place?.label ?? ''
      case 'duration':
        return form.durations?.find((item) => item.value === values.duration)?.label ?? ''
      case 'fleetSize':
        return text.fleetSizes.find((item) => item.value === values.fleetSize)?.label ?? ''
      case 'date':
        return values.date ? formatIsoDate(values.date, lang) : ''
      case 'address':
        return showAddress ? values.address.trim() : ''
      default:
        return values[field].trim()
    }
  }

  // --- Итог -----------------------------------------------------------------------------------
  if (status === 'done') {
    const rows = form.fields.map((field) => [labels[field], display(field)] as const).filter(([, value]) => value)
    return (
      <div className={styles.result} ref={resultRef} tabIndex={-1}>
        <span className={styles.resultIcon} aria-hidden="true">
          <CircleCheck size={28} strokeWidth={1.4} />
        </span>
        <h2 className={styles.title} id="order-title">
          {text.doneTitle}
        </h2>
        <p className={styles.resultText}>{text.doneText(service.title)}</p>

        <dl className={styles.recap}>
          <div className={styles.recapRow}>
            <dt>{text.service}</dt>
            <dd>{service.title}</dd>
          </div>
          {rows.map(([label, value]) => (
            <div key={label} className={styles.recapRow}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.resultActions}>
          <Button variant="ghost" icon={<PencilLine size={16} strokeWidth={1.6} aria-hidden="true" />} onClick={editAgain}>
            {text.edit}
          </Button>
          <Button variant="ghost" icon={<RotateCcw size={16} strokeWidth={1.6} aria-hidden="true" />} onClick={startOver}>
            {text.restart}
          </Button>
        </div>
      </div>
    )
  }

  // --- Форма ------------------------------------------------------------------------------------
  const submitting = status === 'submitting'
  // Машину выбрали в подборке над формой — ошибка «выберите автомобиль»
  // больше не показывается, хотя в состоянии ещё лежит до следующей проверки
  const wide = wideFields(form.fields.filter((field) => field !== 'address' || showAddress))
  const shownErrors: Errors = carId && errors.car ? { ...errors, car: undefined } : errors
  const errorCount = Object.values(shownErrors).filter(Boolean).length

  function renderField(field: OrderField): ReactNode {
    if (field === 'address' && !showAddress) return null
    const required = field === 'address' ? form.required.includes('address') : isRequired(field)
    const error = shownErrors[field]
    const errorId = `${fieldId(field)}-error`
    const common = {
      id: fieldId(field),
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? errorId : undefined,
      'aria-required': required || undefined,
      disabled: submitting,
    }

    let control: ReactNode
    switch (field) {
      case 'car':
        control = (
          <select className={styles.control} {...common} value={carId} onChange={(event) => changeCar(event.target.value)}>
            <option value="">{text.chooseCar}</option>
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
        )
        break
      case 'place':
      case 'duration':
      case 'fleetSize': {
        const options = field === 'place' ? form.places : field === 'duration' ? form.durations : text.fleetSizes
        control = (
          <select className={styles.control} {...common} value={values[field]} onChange={(event) => setValue(field, event.target.value)}>
            <option value="">{text.chooseOption}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
        break
      }
      case 'date':
        control = (
          <input className={styles.control} {...common} type="date" min={today} value={values.date} onChange={(event) => setValue('date', event.target.value)} />
        )
        break
      case 'time':
        control = (
          <input className={styles.control} {...common} type="time" step={900} value={values.time} onChange={(event) => setValue('time', event.target.value)} />
        )
        break
      case 'equipment':
        // Группа флажков — fieldset с подписью-легендой; ошибка относится ко всей группе
        return (
          <fieldset
            key={field}
            className={`${styles.field} ${styles.wide} ${styles.group}`}
            id={fieldId(field)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            disabled={submitting}
          >
            <legend className={styles.label}>
              {labels.equipment}
              {!required && <span className={styles.optional}>{text.optional}</span>}
            </legend>
            <div className={styles.checks}>
              {form.equipment?.map((option) => (
                <label key={option.value} className={styles.check}>
                  <input type="checkbox" checked={equipment.includes(option.value)} onChange={() => toggleEquipment(option.value)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className={styles.error} id={errorId}>
                {error}
              </p>
            )}
          </fieldset>
        )
      case 'comment':
        control = (
          <textarea
            className={`${styles.control} ${styles.textarea}`}
            {...common}
            rows={3}
            maxLength={COMMENT_LIMIT + 50}
            placeholder={form.commentPlaceholder}
            value={values.comment}
            onChange={(event) => setValue('comment', event.target.value)}
          />
        )
        break
      default: {
        const inputs: Record<string, { type: string; placeholder: string; autoComplete: string; inputMode?: 'tel' | 'email' | 'text' }> = {
          company: { type: 'text', placeholder: text.placeholders.company, autoComplete: 'organization' },
          address: {
            type: 'text',
            placeholder: form.addressPlaceholder ?? text.placeholders.address,
            autoComplete: 'street-address',
          },
          name: { type: 'text', placeholder: text.placeholders.name, autoComplete: 'name' },
          contact: { type: 'text', placeholder: text.placeholders.contact, autoComplete: 'tel', inputMode: 'text' },
        }
        const config = inputs[field]
        control = (
          <input
            className={styles.control}
            {...common}
            type={config.type}
            placeholder={config.placeholder}
            autoComplete={config.autoComplete}
            inputMode={config.inputMode}
            value={values[field as keyof Values]}
            onChange={(event) => setValue(field as keyof Values, event.target.value)}
          />
        )
      }
    }

    return (
      <div key={field} className={`${styles.field} ${wide.has(field) ? styles.wide : ''}`}>
        <label className={styles.label} htmlFor={fieldId(field)}>
          {labels[field]}
          {!required && <span className={styles.optional}>{text.optional}</span>}
        </label>
        {control}
        {field === 'comment' && values.comment.length > COMMENT_LIMIT - 100 && (
          <p className={styles.hint}>
            {values.comment.length} / {COMMENT_LIMIT}
          </p>
        )}
        {error && (
          <p className={styles.error} id={errorId}>
            {error}
          </p>
        )}
      </div>
    )
  }


  return (
    <div className={styles.layout}>
      {/* --- Слева: заголовок, пометка о демо и выбранная машина ----------------------------- */}
      <div className={styles.aside}>
        <p className={styles.eyebrow}>{text.eyebrow}</p>
        <h2 className={styles.title} id="order-title" ref={headingRef} tabIndex={-1}>
          {text.title}
        </h2>
        <p className={styles.lead}>{text.lead(service.title)}</p>
        <p className={styles.demo}>
          <Info size={16} strokeWidth={1.6} aria-hidden="true" />
          {text.demo}
        </p>

        {has('car') && (
          <div className={styles.carCard}>
            {vehicle ? (
              <>
                <div className={styles.carPhoto}>
                  {vehicle.photos[0] ? <img src={vehicle.photos[0].small} alt="" /> : <CarFront size={36} strokeWidth={1} aria-hidden="true" />}
                </div>
                <div className={styles.carBody}>
                  <p className={styles.carClass}>
                    {text.chosenCar} · {CLASS_LABELS[lang][vehicle.class]}
                  </p>
                  <p className={styles.carName} translate="no">
                    {vehicle.name}
                  </p>
                  <p className={styles.carPrice}>
                    {units.from} {formatEuro(vehicle.pricePerDay, lang)} {units.perDay}
                  </p>
                  <div className={styles.carActions}>
                    <SiteLink className={styles.carLink} href={vehicleHref(vehicle.id)}>
                      {text.carDetails}
                    </SiteLink>
                    <button
                      className={styles.carLink}
                      type="button"
                      onClick={() => document.getElementById(fieldId('car'))?.focus()}
                      disabled={submitting}
                    >
                      {text.replace}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.carEmpty}>
                <CarFront size={28} strokeWidth={1.2} aria-hidden="true" />
                <p>
                  {text.noCar}{' '}
                  {hasCarList ? (
                    <>
                      {text.pickIn} <SiteLink href="#cars">{text.selection}</SiteLink>
                      {text.inList} <SiteLink href={ROUTES.fleet}>{text.fleet}</SiteLink>.
                    </>
                  ) : (
                    <>{text.pickInForm}</>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Справа: поля ---------------------------------------------------------------------- */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-labelledby="order-title" aria-busy={submitting}>
        <div className={styles.fields}>{form.fields.map(renderField)}</div>

        {/* Сводка ошибок — для тех, кто не видит подсвеченных полей */}
        <p className={styles.errorSummary} role="alert">
          {errorCount > 0 && text.errorSummary(errorCount)}
        </p>

        <div className={styles.submitRow}>
          <Button type="submit" size="lg" disabled={submitting} arrow={!submitting} icon={submitting ? <LoaderCircle className={styles.spinner} size={18} strokeWidth={1.8} aria-hidden="true" /> : undefined}>
            {submitting ? text.submitting : text.submit}
          </Button>
          <p className={styles.submitNote}>{text.submitNote}</p>
        </div>
      </form>
    </div>
  )
}
