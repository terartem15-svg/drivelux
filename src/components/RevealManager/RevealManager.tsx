import { useEffect } from 'react'

// Плавное появление блоков при прокрутке — на всех страницах сразу.
// Элементы с атрибутом data-reveal (на страницах и в подвале) получают data-revealed,
// когда доезжают до экрана; сама анимация — в global.css. Порядок в группе
// (лесенка карточек) задаёт CSS-переменная --reveal-order.
//
// Наблюдатель один на весь сайт и следит за изменениями страницы
// (MutationObserver): блоки новой страницы, «Показать ещё» в отзывах и
// смена фильтров подхватываются сами, без вызова в каждом компоненте.
//
// Если человек просил убрать анимации (prefers-reduced-motion) или браузер
// не знает IntersectionObserver, блоки видны сразу: скрытое состояние в CSS
// включается только при разрешённом движении
export function RevealManager() {
  useEffect(() => {
    const root = document.body

    if (!('IntersectionObserver' in window)) {
      const showAll = () =>
        root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach((target) => {
          target.dataset.revealed = ''
        })
      showAll()
      const mutations = new MutationObserver(showAll)
      mutations.observe(root, { childList: true, subtree: true })
      return () => mutations.disconnect()
    }

    const observed = new WeakSet<Element>()
    const intersections = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.revealed = ''
          intersections.unobserve(entry.target)
        }
      },
      // Блок проявляется, когда его верх поднялся над нижними 6% экрана —
      // не у самой кромки, но и не настолько высоко, чтобы последние блоки
      // короткой страницы так и остались невидимыми
      { rootMargin: '0px 0px -6% 0px' },
    )

    // Новые блоки ищутся раз в кадр, а не на каждое изменение DOM: при
    // смене страницы изменений сотни
    let frame = 0
    function scan() {
      frame = 0
      root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((target) => {
        if (observed.has(target)) return
        observed.add(target)
        intersections.observe(target)
      })
    }

    scan()
    const mutations = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan)
    })
    mutations.observe(root, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      intersections.disconnect()
    }
  }, [])

  return null
}
