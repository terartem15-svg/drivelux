import type { Localized } from '@/i18n/lang'

// Преимущества под панелью поиска. После коротких предлогов и чисел —
// неразрывный пробел (\u00a0): на телефоне строки переносятся по словам,
// и «в» или «1» не должны повиснуть в конце строки.
//
// Иконка задана ключом, а не компонентом:
// контент остаётся чистыми данными, картинку по ключу выбирает секция
// (sections/Features/Features.tsx)

export type FeatureIcon = 'fleet' | 'support' | 'insurance' | 'terms'

export interface Feature {
  icon: FeatureIcon
  title: Localized<string>
  // Описание по строкам — переносы как в референсе
  text: Localized<string[]>
}

export const FEATURES: Feature[] = [
  {
    icon: 'fleet',
    title: { ru: 'Премиальный автопарк', en: 'Premium fleet' },
    text: { ru: ['Более 100\u00a0авто', 'на\u00a0любой вкус'], en: ['100+ cars', 'for every taste'] },
  },
  {
    icon: 'support',
    title: { ru: 'Круглосуточная поддержка', en: '24/7 support' },
    text: { ru: ['Мы всегда на связи'], en: ['We are always in touch'] },
  },
  {
    icon: 'insurance',
    title: { ru: 'Страховка включена', en: 'Insurance included' },
    text: { ru: ['Ваша безопасность', 'в\u00a0приоритете'], en: ['Your safety', 'comes first'] },
  },
  {
    icon: 'terms',
    title: { ru: 'Гибкие условия', en: 'Flexible terms' },
    text: { ru: ['От\u00a01\u00a0дня до\u00a0нескольких', 'месяцев'], en: ['From 1\u00a0day', 'to several months'] },
  },
]

export const FEATURES_TITLE: Localized<string> = { ru: 'Преимущества DriveLux', en: 'Why DriveLux' }
