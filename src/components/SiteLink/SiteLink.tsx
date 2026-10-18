import type { AnchorHTMLAttributes } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

// Единая ссылка сайта — выбирает, как переходить, по виду адреса
// (соглашение описано в content/site.ts):
//  - '/fleet', '/#faq' — через роутер: страница меняется без перезагрузки,
//    а к секции по #якорю прокручивает components/ScrollManager;
//  - '#contacts' — место на текущей странице. Тоже через роутер, но с
//    сохранением адреса и параметров: иначе ссылка на подвал сбросила бы
//    фильтры каталога в адресной строке;
//  - 'tel:', 'mailto:', 'https:' — обычная ссылка.
// nav — для пунктов меню: NavLink сам ставит aria-current="page" на
// активной странице ('/' — только на главной, '/fleet' — и на машинах)
interface SiteLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  nav?: boolean
}

export function SiteLink({ href, nav = false, ...rest }: SiteLinkProps) {
  const location = useLocation()

  if (href.startsWith('#')) {
    return <Link to={{ pathname: location.pathname, search: location.search, hash: href }} {...rest} />
  }

  if (href.startsWith('/')) {
    // Секция главной ('/#faq') — не страница, её пункт не подсвечивается
    if (nav && !href.includes('#')) {
      return <NavLink to={href} end={href === '/'} {...rest} />
    }
    return <Link to={href} {...rest} />
  }

  return <a href={href} {...rest} />
}
