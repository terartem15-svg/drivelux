import { Brands } from '@/sections/Brands/Brands'
import { Faq } from '@/sections/Faq/Faq'
import { Features } from '@/sections/Features/Features'
import { Hero } from '@/sections/Hero/Hero'
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks'
import { Loyalty } from '@/sections/Loyalty/Loyalty'
import { Moods } from '@/sections/Moods/Moods'
import { PopularCars } from '@/sections/PopularCars/PopularCars'
import { Reviews } from '@/sections/Reviews/Reviews'
import { useDocumentTitle } from '@/utils/useDocumentTitle'

// Главная страница DriveLux.
//
// Порядок секций — от «что есть» к «почему мы»: первый экран с поиском и
// преимуществами → лучшие предложения → бренды → категории под настроение
// → как взять машину → программа для постоянных клиентов → отзывы →
// частые вопросы. Плотные ряды карточек чередуются с лёгкими строками и
// крупными блоками, чтобы страница не читалась одной сеткой.
//
// Бренды, категории и карточки ведут в каталог (pages/Fleet) — с отбором
// по марке или классу и на страницу конкретной машины
export function HomePage() {
  useDocumentTitle(null)

  return (
    <>
      <Hero />
      <Features />
      <PopularCars />
      <Brands />
      <Moods />
      <HowItWorks />
      <Loyalty />
      <Reviews />
      <Faq />
    </>
  )
}
