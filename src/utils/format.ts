import { LOCALES, type Lang } from '@/i18n/lang'

// Форматирование чисел и дат для текста интерфейса — по правилам языка
// сайта: по-русски «2,9» и «12.09.2026», по-английски «2.9» и «12 Sep 2026»

// --- Склонение по числу ----------------------------------------------------------
// «1 место, 2 места, 5 мест» / «1 seat, 2 seats». Правила выбора формы — из
// Intl.PluralRules: исключения вроде 11–14 браузер знает сам. В английском
// форм две — one и many (few для него не нужна)
const pluralRules = new Map<Lang, Intl.PluralRules>()

function rulesFor(lang: Lang) {
  let rules = pluralRules.get(lang)
  if (!rules) {
    rules = new Intl.PluralRules(LOCALES[lang])
    pluralRules.set(lang, rules)
  }
  return rules
}

export interface PluralForms {
  one: string
  few?: string
  many: string
}

export function plural(count: number, forms: PluralForms, lang: Lang): string {
  const rule = rulesFor(lang).select(count)
  if (rule === 'one') return forms.one
  if (rule === 'few') return forms.few ?? forms.many
  return forms.many
}

// Число и слово в нужной форме
export function countLabel(count: number, forms: PluralForms, lang: Lang): string {
  return `${count} ${plural(count, forms, lang)}`
}

// --- Десятичные дроби ----------------------------------------------------------------
// По-русски с запятой: «2,9», по-английски с точкой: «2.9»
export function formatDecimal(value: number, lang: Lang): string {
  return value.toLocaleString(LOCALES[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

// --- Даты ---------------------------------------------------------------------------
// «2026-09-12» → «12.09.2026» / «12 Sep 2026». Дата собирается из частей в
// местном времени, а не через new Date('2026-09-12'): так она не съедет на
// день из-за часового пояса посетителя
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatIsoDate(iso: string, lang: Lang): string {
  if (lang === 'ru') {
    const [year, month, day] = iso.split('-')
    return `${day}.${month}.${year}`
  }
  return parseIsoDate(iso).toLocaleDateString(LOCALES.en, { day: 'numeric', month: 'short', year: 'numeric' })
}

// Короткая дата без года: «15 окт» / «15 Oct» — в полях поиска и сводках
export function formatShortDate(iso: string, lang: Lang): string {
  return parseIsoDate(iso).toLocaleDateString(LOCALES[lang], { day: 'numeric', month: 'short' }).replace('.', '')
}

// Дата «ГГГГ-ММ-ДД» в местном времени: toISOString считает в UTC и вечером
// может вернуть завтрашний день
export function isoDate(date: Date): string {
  const pad = (number: number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayIso(): string {
  return isoDate(new Date())
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso)
  date.setDate(date.getDate() + days)
  return isoDate(date)
}

// Сутки аренды между датами: возврат в день получения — тоже сутки. Пока
// дата стёрта или введена не полностью, срок считается за одни сутки, а
// не «NaN»
export function daysBetween(from: string, to: string): number {
  const days = Math.round((parseIsoDate(to).getTime() - parseIsoDate(from).getTime()) / 86_400_000)
  return Number.isFinite(days) ? Math.max(1, days) : 1
}
