import cityImage from '@/assets/about/city.webp'
import citySmall from '@/assets/about/city-sm.webp'
import controlsImage from '@/assets/about/controls.webp'
import controlsSmall from '@/assets/about/controls-sm.webp'
import ctaImage from '@/assets/about/cta.webp'
import ctaSmall from '@/assets/about/cta-sm.webp'
import filmPoster from '@/assets/about/film-poster.webp'
import filmVideo from '@/assets/about/film.mp4'
import heroImage from '@/assets/about/hero.webp'
import heroSmall from '@/assets/about/hero-sm.webp'
import keysImage from '@/assets/about/keys.webp'
import keysSmall from '@/assets/about/keys-sm.webp'
import lightsImage from '@/assets/about/lights.webp'
import lightsSmall from '@/assets/about/lights-sm.webp'
import roadImage from '@/assets/about/road.webp'
import roadSmall from '@/assets/about/road-sm.webp'
import seatImage from '@/assets/about/seat.webp'
import seatSmall from '@/assets/about/seat-sm.webp'
import storyImage from '@/assets/about/story.webp'
import storySmall from '@/assets/about/story-sm.webp'
import wheelImage from '@/assets/about/wheel.webp'
import wheelSmall from '@/assets/about/wheel-sm.webp'
import { localized, type Localized } from '@/i18n/lang'
import { carPhotoUrl } from './carPhotos'
import { PHOTO_CREDITS } from './photoCredits'
import { ROUTES } from './site'

// Страница «О компании» (/about) — все тексты, цифры, этапы и фото в одном
// месте, отдельно от вёрстки (pages/About). Сайт — концепт для портфолио,
// поэтому здесь нет ничего, что выдавалось бы за настоящие факты:
//  - цифры в ряду показателей взяты из макета и подписаны на странице как
//    демонстрационные (STATS — заменить на настоящие одной правкой);
//  - этапы истории — концептуальная история бренда, над шкалой это сказано;
//  - вопросы и ответы не вводят новых правил аренды: за условиями они
//    отправляют туда, где сайт их уже описывает (страница машины, «Частые
//    вопросы» на главной), а контакты — общие вымышленные из site.ts

// --- Фото ------------------------------------------------------------------------------
// Unsplash и Pexels (обе лицензии разрешают бесплатное использование и
// обработку без обязательной подписи — авторов всё равно подписываем внизу
// страницы). Снимки приведены к ночной гамме сайта: яркость выровнена,
// насыщенность чуть снижена, лёгкий тёплый сдвиг и виньетка. Силуэт для
// финального блока перекрашен из чёрно-белого в золото.
// src — большой файл (первый экран, лайтбокс), small — для блоков и плиток.
// focus — точка кадра, которая остаётся видна при обрезке (object-position)
export interface AboutImage {
  src: string
  small: string
  alt: Localized<string>
  focus?: string
  credit: { author: string; url: string; source: 'Unsplash' | 'Pexels' }
}

export const ABOUT_IMAGES = {
  // Чёрный Lamborghini Aventador S Roadster в сумерках — кадр 3:2, машина
  // занимает почти всю ширину: на десктопе он прижат вправо и растворяется
  // влево в размытую копию себя (pages/About/AboutPage.module.css, .heroPhoto)
  hero: {
    src: heroImage,
    small: heroSmall,
    alt: {
      ru: 'Чёрный Lamborghini Aventador S Roadster у дороги в сумерках',
      en: 'A black Lamborghini Aventador S Roadster by the road at dusk',
    },
    focus: '58% 60%',
    credit: { author: 'Eric Soubeyrand de Saint Prix', url: 'https://unsplash.com/photos/CUAcqn9ag8w', source: 'Unsplash' },
  },
  // Вертикальный кадр шоурума: в горизонтальной рамке остаётся машина и
  // световые линии потолка
  story: {
    src: storyImage,
    small: storySmall,
    alt: {
      ru: 'Чёрный суперкар в тёмном шоуруме со световыми линиями на потолке',
      en: 'A black supercar in a dark showroom with light lines on the ceiling',
    },
    focus: '50% 68%',
    credit: { author: 'Streets Square', url: 'https://www.pexels.com/photo/15821873/', source: 'Pexels' },
  },
  road: {
    src: roadImage,
    small: roadSmall,
    alt: {
      ru: 'Чёрный суперкар на горной дороге в золотой час',
      en: 'A black supercar on a mountain road at golden hour',
    },
    focus: '62% 70%',
    credit: { author: 'Hensan Aranha', url: 'https://www.pexels.com/photo/7942893/', source: 'Pexels' },
  },
  details: {
    src: controlsImage,
    small: controlsSmall,
    alt: {
      ru: 'Кнопки на дверной панели и золотая строчка на коже',
      en: 'Door panel buttons and gold stitching on leather',
    },
    focus: '55% 50%',
    credit: { author: 'Mike Bird', url: 'https://www.pexels.com/photo/2908558/', source: 'Pexels' },
  },
  keys: {
    src: keysImage,
    small: keysSmall,
    alt: {
      ru: 'Водитель держит ключи в салоне спорткара за рулём',
      en: 'A driver holding the keys behind the wheel of a sports car',
    },
    focus: '50% 84%',
    credit: { author: 'Amar Preciado', url: 'https://www.pexels.com/photo/14228048/', source: 'Pexels' },
  },
  cta: {
    src: ctaImage,
    small: ctaSmall,
    alt: { ru: '', en: '' },
    focus: '50% 80%',
    credit: { author: 'zero take', url: 'https://unsplash.com/photos/GSWB27kX1Bs', source: 'Unsplash' },
  },
} satisfies Record<string, AboutImage>

// --- Галерея «DriveLux в деталях» -------------------------------------------------------
// Шесть кадров мозаикой: крупный, узкие и широкие. Два — из автопарка
// (Cullinan и SL 63 — те же файлы, что в каталоге), четыре — новые.
// area — место в мозаике (AboutPage.module.css, .gallery)
// tone — CSS-фильтр для кадров из автопарка: они светлее новых, и без
// приглушения выбивались бы из ночной мозаики
export interface GalleryPhoto extends AboutImage {
  id: string
  area: 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
  caption: Localized<string>
  tone?: string
}

const fleetCredit = (id: string, index: number) => ({ ...PHOTO_CREDITS[id][index], source: 'Unsplash' as const })

export const GALLERY: GalleryPhoto[] = [
  {
    id: 'cullinan',
    area: 'a',
    src: carPhotoUrl('cullinan', 1),
    small: carPhotoUrl('cullinan', 1, true),
    caption: { ru: 'Rolls-Royce Cullinan Black Badge', en: 'Rolls-Royce Cullinan Black Badge' },
    alt: {
      ru: 'Чёрный Rolls-Royce Cullinan у здания под грозовым небом',
      en: 'A black Rolls-Royce Cullinan by a building under a stormy sky',
    },
    focus: '50% 60%',
    tone: 'brightness(0.78) saturate(0.82)',
    credit: fleetCredit('cullinan', 0),
  },
  {
    id: 'wheel',
    area: 'b',
    src: wheelImage,
    small: wheelSmall,
    caption: { ru: 'Руль и кожа с контрастной строчкой', en: 'Steering wheel and contrast-stitched leather' },
    alt: {
      ru: 'Кожаный руль с красной строчкой в тёмном салоне',
      en: 'A leather steering wheel with red stitching in a dark cabin',
    },
    focus: '60% 40%',
    credit: { author: 'Tausif Ali Khan', url: 'https://www.pexels.com/photo/19592871/', source: 'Pexels' },
  },
  {
    id: 'seat',
    area: 'c',
    src: seatImage,
    small: seatSmall,
    caption: { ru: 'Сиденье с сотовой прострочкой', en: 'Seat with honeycomb quilting' },
    alt: {
      ru: 'Спортивное сиденье Lamborghini с оранжевой сотовой прострочкой',
      en: 'A Lamborghini sports seat with orange honeycomb quilting',
    },
    focus: '50% 45%',
    credit: { author: 'Redyar Rzgar', url: 'https://www.pexels.com/photo/37147620/', source: 'Pexels' },
  },
  {
    id: 'lights',
    area: 'd',
    src: lightsImage,
    small: lightsSmall,
    caption: { ru: 'Свет фар в сумерках', en: 'Headlights at dusk' },
    alt: {
      ru: 'Фары автомобиля светятся в сумерках',
      en: 'Car headlights glowing at dusk',
    },
    focus: '45% 42%',
    credit: { author: 'Borta', url: 'https://www.pexels.com/photo/31968459/', source: 'Pexels' },
  },
  {
    id: 'city',
    area: 'e',
    src: cityImage,
    small: citySmall,
    caption: { ru: 'Ночной город в движении', en: 'The city at night, in motion' },
    alt: {
      ru: 'Суперкар проносится по ночной улице, огни витрин размыты',
      en: 'A supercar speeding down a night street with blurred shop lights',
    },
    focus: '50% 62%',
    credit: { author: 'Paul Lichtblau', url: 'https://www.pexels.com/photo/35319488/', source: 'Pexels' },
  },
  {
    id: 'sl',
    area: 'f',
    src: carPhotoUrl('sl-63', 1),
    small: carPhotoUrl('sl-63', 1, true),
    caption: { ru: 'Mercedes-AMG SL 63 у витрин вечером', en: 'Mercedes-AMG SL 63 by shop windows in the evening' },
    alt: {
      ru: 'Mercedes-AMG SL 63 у освещённых витрин вечером',
      en: 'A Mercedes-AMG SL 63 by lit shop windows in the evening',
    },
    focus: '50% 62%',
    tone: 'brightness(0.86) saturate(0.88)',
    credit: fleetCredit('sl-63', 0),
  },
]

// --- Видео -------------------------------------------------------------------------------
// Атмосферный ролик (Pexels, 10 секунд) — не фильм о компании, и в окне
// плеера он так и подписан. Файл грузится только после нажатия
// «Смотреть видео»: в разметке его нет, пока окно закрыто
export const FILM = {
  src: filmVideo,
  poster: filmPoster,
  credit: { author: 'Michael Pronin', url: 'https://www.pexels.com/video/29498800/', source: 'Pexels' as const },
}

// --- Показатели ---------------------------------------------------------------------------
// ДЕМО: значения из макета, на странице подписаны как демонстрационные.
// Настоящие цифры — заменить здесь. В каталоге сайта сейчас около 120
// машин, а не 300+: это расхождение — осознанное, по решению для концепта
export type StatIcon = 'gem' | 'car' | 'users' | 'shield'

export interface AboutStat {
  icon: StatIcon
  value: Localized<string>
  unit?: Localized<string>
  label: Localized<string>
}

export const STATS: AboutStat[] = [
  {
    icon: 'gem',
    value: { ru: '5+', en: '5+' },
    unit: { ru: 'лет', en: 'years' },
    label: { ru: 'на рынке премиум-аренды', en: 'in premium car rental' },
  },
  {
    icon: 'car',
    value: { ru: '300+', en: '300+' },
    label: { ru: 'автомобилей в автопарке', en: 'cars in the fleet' },
  },
  {
    icon: 'users',
    // Неразрывный пробел: «12 000+» не разрывается на две строки
    value: { ru: '12\u00a0000+', en: '12,000+' },
    label: { ru: 'довольных клиентов', en: 'happy clients' },
  },
  {
    icon: 'shield',
    value: { ru: '100%', en: '100%' },
    label: { ru: 'конфиденциальность и безопасность', en: 'privacy and security' },
  },
]

// --- Тексты страницы ------------------------------------------------------------------------
export interface TimelineStage {
  year: string
  title: string
  text: string
}

export interface AboutIdea {
  title: string
  text: string
}

// Ключи иконок принципов и преимуществ — сами иконки подставляет
// pages/About/AboutPage.tsx: данные не зависят от библиотеки иконок
export type PointIcon =
  | 'quality'
  | 'transparency'
  | 'comfort'
  | 'responsibility'
  | 'choice'
  | 'booking'
  | 'trip'
  | 'services'
  | 'terms'

export interface AboutPoint {
  icon: PointIcon
  title: string
  text: string
}

export interface AboutLink {
  label: string
  href: string
}

export interface AboutStep {
  title: string
  text: string
  link: AboutLink
}

export interface AboutFaq {
  id: string
  question: string
  answer: string
}

export const ABOUT_PAGE = localized(
  {
    title: 'О компании',
    home: 'Главная',
    // --- Первый экран
    eyebrow: 'О нас',
    heading: ['DriveLux — больше,', 'чем просто аренда автомобилей'],
    lead: 'Мы создаём премиальный опыт передвижения, где каждая деталь продумана для вашего комфорта, свободы и уверенности на дороге.',
    more: 'Узнать больше',
    // --- Показатели
    statsTitle: 'DriveLux в цифрах',
    statsNote: 'Демонстрационные значения: сайт — концепт для портфолио, цифры не отражают реальную компанию.',
    // --- История
    storyEyebrow: 'Путь к совершенству',
    storyTitle: 'Наша история',
    story: [
      'DriveLux — это не просто сервис аренды автомобилей. Это современный подход к премиальному передвижению, вдохновлённый любовью к машинам и стремлением сделать каждую поездку особенной.',
      'Всё началось с простой идеи: аренда хорошего автомобиля должна быть такой же продуманной, как сама машина. Понятный выбор, честные условия и внимание к мелочам — от первого клика до момента, когда ключи оказываются у вас в руках.',
    ],
    storyMore: [
      'Мы собираем автопарк не по принципу «чем больше, тем лучше», а так, чтобы под каждую поездку нашлась своя машина: деловая встреча, выходные за городом, свадьба или просто вечер, когда хочется почувствовать дорогу.',
      'Поэтому на сайте у каждого автомобиля — подробные характеристики, условия и цена за сутки, а дополнительные услуги описаны отдельно: доставка, водитель, долгосрочная аренда. Решение остаётся за вами — мы лишь делаем его простым.',
    ],
    readMore: 'Читать подробнее',
    readLess: 'Свернуть',
    video: 'Смотреть видео',
    timelineTitle: 'Концептуальная история бренда',
    timelineNote: 'Этапы и годы — часть концепта, а не реальная хронология.',
    timeline: [
      { year: '2019', title: 'Зарождение идеи', text: 'Мысль о прокате, где машина и сервис одного уровня.' },
      {
        year: '2021',
        title: 'Концепция автопарка',
        text: 'От бизнес-седанов до суперкаров — машина под любой сценарий поездки.',
      },
      {
        year: '2024',
        title: 'Новый уровень сервиса',
        text: 'Доставка, водитель и индивидуальные решения как часть аренды.',
      },
      {
        year: 'Сегодня',
        title: 'Цифровой сервис',
        text: 'Подбор, сравнение и заявка онлайн — без звонков и ожидания.',
      },
    ] satisfies TimelineStage[],
    // --- Философия
    philosophyEyebrow: 'Наша философия',
    philosophyTitle: ['Автомобиль — это не только', 'дорога из точки А в точку Б'],
    philosophyLead:
      'Это свобода, комфорт и впечатления. Возможность выбрать, как будет выглядеть ваше путешествие, — и не подстраиваться под то, что осталось на стоянке.',
    ideas: [
      {
        title: 'Свобода выбора',
        text: 'Спорткар на выходные, внедорожник для загородного дома или седан для встреч — вы выбираете машину под настроение и маршрут.',
      },
      {
        title: 'Внимание к деталям',
        text: 'Чистый салон, понятные условия и аккуратная подача — из таких мелочей складывается впечатление о поездке.',
      },
      {
        title: 'Комфорт в каждой поездке',
        text: 'Путь от выбора машины до её получения должен быть таким же спокойным, как сама дорога.',
      },
      {
        title: 'Индивидуальный подход',
        text: 'Время, место и сценарий получения — под ваш план, а не под расписание проката.',
      },
    ] satisfies AboutIdea[],
    // --- Принципы
    principlesEyebrow: 'На чём мы строим сервис',
    principlesTitle: 'Наши принципы',
    principlesLead:
      'Четыре принципа, по которым задумана каждая страница и каждый шаг аренды в концепции DriveLux.',
    principles: [
      {
        icon: 'quality',
        title: 'Качество',
        text: 'Внимание к состоянию автомобилей и к деталям обслуживания — от салона до подачи.',
      },
      {
        icon: 'transparency',
        title: 'Прозрачность',
        text: 'Стоимость и условия аренды видны заранее, на странице каждой машины, — без мелкого шрифта.',
      },
      {
        icon: 'comfort',
        title: 'Комфорт',
        text: 'Удобный путь от выбора автомобиля до его получения: меньше шагов, больше спокойствия.',
      },
      {
        icon: 'responsibility',
        title: 'Ответственность',
        text: 'Внимательное отношение к клиентам и их времени: договорились — значит, так и будет.',
      },
    ] satisfies AboutPoint[],
    // --- Почему DriveLux
    whyEyebrow: 'Для вас',
    whyTitle: 'Почему DriveLux',
    whyLead: 'Что сервис даёт на практике — от первого просмотра каталога до поездки.',
    whyBadge: 'Ключи — в нужное время и в нужном месте',
    why: [
      {
        icon: 'choice',
        title: 'Разнообразный выбор',
        text: 'Спорткары, бизнес-седаны, внедорожники и кабриолеты в одном каталоге с фильтрами по классу, марке и цене.',
      },
      {
        icon: 'booking',
        title: 'Удобное оформление',
        text: 'Даты, место и время — в одной форме. На сайте это демонстрационная заявка, без оплаты и отправки данных.',
      },
      {
        icon: 'trip',
        title: 'Машина под поездку',
        text: 'Подборки по настроению и классам помогают выбрать автомобиль под конкретный сценарий, а не наугад.',
      },
      {
        icon: 'services',
        title: 'Дополнительные услуги',
        text: 'Доставка, водитель, оборудование и долгосрочная аренда — в концепции проекта, с отдельной страницей на каждую.',
      },
      {
        icon: 'terms',
        title: 'Условия без сюрпризов',
        text: 'Характеристики, цена за сутки и условия аренды собраны на странице машины — их можно сравнить до заявки.',
      },
    ] satisfies AboutPoint[],
    whyLink: { label: 'Перейти в автопарк', href: ROUTES.fleet } satisfies AboutLink,
    // --- Галерея
    galleryEyebrow: 'Атмосфера бренда',
    galleryTitle: 'DriveLux в деталях',
    galleryLead: 'Фактура кожи, свет фар, ночной город — то, ради чего хочется сесть за руль.',
    galleryOpen: (caption: string) => `Открыть фото: ${caption}`,
    // --- Подход к сервису
    approachEyebrow: 'Путь клиента',
    approachTitle: 'Наш подход к сервису',
    approachLead: 'Четыре шага — от выбора машины до момента, когда она ждёт вас там, где удобно.',
    steps: [
      {
        title: 'Выбор автомобиля',
        text: 'Каталог с фильтрами, сравнение характеристик и цен.',
        link: { label: 'Автопарк', href: ROUTES.fleet },
      },
      {
        title: 'Ознакомление с условиями',
        text: 'Залог, документы, пробег и отмена — заранее и по пунктам.',
        link: { label: 'Частые вопросы', href: '/#faq' },
      },
      {
        title: 'Демонстрационная заявка',
        text: 'Даты, место и опции в одной форме. Данные никуда не отправляются.',
        link: { label: 'Бронирование', href: ROUTES.booking },
      },
      {
        title: 'Получение автомобиля',
        text: 'В офисе, с доставкой или с водителем — по выбранному сценарию.',
        link: { label: 'Услуги', href: ROUTES.services },
      },
    ] satisfies AboutStep[],
    // --- Вопросы
    faqEyebrow: 'Вопросы и ответы',
    faqTitle: 'Часто задаваемые вопросы',
    faqLead: 'Коротко о том, как устроен DriveLux. Вопросы о залоге, документах и оплате — в разделе «Частые вопросы» на главной.',
    faqLink: { label: 'Все частые вопросы', href: '/#faq' } satisfies AboutLink,
    faq: [
      {
        id: 'difference',
        question: 'Чем DriveLux отличается от обычного проката?',
        answer:
          'В концепции DriveLux аренда — это сервис, а не выдача ключей: продуманный каталог премиальных машин, понятные условия на странице каждого автомобиля и дополнительные услуги вроде доставки или водителя, которые можно выбрать под свой сценарий.',
      },
      {
        id: 'choose',
        question: 'Как выбрать подходящий автомобиль?',
        answer:
          'Начните с задачи поездки: деловая встреча, путешествие за город, праздник или просто удовольствие от вождения. В автопарке можно отфильтровать машины по классу, марке, цене и характеристикам, а подборки «Автомобиль под настроение» на главной подскажут направление.',
      },
      {
        id: 'terms',
        question: 'Какие условия аренды стоит изучить перед оформлением?',
        answer:
          'Обычно это залог, требования к водителю и документам, лимит пробега, правила отмены и что входит в стоимость. На этом сайте условия описаны на странице каждой машины и в «Частых вопросах» на главной — сверьтесь с ними до заявки.',
      },
      {
        id: 'services',
        question: 'Какие дополнительные услуги могут быть доступны?',
        answer:
          'В концепции проекта это доставка машины по адресу или в аэропорт, аренда с водителем, дополнительное оборудование, долгосрочная и корпоративная аренда. У каждой услуги на сайте своя страница с описанием и демонстрационной формой заказа.',
      },
      {
        id: 'contact',
        question: 'Как связаться с представителями компании?',
        answer:
          'Телефон, почта и мессенджеры указаны в подвале любой страницы, в разделе «Контакты». Сайт — концепт для портфолио, поэтому контакты демонстрационные: звонок или письмо по ним никуда не дойдут.',
      },
    ] satisfies AboutFaq[],
    // --- Финальный блок
    ctaEyebrow: 'DriveLux',
    ctaTitle: ['Ваша следующая поездка', 'начинается здесь'],
    ctaText: 'Выберите автомобиль под свой маршрут и настроение — или посмотрите услуги, которые сделают поездку ещё удобнее.',
    ctaPrimary: { label: 'Выбрать автомобиль', href: ROUTES.fleet } satisfies AboutLink,
    ctaSecondary: { label: 'Посмотреть услуги', href: ROUTES.services } satisfies AboutLink,
    // --- Окна и подписи
    close: 'Закрыть',
    prev: 'Предыдущее фото',
    next: 'Следующее фото',
    photoOf: (index: number, count: number) => `Фото ${index} из ${count}`,
    filmTitle: 'Атмосферное видео',
    filmNote: 'Стоковый ролик для настроения — не фильм о компании.',
    filmFallback: 'Браузер не может воспроизвести это видео.',
    credits: 'Фото и видео:',
  },
  {
    title: 'About',
    home: 'Home',
    eyebrow: 'About us',
    heading: ['DriveLux — more', 'than just a car rental'],
    lead: 'We create a premium way to get around, where every detail is designed for your comfort, freedom and confidence on the road.',
    more: 'Learn more',
    statsTitle: 'DriveLux in numbers',
    statsNote: 'Demo values: this is a portfolio concept site, the numbers do not describe a real company.',
    storyEyebrow: 'The road to excellence',
    storyTitle: 'Our story',
    story: [
      'DriveLux is more than a car rental service. It is a modern take on premium travel, inspired by a love of cars and the wish to make every trip feel special.',
      'It all started with a simple idea: renting a great car should be as well thought-out as the car itself. A clear choice, fair terms and attention to detail — from the first click to the moment the keys are in your hand.',
    ],
    storyMore: [
      'We do not build the fleet on the “the more, the better” principle. Instead, every trip should have its own car: a business meeting, a weekend out of town, a wedding or simply an evening when you want to feel the road.',
      'That is why every car on the site has detailed specs, terms and a daily price, and extra services are described separately: delivery, a chauffeur, long-term rental. The choice is yours — we just make it easy.',
    ],
    readMore: 'Read more',
    readLess: 'Show less',
    video: 'Watch video',
    timelineTitle: 'A conceptual brand story',
    timelineNote: 'The stages and years are part of the concept, not a real timeline.',
    timeline: [
      { year: '2019', title: 'The idea', text: 'A rental where the car and the service are on the same level.' },
      { year: '2021', title: 'The fleet concept', text: 'From business saloons to supercars — a car for every kind of trip.' },
      {
        year: '2024',
        title: 'A new level of service',
        text: 'Delivery, a chauffeur and tailored options as part of the rental.',
      },
      { year: 'Today', title: 'A digital service', text: 'Choose, compare and request online — no calls, no waiting.' },
    ],
    philosophyEyebrow: 'Our philosophy',
    philosophyTitle: ['A car is more than', 'a way from A to B'],
    philosophyLead:
      'It is freedom, comfort and experiences. The chance to decide what your journey looks like — instead of settling for whatever is left in the car park.',
    ideas: [
      {
        title: 'Freedom of choice',
        text: 'A sports car for the weekend, an SUV for the country house or a saloon for meetings — pick the car that fits your mood and route.',
      },
      {
        title: 'Attention to detail',
        text: 'A spotless cabin, clear terms and a careful hand-over — small things like these shape how a trip feels.',
      },
      {
        title: 'Comfort on every trip',
        text: 'The way from choosing a car to getting it should be as calm as the drive itself.',
      },
      {
        title: 'A personal approach',
        text: 'Time, place and hand-over scenario follow your plan, not the rental desk’s schedule.',
      },
    ],
    principlesEyebrow: 'What the service is built on',
    principlesTitle: 'Our principles',
    principlesLead: 'Four principles behind every page and every rental step in the DriveLux concept.',
    principles: [
      {
        icon: 'quality',
        title: 'Quality',
        text: 'Care for the condition of every car and for the details of service — from the cabin to the hand-over.',
      },
      {
        icon: 'transparency',
        title: 'Transparency',
        text: 'Prices and rental terms are visible up front on every car’s page — no small print.',
      },
      {
        icon: 'comfort',
        title: 'Comfort',
        text: 'An easy way from choosing a car to getting it: fewer steps, more peace of mind.',
      },
      {
        icon: 'responsibility',
        title: 'Responsibility',
        text: 'Respect for our clients and their time: once something is agreed, that is how it will be.',
      },
    ],
    whyEyebrow: 'For you',
    whyTitle: 'Why DriveLux',
    whyLead: 'What the service gives you in practice — from browsing the catalogue to the drive itself.',
    whyBadge: 'The keys — at the right time and place',
    why: [
      {
        icon: 'choice',
        title: 'A wide choice',
        text: 'Sports cars, business saloons, SUVs and convertibles in one catalogue with filters by class, brand and price.',
      },
      {
        icon: 'booking',
        title: 'Easy booking',
        text: 'Dates, place and time in a single form. On this site it is a demo request — no payment, no data sent.',
      },
      {
        icon: 'trip',
        title: 'A car for the trip',
        text: 'Mood and class collections help you choose a car for a specific scenario instead of guessing.',
      },
      {
        icon: 'services',
        title: 'Extra services',
        text: 'Delivery, a chauffeur, equipment and long-term rental — part of the project concept, each with its own page.',
      },
      {
        icon: 'terms',
        title: 'No surprises',
        text: 'Specs, the daily price and rental terms are gathered on each car’s page, so you can compare before you request.',
      },
    ],
    whyLink: { label: 'Go to the fleet', href: ROUTES.fleet },
    galleryEyebrow: 'The brand’s atmosphere',
    galleryTitle: 'DriveLux in detail',
    galleryLead: 'Leather texture, the glow of headlights, the city at night — the things that make you want to drive.',
    galleryOpen: (caption: string) => `Open photo: ${caption}`,
    approachEyebrow: 'The client journey',
    approachTitle: 'Our approach to service',
    approachLead: 'Four steps — from choosing a car to the moment it is waiting for you wherever suits you.',
    steps: [
      {
        title: 'Choose a car',
        text: 'A catalogue with filters, specs and prices side by side.',
        link: { label: 'Fleet', href: ROUTES.fleet },
      },
      {
        title: 'Read the terms',
        text: 'Deposit, documents, mileage and cancellation — up front, point by point.',
        link: { label: 'FAQ', href: '/#faq' },
      },
      {
        title: 'Demo request',
        text: 'Dates, place and extras in one form. Nothing is sent anywhere.',
        link: { label: 'Booking', href: ROUTES.booking },
      },
      {
        title: 'Get the car',
        text: 'At the office, delivered or with a chauffeur — as you choose.',
        link: { label: 'Services', href: ROUTES.services },
      },
    ],
    faqEyebrow: 'Questions and answers',
    faqTitle: 'Frequently asked questions',
    faqLead: 'A short guide to how DriveLux works. Questions about the deposit, documents and payment are in the FAQ on the home page.',
    faqLink: { label: 'All FAQ', href: '/#faq' },
    faq: [
      {
        id: 'difference',
        question: 'How is DriveLux different from a regular rental?',
        answer:
          'In the DriveLux concept, renting is a service rather than handing over keys: a curated catalogue of premium cars, clear terms on every car’s page and extra services such as delivery or a chauffeur that you can match to your plans.',
      },
      {
        id: 'choose',
        question: 'How do I choose the right car?',
        answer:
          'Start with the purpose of the trip: a business meeting, a getaway, a celebration or simply the joy of driving. In the fleet you can filter cars by class, brand, price and specs, and the “A car for your mood” collections on the home page point you in the right direction.',
      },
      {
        id: 'terms',
        question: 'Which rental terms should I check before booking?',
        answer:
          'Usually the deposit, driver and document requirements, the mileage limit, the cancellation rules and what the price includes. On this site the terms are described on each car’s page and in the FAQ on the home page — check them before sending a request.',
      },
      {
        id: 'services',
        question: 'Which extra services may be available?',
        answer:
          'In the project concept: delivery to an address or the airport, a chauffeur, extra equipment, long-term and corporate rental. Each service has its own page on the site with a description and a demo order form.',
      },
      {
        id: 'contact',
        question: 'How can I contact the company?',
        answer:
          'Phone, e-mail and messengers are listed in the footer of every page, under “Contacts”. This is a portfolio concept site, so the contacts are for demonstration: calls and e-mails to them will not reach anyone.',
      },
    ],
    ctaEyebrow: 'DriveLux',
    ctaTitle: ['Your next journey', 'starts here'],
    ctaText: 'Choose a car for your route and mood — or explore the services that make the trip even easier.',
    ctaPrimary: { label: 'Choose a car', href: ROUTES.fleet },
    ctaSecondary: { label: 'Explore services', href: ROUTES.services },
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    photoOf: (index: number, count: number) => `Photo ${index} of ${count}`,
    filmTitle: 'Atmosphere video',
    filmNote: 'A stock clip for the mood — not a film about the company.',
    filmFallback: 'Your browser cannot play this video.',
    credits: 'Photos and video:',
  },
)
