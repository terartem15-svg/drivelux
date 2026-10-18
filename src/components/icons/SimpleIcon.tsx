import type { SVGProps } from 'react'

// Логотип марки или соцсети в одну краску: контур из simple-icons (сетка
// 24×24, заливка currentColor). Цвет задаёт CSS родителя — логотипы
// приглушены и золотеют при наведении вместе с подписью.
// Всегда декоративный: название марки или соцсети даёт текст ссылки
interface SimpleIconProps extends SVGProps<SVGSVGElement> {
  path: string
}

export function SimpleIcon({ path, ...rest }: SimpleIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
      <path d={path} />
    </svg>
  )
}
