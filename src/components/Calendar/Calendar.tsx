import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { LOCALES, localized, useLang } from '@/i18n/lang'
import { addDays, isoDate, parseIsoDate } from '@/utils/format'
import styles from './Calendar.module.css'

// Календарь на месяц — в панели поиска на главной и на странице
// бронирования. Неделя начинается с понедельника, названия месяцев и дней —
// на языке сайта (Intl). Даты раньше min недоступны.
//
// rangeStart и rangeEnd подсвечивают срок аренды: дни между получением и
// возвратом — полосой, сами даты — золотыми кружками. Так видно, сколько
// длится поездка, и при выборе получения, и при выборе возврата.
//
// Клавиатура — как в обычных календарях: стрелки двигают по дням и неделям,
// Home и End — к началу и концу недели, PageUp и PageDown — на месяц,
// Enter и пробел выбирают день. В Tab попадает только один день (выбранный
// или тот, на котором фокус) — весь месяц не нужно проходить по одному дню
const TEXT = localized(
  { prev: 'Предыдущий месяц', next: 'Следующий месяц' },
  { prev: 'Previous month', next: 'Next month' },
)

interface CalendarProps {
  value: string
  min?: string
  rangeStart?: string
  rangeEnd?: string
  onSelect: (iso: string) => void
  label: string
}

// Первый день месяца и сетка из 6 недель по 7 дней — с днями соседних
// месяцев по краям, чтобы высота календаря не прыгала от месяца к месяцу
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const shift = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - shift)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Тот же день через месяц (или раньше): 31 января + месяц — 28/29 февраля, а не
// 3 марта, как получилось бы у new Date с переполнением
function shiftMonthKeepDay(iso: string, months: number) {
  const date = parseIsoDate(iso)
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(date.getDate(), lastDay))
  return isoDate(target)
}

export function Calendar({ value, min, rangeStart, rangeEnd, onSelect, label }: CalendarProps) {
  const lang = useLang()
  const locale = LOCALES[lang]
  const [focused, setFocused] = useState(value)
  const [view, setView] = useState(() => {
    const date = parseIsoDate(value)
    return { year: date.getFullYear(), month: date.getMonth() }
  })
  const gridRef = useRef<HTMLDivElement>(null)
  const moveFocus = useRef(false)

  // Значение поменялось снаружи (выбрали получение позже возврата или
  // переключили вкладку получения и возврата) — календарь сразу, ещё в этой
  // отрисовке, показывает месяц нового значения
  const [shownValue, setShownValue] = useState(value)
  if (shownValue !== value) {
    setShownValue(value)
    setFocused(value)
    const date = parseIsoDate(value)
    setView({ year: date.getFullYear(), month: date.getMonth() })
  }

  // Фокус переезжает на новый день только после навигации с клавиатуры
  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus()
  }, [focused, view])

  const days = monthGrid(view.year, view.month)
  // День, который попадает в Tab: день с фокусом, а если месяц перелистнули
  // кнопками и его на сетке нет — первый доступный день показанного месяца.
  // Иначе ни у одного дня не было бы tabIndex 0, и в сетку не попасть с клавиатуры
  const tabbable = days.some((day) => isoDate(day) === focused)
    ? focused
    : days.map(isoDate).find((iso, index) => days[index].getMonth() === view.month && !(min && iso < min))
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(view.year, view.month, 1))
  const weekdays = days.slice(0, 7).map((day) => new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(day))
  const fullDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })

  // Нельзя уйти раньше месяца минимальной даты
  const minMonth = min ? parseIsoDate(min) : null
  const canGoBack = !minMonth || view.year > minMonth.getFullYear() || view.month > minMonth.getMonth()

  function shiftMonth(step: number) {
    setView((current) => {
      const date = new Date(current.year, current.month + step, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  function focusDate(iso: string) {
    const target = min && iso < min ? min : iso
    const date = parseIsoDate(target)
    moveFocus.current = true
    setFocused(target)
    setView({ year: date.getFullYear(), month: date.getMonth() })
  }

  function handleKeyDown(event: KeyboardEvent) {
    const date = parseIsoDate(focused)
    const weekday = (date.getDay() + 6) % 7
    let next: string | null = null
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(focused, -1)
        break
      case 'ArrowRight':
        next = addDays(focused, 1)
        break
      case 'ArrowUp':
        next = addDays(focused, -7)
        break
      case 'ArrowDown':
        next = addDays(focused, 7)
        break
      case 'Home':
        next = addDays(focused, -weekday)
        break
      case 'End':
        next = addDays(focused, 6 - weekday)
        break
      case 'PageUp':
        next = shiftMonthKeepDay(focused, -1)
        break
      case 'PageDown':
        next = shiftMonthKeepDay(focused, 1)
        break
      default:
        return
    }
    event.preventDefault()
    focusDate(next)
  }

  return (
    <div className={styles.calendar} role="group" aria-label={label}>
      <div className={styles.head}>
        <button
          className={styles.nav}
          type="button"
          aria-label={TEXT[lang].prev}
          disabled={!canGoBack}
          onClick={() => shiftMonth(-1)}
        >
          <ChevronLeft size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <p className={styles.month} aria-live="polite">
          {capitalize(monthName)} {view.year}
        </p>
        <button className={styles.nav} type="button" aria-label={TEXT[lang].next} onClick={() => shiftMonth(1)}>
          <ChevronRight size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {weekdays.map((day) => (
          <span key={day}>{day.replace('.', '')}</span>
        ))}
      </div>

      <div ref={gridRef} className={styles.grid} onKeyDown={handleKeyDown}>
        {days.map((day) => {
          const iso = isoDate(day)
          const outside = day.getMonth() !== view.month
          const disabled = Boolean(min && iso < min)
          const selected = iso === value
          const inRange = Boolean(rangeStart && rangeEnd && iso > rangeStart && iso < rangeEnd)
          const edge = iso === rangeStart ? 'start' : iso === rangeEnd ? 'end' : undefined
          return (
            <button
              key={iso}
              className={styles.day}
              type="button"
              data-date={iso}
              data-outside={outside ? '' : undefined}
              data-range={inRange ? '' : undefined}
              data-edge={edge}
              data-span={rangeStart && rangeEnd && rangeStart !== rangeEnd ? '' : undefined}
              aria-pressed={selected}
              aria-label={capitalize(fullDate.format(day))}
              disabled={disabled}
              tabIndex={iso === tabbable ? 0 : -1}
              // Стрелки считают от дня, на котором фокус, — в том числе после Tab в сетку
              onFocus={() => setFocused(iso)}
              onClick={() => {
                setFocused(iso)
                onSelect(iso)
              }}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
