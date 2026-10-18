import { createBrowserRouter } from 'react-router'
import { Layout } from '@/components/Layout/Layout'
import { HomePage } from '@/pages/Home/HomePage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'

// Маршруты сайта. Всё работает в браузере, без сервера: данные машин —
// локальный файл (content/vehicles.ts), избранное, язык и аккаунты —
// localStorage. Адреса одинаковые для русского и английского.
//  /                 — главная
//  /fleet            — каталог; фильтры и сортировка живут в адресе
//                      (/fleet?brand=bmw&class=suv) — ссылкой можно
//                      поделиться, а «Назад» со страницы машины вернёт тот
//                      же отбор
//  /fleet/:id        — страница машины
//  /services         — услуги: доставка, оборудование, долгосрочная,
//                      корпоративная, с водителем
//  /services/:slug   — страница услуги; один шаблон на все услуги,
//                      содержимое — из content/services.ts
//  /about            — о компании: история, философия, принципы, галерея
//  /booking?car=:id  — демо-заявка на бронирование (from — место получения)
//  /favorites        — избранное
//  /loyalty          — программа лояльности DriveLux Club
//  /reviews          — отзывы клиентов с фильтрами и сортировкой
//  /login, /register — вход и регистрация (аккаунт только в браузере)
//  *                 — «Страница не найдена»
//
// На хостинге все эти адреса должны отдавать index.html (SPA-фолбэк);
// vite dev и vite preview делают это сами.
//
// Главная — в основном файле: с неё чаще всего начинают. Остальные
// страницы — отдельными файлами (lazy), которые грузятся при первом
// переходе: роутер дожидается файла и только потом меняет страницу,
// поэтому пустого экрана между страницами нет
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // Сбой при открытии страницы (например, не загрузился её файл) — без
    // шапки, но с выходом в автопарк и на главную
    errorElement: <NotFoundPage variant="error" />,
    // Пока при первом открытии сайта сразу на внутренней странице грузится
    // её файл, на экране — пустой ночной фон (без него роутер ругается)
    hydrateFallbackElement: <div className="page-fallback" />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'fleet',
        lazy: () => import('@/pages/Fleet/FleetPage').then((module) => ({ Component: module.FleetPage })),
      },
      {
        path: 'fleet/:id',
        lazy: () => import('@/pages/Vehicle/VehiclePage').then((module) => ({ Component: module.VehiclePage })),
      },
      {
        path: 'services',
        lazy: () => import('@/pages/Services/ServicesPage').then((module) => ({ Component: module.ServicesPage })),
      },
      {
        path: 'services/:slug',
        lazy: () => import('@/pages/Services/ServicePage').then((module) => ({ Component: module.ServicePage })),
      },
      {
        path: 'about',
        lazy: () => import('@/pages/About/AboutPage').then((module) => ({ Component: module.AboutPage })),
      },
      {
        path: 'booking',
        lazy: () => import('@/pages/Booking/BookingPage').then((module) => ({ Component: module.BookingPage })),
      },
      {
        path: 'favorites',
        lazy: () => import('@/pages/Favorites/FavoritesPage').then((module) => ({ Component: module.FavoritesPage })),
      },
      {
        path: 'loyalty',
        lazy: () => import('@/pages/Loyalty/LoyaltyPage').then((module) => ({ Component: module.LoyaltyPage })),
      },
      {
        path: 'reviews',
        lazy: () => import('@/pages/Reviews/ReviewsPage').then((module) => ({ Component: module.ReviewsPage })),
      },
      {
        path: 'login',
        lazy: () => import('@/pages/Auth/AuthPage').then((module) => ({ Component: module.LoginPage })),
      },
      {
        path: 'register',
        lazy: () => import('@/pages/Auth/AuthPage').then((module) => ({ Component: module.RegisterPage })),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
