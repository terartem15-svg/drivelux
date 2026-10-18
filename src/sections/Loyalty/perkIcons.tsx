import type { ReactNode } from 'react'
import { BadgePercent, Gem, UserRoundCheck, Zap } from 'lucide-react'
import type { PerkIcon } from '@/content/loyalty'

// Иконки привилегий программы лояльности по ключу из content/loyalty.ts —
// общие для баннера на главной и страницы /loyalty
export const PERK_ICONS: Record<PerkIcon, ReactNode> = {
  discount: <BadgePercent size={18} strokeWidth={1.5} />,
  fast: <Zap size={18} strokeWidth={1.5} />,
  manager: <UserRoundCheck size={18} strokeWidth={1.5} />,
  exclusive: <Gem size={18} strokeWidth={1.5} />,
}
