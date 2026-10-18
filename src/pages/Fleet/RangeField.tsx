import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useLang } from '@/i18n/lang'
import styles from './Filters.module.css'

// Диапазон «от — до»: ползунок с двумя бегунками и два поля для точного
// ввода. Ползунок — два обычных <input type="range"> друг на друге: так
// бесплатно работают клавиатура (стрелки, Home/End), скринридер и палец.
// Золотая полоса между бегунками — CSS по переменным --from и --to (доли).
//
// value null — «любой»: бегунки стоят на границах парка. Бегунки не
// перескакивают друг через друга — «от» упирается в «до».
//
// Поля ввода меняют фильтр не на каждую цифру, а по Enter или уходу из
// поля: пока человек набирает «250», промежуточные «2» и «25» не должны
// перестраивать каталог
interface RangeFieldProps {
  label: string
  unit: string
  bounds: [number, number]
  step: number
  value: [number, number] | null
  onChange: (value: [number, number]) => void
}

export function RangeField({ label, unit, bounds, step, value, onChange }: RangeFieldProps) {
  const [min, max] = bounds
  const [from, to] = value ?? bounds
  const share = (number: number) => (number - min) / (max - min)
  const ru = useLang() === 'ru'
  const fromWord = ru ? 'от' : 'from'
  const toWord = ru ? 'до' : 'to'

  return (
    <div className={styles.range}>
      <div className={styles.slider} style={{ '--from': share(from), '--to': share(to) } as CSSProperties}>
        <input
          className={styles.thumb}
          type="range"
          min={min}
          max={max}
          step={step}
          value={from}
          aria-label={`${label} ${fromWord}`}
          aria-valuetext={`${fromWord} ${from} ${unit}`}
          // Оба бегунка в правом краю: «от» поднимается наверх, иначе его
          // не вытащить из-под «до»
          data-top={from > (min + max) / 2 ? '' : undefined}
          onChange={(event) => onChange([Math.min(Number(event.target.value), to), to])}
        />
        <input
          className={styles.thumb}
          type="range"
          min={min}
          max={max}
          step={step}
          value={to}
          aria-label={`${label} ${toWord}`}
          aria-valuetext={`${toWord} ${to} ${unit}`}
          onChange={(event) => onChange([from, Math.max(Number(event.target.value), from)])}
        />
      </div>

      <div className={styles.rangeInputs}>
        <NumberInput
          label={fromWord}
          ariaLabel={`${label} ${fromWord}, ${unit}`}
          value={from}
          bounds={[min, to]}
          onCommit={(next) => onChange([next, to])}
        />
        <span className={styles.rangeDash} aria-hidden="true">
          —
        </span>
        <NumberInput
          label={toWord}
          ariaLabel={`${label} ${toWord}, ${unit}`}
          value={to}
          bounds={[from, max]}
          onCommit={(next) => onChange([from, next])}
        />
      </div>
    </div>
  )
}

// Поле числа: черновик — строка, пока человек печатает; при Enter или уходе
// из поля число приводится к границам и уходит в фильтр. Пустое или
// неверное значение возвращает поле к текущему
interface NumberInputProps {
  label: string
  ariaLabel: string
  value: number
  bounds: [number, number]
  onCommit: (value: number) => void
}

function NumberInput({ label, ariaLabel, value, bounds, onCommit }: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null)

  function commit() {
    if (draft === null) return
    const number = Number.parseInt(draft, 10)
    setDraft(null)
    if (Number.isNaN(number)) return
    const clamped = Math.min(Math.max(number, bounds[0]), bounds[1])
    if (clamped !== value) onCommit(clamped)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') commit()
    if (event.key === 'Escape') setDraft(null)
  }

  return (
    <label className={styles.numberField}>
      <span className={styles.numberLabel} aria-hidden="true">
        {label}
      </span>
      <input
        className={styles.number}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={ariaLabel}
        value={draft ?? String(value)}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    </label>
  )
}
