import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { RevealManager } from '@/components/RevealManager/RevealManager'
import { ScrollManager } from '@/components/ScrollManager/ScrollManager'

// Общий каркас всех страниц: шапка, содержимое страницы и подвал. На
// главной шапка лежит поверх фото первого экрана, на остальных — стоит в
// потоке. <main> получает фокус при переходе на новую страницу
// (components/ScrollManager), поэтому у него tabIndex={-1} и id.
//
// Плавная смена страниц: содержимое обёрнуто в блок с ключом-адресом —
// при переходе на другую страницу он создаётся заново и проявляется
// анимацией .page-enter (global.css). Смена только параметров (фильтры
// каталога) или #якоря страницу не пересоздаёт. Появление блоков при
// прокрутке — RevealManager, один на весь сайт
export function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollManager />
      <RevealManager />
      <Header overlay={pathname === '/'} />
      <main id="main" tabIndex={-1}>
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}
