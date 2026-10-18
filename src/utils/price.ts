import { LOCALES, type Lang } from '@/i18n/lang'

// Цена в евро: по-русски «1 800 €» (знак после числа, разряды пробелом),
// по-английски «€1,800». Пробелы неразрывные: «300 €» не должно
// разрываться между строками в узкой карточке
export function formatEuro(amount: number, lang: Lang): string {
  const number = amount.toLocaleString(LOCALES[lang])
  return lang === 'ru' ? `${number}\u00a0€` : `€${number}`
}
