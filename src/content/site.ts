import type { SocialId } from '@/components/icons/logoPaths'
import { localized, type Localized } from '@/i18n/lang'

// Тексты шапки, подвала и контакты — в одном месте, отдельно от вёрстки.
// Все подписи — на двух языках (i18n/lang): { ru, en } у отдельной строки
// или localized(ru, en) у целого блока.
//
// Адреса ссылок по всему сайту трёх видов (components/SiteLink):
//  - '/fleet', '/#faq' — страницы сайта и секции главной, переход через
//    роутер без перезагрузки; с другой страницы '/#faq' откроет главную
//    сразу на секции;
//  - '#contacts' — место на текущей странице (подвал есть на всех);
//  - '#privacy', '#careers' — заглушки будущих страниц: адрес меняется, но
//    страница остаётся на месте
// Адреса страниц сайта (маршруты — в App.tsx)
export const ROUTES = {
  home: '/',
  fleet: '/fleet',
  services: '/services',
  about: '/about',
  favorites: '/favorites',
  booking: '/booking',
  loyalty: '/loyalty',
  reviews: '/reviews',
  login: '/login',
  register: '/register',
}

export interface NavLink {
  label: Localized<string>
  href: string
}

// «Услуги» — страница услуг (и подсвечивается на страницах отдельных
// услуг), «О компании» — страница бренда, «Контакты» — подвал текущей
// страницы. Активный пункт подсвечивается по адресу страницы
// (components/Header). У «Автопарка» в шапке — выпадающее меню с классами
// и марками (components/Header/FleetMenu)
export const NAV_LINKS: NavLink[] = [
  { label: { ru: 'Главная', en: 'Home' }, href: ROUTES.home },
  { label: { ru: 'Автопарк', en: 'Fleet' }, href: ROUTES.fleet },
  { label: { ru: 'Услуги', en: 'Services' }, href: ROUTES.services },
  { label: { ru: 'О компании', en: 'About' }, href: ROUTES.about },
  { label: { ru: 'Контакты', en: 'Contacts' }, href: '#contacts' },
]

// id панели поиска на первом экране — с неё начинается подбор машины
export const BOOKING_ANCHOR = 'booking'

// «Забронировать» ведёт на страницу заявки (pages/Booking): там выбирают
// машину, место и даты. Со страницы машины та же кнопка передаёт её id.
// «Войти» — страница входа (pages/Auth); после входа на её месте имя
export const HEADER_ACTIONS = {
  login: { label: { ru: 'Войти', en: 'Sign in' }, href: ROUTES.login },
  book: { label: { ru: 'Забронировать', en: 'Book now' }, href: ROUTES.booking },
  favorites: { label: { ru: 'Избранное', en: 'Favourites' }, href: ROUTES.favorites },
}

// --- Контакты -------------------------------------------------------------------------
// Одни и те же в подвале, мобильном меню и карточке «Не нашли ответ?».
// Ссылки на мессенджеры и соцсети — заглушки-якоря, пока нет настоящих
// аккаунтов. Телефон и почта — заведомо несуществующие, чтобы звонок или
// письмо с демо-сайта не ушли реальным людям: московских номеров на 000 нет,
// а домен .example зарезервирован и никому не выдаётся. Улицы и дома тоже
// нет: реальный адрес вёл бы к чужому зданию, поэтому вместо него — явная
// пометка, что пункт выдачи демонстрационный (так же и в places.ts)
export const CONTACTS = {
  phone: { label: '+7 495 000-00-00', href: 'tel:+74950000000' },
  email: { label: 'hello@drivelux.example', href: 'mailto:hello@drivelux.example' },
  address: {
    ru: 'Демонстрационный пункт выдачи — адрес не указан',
    en: 'Demo pickup point — no real address',
  },
  // \u2060 (невидимая «склейка») после тире: время «08:00–22:00» не
  // разрывается на две строки в узкой колонке
  hours: {
    ru: ['Офис — ежедневно 08:00–\u206022:00', 'Поддержка — круглосуточно'],
    en: ['Office — daily 08:00–\u206022:00', 'Support — 24/7'],
  },
  telegram: '#telegram',
  whatsapp: '#whatsapp',
}

// Соцсети в подвале — набор и порядок из референса
export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', href: '#instagram' },
  { id: 'telegram', label: 'Telegram', href: CONTACTS.telegram },
  { id: 'youtube', label: 'YouTube', href: '#youtube' },
  { id: 'vk', label: 'VK', href: '#vk' },
] satisfies { id: SocialId; label: string; href: string }[]

// --- Подвал ------------------------------------------------------------------------------
// Раскладка — по мотивам подвалов прокатов и премиальных сервисов (Europcar,
// Blacklane): сверху полоса с подпиской на предложения и телефоном, ниже —
// колонки ссылок (автопарк, услуги, клиентам, места получения, компания),
// контакты, рейтинги и способы оплаты, в самом низу — копирайт и
// правовые ссылки
export const FOOTER = localized(
  {
    about: 'Аренда премиальных автомобилей в Москве. Подаём машины по городу и в аэропорты круглосуточно.',
    newsletter: {
      title: 'Закрытые предложения',
      text: 'Новые машины парка, сезонные скидки и приглашения на тест-драйвы — раз в месяц, без спама.',
      label: 'Ваш e-mail',
      placeholder: 'name@mail.ru',
      submit: 'Подписаться',
      invalid: 'Похоже, в адресе ошибка — пример: name@mail.ru',
      done: 'Готово! Это демо: адрес никуда не отправлен.',
    },
    callTitle: 'Подберём машину по телефону',
    callText: 'Ежедневно, 24/7',
    columns: {
      fleet: 'Автопарк',
      services: 'Услуги',
      clients: 'Клиентам',
      places: 'Где получить',
      company: 'Компания',
    },
    allCars: 'Все автомобили',
    clientLinks: [
      { label: 'Как это работает', href: '/#how-it-works' },
      { label: 'Программа лояльности', href: ROUTES.loyalty },
      { label: 'Отзывы клиентов', href: ROUTES.reviews },
      { label: 'Частые вопросы', href: '/#faq' },
      { label: 'Избранное', href: ROUTES.favorites },
    ],
    companyLinks: [
      { label: 'О компании', href: ROUTES.about },
      { label: 'Корпоративным клиентам', href: '/services/corporate' },
      { label: 'Вакансии', href: '#careers' },
      { label: 'Партнёрам', href: '#partners' },
      { label: 'Контакты', href: '#contacts' },
    ],
    contactsTitle: 'Контакты',
    ratingsTitle: 'Нас рекомендуют',
    ratings: [
      { source: 'Яндекс Карты', value: '4,9' },
      { source: 'Google', value: '4,8' },
    ],
    reviewsLink: 'Читать отзывы',
    paymentTitle: 'Принимаем к оплате',
    legal: [
      { label: 'Политика конфиденциальности', href: '#privacy' },
      { label: 'Условия аренды', href: '/#faq' },
      { label: 'Cookie', href: '#cookies' },
    ],
    rights: 'Все права защищены.',
    concept: 'Концепт-сайт для портфолио: машины, цены и контакты вымышленные.',
    toTop: 'Наверх',
    home: 'DriveLux — на главную',
  },
  {
    about: 'Premium car rental in Moscow. We deliver cars across the city and to the airports around the clock.',
    newsletter: {
      title: 'Private offers',
      text: 'New cars in the fleet, seasonal deals and test-drive invitations — once a month, no spam.',
      label: 'Your e-mail',
      placeholder: 'name@mail.com',
      submit: 'Subscribe',
      invalid: 'This address looks wrong — e.g. name@mail.com',
      done: 'Done! This is a demo: the address was not sent anywhere.',
    },
    callTitle: 'Let us pick a car over the phone',
    callText: 'Every day, 24/7',
    columns: {
      fleet: 'Fleet',
      services: 'Services',
      clients: 'For clients',
      places: 'Pick-up points',
      company: 'Company',
    },
    allCars: 'All cars',
    clientLinks: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Loyalty programme', href: ROUTES.loyalty },
      { label: 'Client reviews', href: ROUTES.reviews },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Favourites', href: ROUTES.favorites },
    ],
    companyLinks: [
      { label: 'About us', href: ROUTES.about },
      { label: 'Corporate clients', href: '/services/corporate' },
      { label: 'Careers', href: '#careers' },
      { label: 'Partners', href: '#partners' },
      { label: 'Contacts', href: '#contacts' },
    ],
    contactsTitle: 'Contacts',
    ratingsTitle: 'Rated by clients',
    ratings: [
      { source: 'Yandex Maps', value: '4.9' },
      { source: 'Google', value: '4.8' },
    ],
    reviewsLink: 'Read reviews',
    paymentTitle: 'We accept',
    legal: [
      { label: 'Privacy policy', href: '#privacy' },
      { label: 'Rental terms', href: '/#faq' },
      { label: 'Cookies', href: '#cookies' },
    ],
    rights: 'All rights reserved.',
    concept: 'A portfolio concept site: cars, prices and contacts are fictional.',
    toTop: 'Back to top',
    home: 'DriveLux — home',
  },
)

// Способы оплаты — названия платёжных систем, по-английски латиницей
export const PAYMENT_METHODS: Localized<string[]> = {
  ru: ['Visa', 'Mastercard', 'Мир', 'СБП', 'Apple Pay'],
  en: ['Visa', 'Mastercard', 'Mir', 'SBP', 'Apple Pay'],
}
