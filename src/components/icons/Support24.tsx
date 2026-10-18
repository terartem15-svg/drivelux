import type { SVGProps } from 'react'

// Иконка «24 часа» из референса: круговая стрелка с цифрами 24 внутри.
// В lucide такой нет, поэтому она нарисована в той же системе, что и
// остальные иконки: сетка 24×24, штрих currentColor, скруглённые концы —
// рядом с lucide-иконками её не отличить по стилю
interface Support24Props extends SVGProps<SVGSVGElement> {
  size?: number
}

export function Support24({ size = 24, strokeWidth = 1.5, ...rest }: Support24Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {/* Круговая стрелка по часовой и её наконечник */}
      <path d="M19.5 12a7.5 7.5 0 1 1-1.5-4.6" />
      <path d="M18.2 3.4v4.2H14" />
      {/* Цифры «24» — текстом шрифта страницы, а не штрихами: при размере
          иконки ~22px нарисованные цифры слипаются, а шрифт рендерится
          с хинтингом и остаётся читаемым */}
      <text x="12" y="14.7" textAnchor="middle" fontSize="7.4" fontWeight="700" fill="currentColor" stroke="none">
        24
      </text>
    </svg>
  )
}
