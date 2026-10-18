import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import styles from './Button.module.css'

// Кнопки референса:
//  - gold — золотая пилюля с тёмным текстом и стрелкой (главные действия:
//    «Забронировать», «Выбрать автомобиль», «Найти авто»);
//  - outline — тёмная со светлым кантом и иконкой слева («Войти»);
//  - ghost — пилюля с кантом: второе действие рядом с золотой кнопкой
//    («Подробнее» в карточке каталога), той же формы, но тише.
// Размеры: sm — кнопки в карточках, md — шапка и секции, lg — первый экран,
// панель поиска и страница машины.
// С href рендерится ссылкой (через SiteLink — переходы по сайту без
// перезагрузки), без него — кнопкой: переход по сайту и действие на месте
// остаются разными элементами и для клавиатуры, и для скринридера.
// Остальные атрибуты (onClick, disabled, aria-*) передаются кнопке
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'className'> {
  children: ReactNode
  variant?: 'gold' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  type?: 'button' | 'submit'
  // Иконка перед текстом (outline-кнопка «Войти»)
  icon?: ReactNode
  // Стрелка после текста — у всех золотых кнопок референса
  arrow?: boolean
  className?: string
}

export function Button({
  children,
  variant = 'gold',
  size = 'md',
  href,
  type = 'button',
  icon,
  arrow = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')
  const content = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
      {arrow && <ArrowRight className={styles.arrow} size={18} strokeWidth={1.75} aria-hidden="true" />}
    </>
  )

  if (href) {
    return (
      <SiteLink className={classes} href={href} aria-label={rest['aria-label']}>
        {content}
      </SiteLink>
    )
  }

  return (
    <button className={classes} type={type} {...rest}>
      {content}
    </button>
  )
}
