import { useMemo, useState, type ReactNode } from 'react'
import { POWER_STEP, PRICE_STEP } from '@/content/fleet'
import { VEHICLES } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { facetCounts, matches, optionLabel, presentKeys, RANGE_BOUNDS, type Filters, type ListGroup } from './catalog'
import { RangeField } from './RangeField'
import type { CatalogAction } from './useCatalog'
import styles from './Filters.module.css'

// Панель фильтров: на десктопе — колонка слева от каталога, на планшете и
// телефоне — внутри выдвижной панели (FilterDrawer). Разметка одна и та же.
//
// Марка и класс — списком с флажками и числом машин: вариантов много, и
// число подсказывает, сколько останется после выбора. Кузов, коробка,
// топливо и места — «таблетками»: вариантов мало, они помещаются в строку.
// Цена и мощность — ползунок с двумя полями.
//
// Числа у вариантов считаются с учётом остальных фильтров. Вариант, при
// котором машин не останется, приглушён, но не отключён: человек может
// сначала отметить его, а потом ослабить другие условия
interface FilterPanelProps {
  filters: Filters
  dispatch: (action: CatalogAction) => void
}

const TEXT = localized(
  {
    brand: 'Марка',
    allBrands: (count: number) => `Все марки — ${count}`,
    fewerBrands: 'Свернуть',
    class: 'Класс',
    price: 'Цена за день, €',
    priceLabel: 'Цена',
    body: 'Тип кузова',
    gearbox: 'Коробка передач',
    fuel: 'Тип двигателя',
    seats: 'Количество мест',
    power: 'Мощность, л.с.',
    powerLabel: 'Мощность',
    hp: 'л.с.',
    extra: 'Дополнительно',
    awd: 'Только полный привод',
  },
  {
    brand: 'Make',
    allBrands: (count: number) => `All makes — ${count}`,
    fewerBrands: 'Show fewer',
    class: 'Class',
    price: 'Price per day, €',
    priceLabel: 'Price',
    body: 'Body type',
    gearbox: 'Gearbox',
    fuel: 'Engine type',
    seats: 'Seats',
    power: 'Power, hp',
    powerLabel: 'Power',
    hp: 'hp',
    extra: 'Extras',
    awd: 'All-wheel drive only',
  },
)

// Варианты, которые вообще есть в парке, — считаются один раз
const PRESENT: Record<ListGroup, string[]> = {
  brand: presentKeys(VEHICLES, 'brand'),
  class: presentKeys(VEHICLES, 'class'),
  body: presentKeys(VEHICLES, 'body'),
  gearbox: presentKeys(VEHICLES, 'gearbox'),
  fuel: presentKeys(VEHICLES, 'fuel'),
  seats: presentKeys(VEHICLES, 'seats'),
}

export function FilterPanel({ filters, dispatch }: FilterPanelProps) {
  const text = TEXT[useLang()]
  // Сколько полноприводных машин подходит под остальные фильтры
  const awdCount = useMemo(
    () => VEHICLES.filter((item) => item.drive === 'awd' && matches(item, filters, 'awd')).length,
    [filters],
  )

  function options(group: ListGroup, variant: 'list' | 'pills', title: string, limit?: number) {
    return (
      <OptionGroup
        title={title}
        group={group}
        variant={variant}
        limit={limit}
        filters={filters}
        onToggle={(key) => dispatch({ type: 'toggle', group, key })}
      />
    )
  }

  return (
    <div className={styles.panel}>
      {options('brand', 'list', text.brand, BRANDS_SHOWN)}
      {options('class', 'list', text.class)}

      <Group title={text.price}>
        <RangeField
          label={text.priceLabel}
          unit="€"
          bounds={RANGE_BOUNDS.price}
          step={PRICE_STEP}
          value={filters.price}
          onChange={(value) => dispatch({ type: 'range', group: 'price', value })}
        />
      </Group>

      {options('body', 'pills', text.body)}
      {options('gearbox', 'pills', text.gearbox)}
      {options('fuel', 'pills', text.fuel)}
      {options('seats', 'pills', text.seats)}

      <Group title={text.power}>
        <RangeField
          label={text.powerLabel}
          unit={text.hp}
          bounds={RANGE_BOUNDS.power}
          step={POWER_STEP}
          value={filters.power}
          onChange={(value) => dispatch({ type: 'range', group: 'power', value })}
        />
      </Group>

      {/* Кабриолет — уже вариант «Типа кузова», второй переключатель для
          него только дублировал бы фильтр. Здесь — то, чего нет в группах */}
      <Group title={text.extra}>
        <label className={styles.switchRow} data-empty={awdCount === 0 && !filters.awd ? '' : undefined}>
          <span className={styles.optionLabel}>{text.awd}</span>
          <span className={styles.count}>{awdCount}</span>
          <input
            className={styles.switch}
            type="checkbox"
            role="switch"
            checked={filters.awd}
            onChange={(event) => dispatch({ type: 'awd', value: event.target.checked })}
          />
        </label>
      </Group>
    </div>
  )
}

// --- Группа ---------------------------------------------------------------------------
// fieldset + legend: скринридер называет группу перед каждым её вариантом
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{title}</legend>
      {children}
    </fieldset>
  )
}

// Марок в парке больше тридцати: сначала видны первые, остальные — по кнопке
// «Все марки». Отмеченная марка видна всегда, даже в свёрнутом списке
const BRANDS_SHOWN = 10

interface OptionGroupProps {
  title: string
  group: ListGroup
  variant: 'list' | 'pills'
  limit?: number
  filters: Filters
  onToggle: (key: string) => void
}

function OptionGroup({ title, group, variant, limit, filters, onToggle }: OptionGroupProps) {
  const counts = useMemo(() => facetCounts(VEHICLES, filters, group), [filters, group])
  const lang = useLang()
  const text = TEXT[lang]
  const selected = filters[group] as string[]
  const [expanded, setExpanded] = useState(false)
  const keys = PRESENT[group]
  const collapsible = limit !== undefined && keys.length > limit
  const shown = collapsible && !expanded ? keys.filter((key, index) => index < limit || selected.includes(key)) : keys

  return (
    <Group title={title}>
      <ul className={variant === 'list' ? styles.options : styles.pills}>
        {shown.map((key) => {
          const count = counts.get(key) ?? 0
          const checked = selected.includes(key)
          return (
            <li key={key}>
              <label
                className={variant === 'list' ? styles.option : styles.pill}
                data-empty={count === 0 && !checked ? '' : undefined}
              >
                <input
                  className={variant === 'list' ? styles.checkbox : styles.pillInput}
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(key)}
                />
                <span className={styles.optionLabel} translate={group === 'brand' ? 'no' : undefined}>
                  {optionLabel(group, key, lang)}
                </span>
                <span className={styles.count}>{count}</span>
              </label>
            </li>
          )
        })}
      </ul>
      {collapsible && (
        <button className={styles.more} type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
          {expanded ? text.fewerBrands : text.allBrands(keys.length)}
        </button>
      )}
    </Group>
  )
}
