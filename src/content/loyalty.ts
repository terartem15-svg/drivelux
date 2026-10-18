import salonImage from '@/assets/loyalty/salon.webp'
import { localized } from '@/i18n/lang'
import { ROUTES } from './site'

// Программа лояльности DriveLux Club: баннер на главной («Особые условия
// для постоянных клиентов») и отдельная страница /loyalty, куда ведёт его
// кнопка «Узнать больше». Уровни и привилегии — общие для обоих мест:
// с какой поездки какая скидка, что ещё даёт каждый уровень.
//
// Сайт — концепт: программа, скидки и условия демонстрационные, и страница
// так и подписывает их. image — фото салона (центральная консоль BMW в
// тёплой коже); без фото баннер рисует заглушку
export type PerkIcon = 'discount' | 'fast' | 'manager' | 'exclusive'
export type TierId = 'silver' | 'gold' | 'platinum'

export interface LoyaltyTier {
  id: TierId
  trips: number
  discount: number // доля: 0.05 — это 5%
}

export const TIERS: LoyaltyTier[] = [
  { id: 'silver', trips: 3, discount: 0.05 },
  { id: 'gold', trips: 7, discount: 0.1 },
  { id: 'platinum', trips: 12, discount: 0.15 },
]

export const LOYALTY_IMAGE: string | undefined = salonImage

// --- Баннер на главной -----------------------------------------------------------------
export const LOYALTY = localized(
  {
    // Заголовок по строкам — как в референсе
    titleLines: ['Особые условия', 'для постоянных клиентов'],
    text: 'Больше поездок — больше привилегий. Узнайте о нашей программе лояльности.',
    cta: { label: 'Узнать больше', href: ROUTES.loyalty },
    perks: [
      { icon: 'discount', label: 'Скидки до 15%' },
      { icon: 'fast', label: 'Быстрое бронирование' },
      { icon: 'manager', label: 'Персональный менеджер' },
      { icon: 'exclusive', label: 'Эксклюзивные предложения' },
    ] as { icon: PerkIcon; label: string }[],
    tiersTitle: 'Уровни программы',
    tierTrips: (trips: number) => `С\u00a0${trips}-й поездки`,
    tierRewards: ['−5% на каждую аренду', '−10% и подача вне очереди', '−15% и личный менеджер'],
  },
  {
    titleLines: ['Special terms', 'for regular clients'],
    text: 'More trips — more privileges. Learn about our loyalty programme.',
    cta: { label: 'Learn more', href: ROUTES.loyalty },
    perks: [
      { icon: 'discount', label: 'Up to 15% off' },
      { icon: 'fast', label: 'Fast booking' },
      { icon: 'manager', label: 'Personal manager' },
      { icon: 'exclusive', label: 'Exclusive offers' },
    ],
    tiersTitle: 'Programme tiers',
    tierTrips: (trips: number) => `From trip ${trips}`,
    tierRewards: ['5% off every rental', '10% off and priority delivery', '15% off and a personal manager'],
  },
)
