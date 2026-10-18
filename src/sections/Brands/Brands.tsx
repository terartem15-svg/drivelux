import { SectionHeading } from '@/components/SectionHeading/SectionHeading'
import { SimpleIcon } from '@/components/icons/SimpleIcon'
import { BRAND_PATHS } from '@/components/icons/logoPaths'
import { SiteLink } from '@/components/SiteLink/SiteLink'
import { BRANDS, BRANDS_SECTION } from '@/content/brands'
import { useLang } from '@/i18n/lang'
import styles from './Brands.module.css'

// «Бренды»: логотипы всех марок автопарка бегущей строкой. Лента плавно и
// бесконечно едет вправо; под курсором (и когда фокус с клавиатуры на
// одной из марок) — останавливается, чтобы по логотипу было удобно
// попасть. Под каждым логотипом — сколько машин марки в парке, клик
// открывает каталог с отбором по марке.
//
// Бесконечность — две одинаковые копии списка подряд: лента сдвигается
// ровно на ширину одной копии и начинает заново, стык не виден. Вторая
// копия — только картинка: скрыта от скринридера и недоступна для Tab
// (inert), иначе каждую марку пришлось бы проходить дважды. Края ленты
// растворяются в фоне маской.
//
// Если человек просил убрать анимации, лента стоит на месте и
// прокручивается пальцем или колёсиком, как обычный ряд.
// Логотипы в одну краску и приглушены — на тёмном фоне цветные гербы
// спорили бы с золотом сайта. При наведении логотип золотеет
export function Brands() {
  const text = BRANDS_SECTION[useLang()]

  return (
    <section className={styles.section} id="brands" aria-labelledby="brands-title">
      <div className="container">
        <SectionHeading id="brands-title" eyebrow={text.eyebrow} title={text.title} link={text.link} />
      </div>

      <div className={styles.marquee} data-reveal>
        <div className={styles.track}>
          <BrandList cars={text.cars} />
          <BrandList cars={text.cars} copy />
        </div>
      </div>
    </section>
  )
}

function BrandList({ cars, copy = false }: { cars: string; copy?: boolean }) {
  return (
    <ul className={styles.list} aria-hidden={copy || undefined} inert={copy || undefined}>
      {BRANDS.map((brand) => (
        <li key={brand.id}>
          <SiteLink className={styles.brand} href={brand.href}>
            <span className={styles.logoBox}>
              {brand.logo ? (
                <SimpleIcon
                  className={styles.logo}
                  path={BRAND_PATHS[brand.logo]}
                  style={{ scale: brand.scale ?? 1 }}
                />
              ) : (
                // Логотипов Range Rover, Land Rover, Lexus и Genesis в
                // simple-icons нет — вместо них словесный знак с разрядкой,
                // как на капоте: название из двух слов — в две строки.
                // Не «RR»: так выглядит логотип Rolls-Royce в той же ленте
                <span className={styles.wordmark} aria-hidden="true">
                  {brand.name.split(' ').map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </span>
              )}
            </span>
            <span className={styles.name} translate="no">
              {brand.name}
            </span>
            <span className={styles.count}>
              {brand.count}&nbsp;{cars}
            </span>
          </SiteLink>
        </li>
      ))}
    </ul>
  )
}
