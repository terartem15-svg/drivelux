import { useId } from 'react'

// Монограмма «D» из референса: широкая чаша с крючком сверху слева и
// отдельная наклонная ножка с хвостом влево — буква «в движении». Рисуется
// штрихами одного золотого градиента; те же контуры — в public/favicon.svg.
//
// id градиента уникальный (useId): монограмма может стоять на странице
// дважды (шапка, позже — футер), и одинаковые id перебили бы друг друга
export function LogoMark({ className }: { className?: string }) {
  const gradientId = useId()

  return (
    <svg className={className} viewBox="0 0 56 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="8" y1="4" x2="48" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f1d4a1" />
          <stop offset="1" stopColor="#c99a5d" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Чаша: крючок слева сверху → верхняя дуга → правый бок → низ */}
        <path d="M8.6 9.4C10.2 5.9 12.9 4.3 17.6 4.3H36C46.6 4.3 52 9.4 51.6 16.1C51.1 23.4 44.8 27.8 34 27.8H20.4" />
        {/* Ножка: наклон вниз-влево и хвост, уходящий за чашу */}
        <path d="M22.6 11.4L15.6 24.6C14.7 26.4 13.3 27.6 10.8 27.8H5" />
      </g>
    </svg>
  )
}
