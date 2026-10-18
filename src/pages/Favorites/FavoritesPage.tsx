import { Heart } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { VehicleCard } from '@/components/VehicleCard/VehicleCard'
import { ROUTES } from '@/content/site'
import { getVehicle, type Vehicle } from '@/content/vehicles'
import { localized, useLang } from '@/i18n/lang'
import { clearFavorites, useFavorites } from '@/store/favorites'
import { countLabel } from '@/utils/format'
import { useDocumentTitle } from '@/utils/useDocumentTitle'
import styles from './FavoritesPage.module.css'

// «Избранное» — машины, отмеченные сердечком на любой странице сайта.
// Список хранится в браузере (store/favorites), последняя отмеченная —
// первой. Снять сердечко здесь — машина сразу уходит из списка.
//
// Пустое избранное — не тупик: объясняем, как сюда попадают машины, и
// ведём в каталог
const TEXT = localized(
  {
    title: 'Избранное',
    home: 'Главная',
    cars: { one: 'машина', few: 'машины', many: 'машин' },
    lead: (count: string) => `${count} — сравните и забронируйте подходящую. Список хранится в этом браузере.`,
    clear: 'Очистить избранное',
    confirm: 'Убрать все машины из избранного?',
    emptyTitle: 'В избранном пока пусто',
    emptyText: 'Нажмите на сердечко на карточке машины — она появится здесь и останется, даже если закрыть сайт.',
    toFleet: 'Перейти в автопарк',
  },
  {
    title: 'Favourites',
    home: 'Home',
    cars: { one: 'car', few: 'cars', many: 'cars' },
    lead: (count: string) => `${count} — compare them and book the right one. The list is stored in this browser.`,
    clear: 'Clear favourites',
    confirm: 'Remove all cars from favourites?',
    emptyTitle: 'No favourites yet',
    emptyText: 'Tap the heart on a car card — it will appear here and stay even if you close the site.',
    toFleet: 'Go to the fleet',
  },
)

export function FavoritesPage() {
  const lang = useLang()
  const text = TEXT[lang]
  useDocumentTitle(text.title)
  const ids = useFavorites()
  const vehicles = ids.map((id) => getVehicle(id)).filter((item): item is Vehicle => item !== undefined)
  const count = vehicles.length

  function handleClear() {
    if (window.confirm(text.confirm)) clearFavorites()
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: text.home, href: ROUTES.home }, { label: text.title }]}
        title={text.title}
        lead={count > 0 ? text.lead(countLabel(count, text.cars, lang)) : undefined}
        aside={
          count > 0 && (
            <div className={styles.aside}>
              <Button variant="ghost" onClick={handleClear}>
                {text.clear}
              </Button>
            </div>
          )
        }
      />

      <div className={`container ${styles.body}`}>
        {count > 0 ? (
          <ul className={styles.grid}>
            {vehicles.map((vehicle, index) => (
              <li key={vehicle.id}>
                <VehicleCard vehicle={vehicle} order={index} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Heart />}
            title={text.emptyTitle}
            text={text.emptyText}
            action={
              <Button href={ROUTES.fleet} arrow>
                {text.toFleet}
              </Button>
            }
          />
        )}
      </div>
    </>
  )
}
