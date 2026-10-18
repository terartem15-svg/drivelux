import {
  Building2,
  CarFront,
  Check,
  ChevronDown,
  History,
  Home,
  MapPin,
  Plane,
  TrainFront,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/Button/Button'
import { Calendar } from '@/components/Calendar/Calendar'
import { CLASS_NOTES, CLASS_ORDER, CLASS_TITLES, classHref } from '@/content/fleet'
import { SEARCH } from '@/content/hero'
import { getPlace, PLACE_GROUPS, PLACES, type PlaceKind } from '@/content/places'
import { ROUTES } from '@/content/site'
import { VEHICLES } from '@/content/vehicles'
import { useLang } from '@/i18n/lang'
import { firstPickupDate, pickupSlots, returnSlots, TIME_SLOTS, updateTrip, useTrip, type Trip } from '@/store/trip'
import { countLabel, daysBetween, formatIsoDate } from '@/utils/format'
import { FieldPopover } from './FieldPopover'
import styles from './SearchPanel.module.css'

// Панель поиска под первым экраном — мини-фильтр по референсу: где и когда
// забрать машину, где и когда вернуть, класс авто и золотая «Найти авто».
// Стеклянная полоса лежит на нижнем крае фото.
//
// Каждое поле открывает свой выпадающий блок (FieldPopover):
//  - «Получение» и «Возврат» — места в Москве (аэропорты, вокзалы, офис в
//    Москва-Сити, отель, свой адрес), календарь и время. В календаре
//    подсвечен весь срок аренды. У возврата есть «Вернуть там же»;
//  - «Класс авто» — все классы автопарка с числом машин.
// Выбор сразу сохраняется в поездку гостя (store/trip): её подхватывают
// иллюстрация «Как это работает» и страница бронирования.
//
// «Найти авто» открывает каталог с отбором по выбранному классу
// (/fleet?class=sport) или весь автопарк, если класс любой.
//
// id — якорь панели (#booking): к ней можно перейти ссылкой с любой страницы
type Open = 'pickup' | 'dropoff' | 'class' | null

const KIND_ICONS: Record<PlaceKind, LucideIcon> = {
  office: Building2,
  airport: Plane,
  station: TrainFront,
  city: MapPin,
  address: Home,
}

// Классы, которые есть в автопарке, — с числом машин
const CLASSES = CLASS_ORDER.map((key) => ({ key, count: VEHICLES.filter((item) => item.class === key).length })).filter(
  (item) => item.count > 0,
)

export function SearchPanel({ className, id }: { className?: string; id?: string }) {
  const lang = useLang()
  const text = SEARCH[lang]
  const trip = useTrip()
  const navigate = useNavigate()
  const [open, setOpen] = useState<Open>(null)
  const close = useCallback(() => setOpen(null), [])
  const baseId = useId()

  const pickupRef = useRef<HTMLButtonElement>(null)
  const dropoffRef = useRef<HTMLButtonElement>(null)
  const classRef = useRef<HTMLButtonElement>(null)

  const toggle = (field: Exclude<Open, null>) => setOpen((current) => (current === field ? null : field))

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setOpen(null)
    navigate(trip.carClass ? classHref(trip.carClass) : ROUTES.fleet)
  }

  const classTitle = trip.carClass ? CLASS_TITLES[lang][trip.carClass] : text.anyClass

  return (
    <form
      id={id}
      className={[styles.panel, className].filter(Boolean).join(' ')}
      aria-label={text.label}
      onSubmit={handleSubmit}
    >
      {/* --- Получение --------------------------------------------------------------------- */}
      <div className={styles.slot}>
        <TripButton
          buttonRef={pickupRef}
          icon={<MapPin size={20} strokeWidth={1.6} />}
          label={text.pickup}
          place={trip.from}
          date={trip.start}
          time={trip.startTime}
          expanded={open === 'pickup'}
          controls={`${baseId}-pickup`}
          onClick={() => toggle('pickup')}
        />
        <FieldPopover
          id={`${baseId}-pickup`}
          open={open === 'pickup'}
          onClose={close}
          trigger={pickupRef}
          label={text.pickup}
          closeLabel={text.close}
          wide
        >
          <TripEditor trip={trip} side="pickup" onDone={close} />
        </FieldPopover>
      </div>

      {/* --- Возврат ----------------------------------------------------------------------- */}
      <div className={styles.slot}>
        <TripButton
          buttonRef={dropoffRef}
          icon={<History size={20} strokeWidth={1.6} />}
          label={text.dropoff}
          place={trip.to}
          date={trip.end}
          time={trip.endTime}
          expanded={open === 'dropoff'}
          controls={`${baseId}-dropoff`}
          onClick={() => toggle('dropoff')}
        />
        <FieldPopover
          id={`${baseId}-dropoff`}
          open={open === 'dropoff'}
          onClose={close}
          trigger={dropoffRef}
          label={text.dropoff}
          closeLabel={text.close}
          align="end"
          wide
        >
          <TripEditor trip={trip} side="dropoff" onDone={close} />
        </FieldPopover>
      </div>

      {/* --- Класс авто -------------------------------------------------------------------- */}
      <div className={styles.slot}>
        <button
          ref={classRef}
          className={styles.field}
          type="button"
          aria-label={`${text.carClass}: ${classTitle}`}
          aria-haspopup="dialog"
          aria-expanded={open === 'class'}
          aria-controls={`${baseId}-class`}
          onClick={() => toggle('class')}
        >
          <FieldIcon>
            <CarFront size={20} strokeWidth={1.6} />
          </FieldIcon>
          <span className={styles.body}>
            <span className={styles.label}>{text.carClass}</span>
            <span className={styles.value}>{classTitle}</span>
          </span>
          <ChevronDown className={styles.chevron} size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <FieldPopover
          id={`${baseId}-class`}
          open={open === 'class'}
          onClose={close}
          trigger={classRef}
          label={text.carClass}
          closeLabel={text.close}
        >
          <ul className={styles.options}>
            {[{ key: '' as const, count: VEHICLES.length }, ...CLASSES].map((item) => {
              const selected = trip.carClass === item.key
              return (
                <li key={item.key || 'any'}>
                  <button
                    className={styles.option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      updateTrip({ carClass: item.key })
                      close()
                      classRef.current?.focus()
                    }}
                  >
                    <span className={styles.optionText}>
                      <span className={styles.optionTitle}>
                        {item.key ? CLASS_TITLES[lang][item.key] : text.anyClass}
                      </span>
                      <span className={styles.optionNote}>
                        {item.key ? CLASS_NOTES[lang][item.key] : text.anyClassNote}
                      </span>
                    </span>
                    <span className={styles.optionCount}>{countLabel(item.count, text.cars, lang)}</span>
                    {selected && <Check className={styles.optionCheck} size={16} strokeWidth={2} aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </FieldPopover>
      </div>

      <div className={styles.submit}>
        <Button className={styles.submitButton} type="submit" size="lg" arrow>
          {text.submit}
        </Button>
      </div>
    </form>
  )
}

// --- Поле «место + дата + время» -------------------------------------------------------
// Получение и возврат устроены одинаково. aria-label собран явно: имя из
// содержимого склеило бы подпись, место и дату без пауз
interface TripButtonProps {
  buttonRef: RefObject<HTMLButtonElement | null>
  icon: ReactNode
  label: string
  place: string
  date: string
  time: string
  expanded: boolean
  controls: string
  onClick: () => void
}

function TripButton({ buttonRef, icon, label, place, date, time, expanded, controls, onClick }: TripButtonProps) {
  const lang = useLang()
  const placeLabel = getPlace(place)?.short[lang] ?? ''
  const dateLabel = formatIsoDate(date, lang)

  return (
    <button
      ref={buttonRef}
      className={styles.field}
      type="button"
      aria-label={`${label}: ${placeLabel}, ${dateLabel}, ${time}`}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
    >
      <FieldIcon>{icon}</FieldIcon>
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{placeLabel}</span>
        <span className={styles.meta}>
          <span>{dateLabel}</span>
          <span className={styles.metaDivider} aria-hidden="true" />
          <span>{time}</span>
        </span>
      </span>
      <ChevronDown className={styles.chevron} size={18} strokeWidth={1.6} aria-hidden="true" />
    </button>
  )
}

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className={styles.icon} aria-hidden="true">
      {children}
    </span>
  )
}

// --- Выбор места, даты и времени ----------------------------------------------------------
// Слева — места группами (офис, аэропорты, вокзалы, город, доставка), справа —
// календарь со сроком аренды и время. У возврата сверху — «Вернуть там же»:
// пока отмечено, место возврата повторяет место получения, а список мест
// свёрнут; сняли отметку — список появляется
function TripEditor({ trip, side, onDone }: { trip: Trip; side: 'pickup' | 'dropoff'; onDone: () => void }) {
  const lang = useLang()
  const text = SEARCH[lang]
  const pickup = side === 'pickup'
  const place = pickup ? trip.from : trip.to
  const [differentReturn, setDifferentReturn] = useState(trip.to !== trip.from)
  const showPlaces = pickup || differentReturn
  const days = daysBetween(trip.start, trip.end)
  const timeId = useId()
  const allowedTimes = pickup ? pickupSlots(trip.start) : returnSlots(trip)

  function choosePlace(id: string) {
    // Получение меняется вместе с возвратом, пока они совпадали
    if (pickup) updateTrip(trip.to === trip.from ? { from: id, to: id } : { from: id })
    else updateTrip({ to: id })
  }

  return (
    <div className={styles.editor}>
      <div className={styles.places}>
        {!pickup && (
          <label className={styles.same}>
            <input
              type="checkbox"
              checked={!differentReturn}
              onChange={(event) => {
                setDifferentReturn(!event.target.checked)
                if (event.target.checked) updateTrip({ to: trip.from })
              }}
            />
            <span>{text.sameAsPickup}</span>
          </label>
        )}
        {showPlaces && (
          <>
            <p className={styles.editorTitle}>{text.place}</p>
            <div className={styles.placeGroups}>
              {PLACE_GROUPS.map((group) => {
                const items = PLACES.filter((item) => item.kind === group.kind)
                return (
                  <div key={group.kind} role="group" aria-label={group.label[lang]}>
                    <p className={styles.groupLabel} aria-hidden="true">
                      {group.label[lang]}
                    </p>
                    <ul className={styles.placeList}>
                      {items.map((item) => {
                        const Icon = KIND_ICONS[item.kind]
                        const selected = item.id === place
                        return (
                          <li key={item.id}>
                            <button
                              className={styles.place}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => choosePlace(item.id)}
                            >
                              <Icon className={styles.placeIcon} size={16} strokeWidth={1.6} aria-hidden="true" />
                              <span className={styles.placeText}>
                                <span className={styles.placeName}>{item.label[lang]}</span>
                                <span className={styles.placeNote}>
                                  {item.note[lang]}
                                  {item.fee === 0 && item.kind !== 'office' ? ` · ${text.free}` : ''}
                                </span>
                              </span>
                              {selected && (
                                <Check className={styles.optionCheck} size={16} strokeWidth={2} aria-hidden="true" />
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </>
        )}
        {!showPlaces && <p className={styles.sameNote}>{getPlace(trip.from)?.label[lang]}</p>}
      </div>

      <div className={styles.when}>
        <p className={styles.editorTitle}>{text.date}</p>
        <Calendar
          label={`${pickup ? text.pickup : text.dropoff}: ${text.date}`}
          value={pickup ? trip.start : trip.end}
          min={pickup ? firstPickupDate() : trip.start}
          rangeStart={trip.start}
          rangeEnd={trip.end}
          onSelect={(iso) => updateTrip(pickup ? { start: iso } : { end: iso })}
        />

        <div className={styles.timeRow}>
          <label className={styles.editorTitle} htmlFor={timeId}>
            {text.time}
          </label>
          <span className={styles.timeSelect}>
            <select
              id={timeId}
              value={pickup ? trip.startTime : trip.endTime}
              onChange={(event) =>
                updateTrip(pickup ? { startTime: event.target.value } : { endTime: event.target.value })
              }
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot} disabled={!allowedTimes.includes(slot)}>
                  {slot}
                </option>
              ))}
            </select>
            <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
          </span>
        </div>

        <div className={styles.editorFoot}>
          <p className={styles.duration}>
            {formatIsoDate(trip.start, lang)} — {formatIsoDate(trip.end, lang)}
            <span className={styles.durationDays}>{countLabel(days, text.days, lang)}</span>
          </p>
          <Button size="sm" onClick={onDone}>
            {text.done}
          </Button>
        </div>
      </div>
    </div>
  )
}
