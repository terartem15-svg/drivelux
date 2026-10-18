import { localized } from '@/i18n/lang'
import type { PerkIcon } from './loyalty'

// Тексты страницы программы лояльности (/loyalty) — отдельным файлом от
// баннера главной: страница грузится своим файлом при первом переходе, и
// её тексты не утяжеляют главную. Уровни и скидки — общие, в content/loyalty.ts

// Привилегии по уровням для таблицы сравнения: true — есть, строка — есть
// с условием, false — нет. Порядок значений — Silver, Gold, Platinum
export type Cell = boolean | string

export const LOYALTY_PAGE = localized(
  {
    title: 'Программа лояльности',
    eyebrow: 'DriveLux Club',
    heroTitle: ['Каждая поездка', 'приближает к лучшим условиям'],
    heroLead:
      'Вступление бесплатное. Скидки и привилегии растут с каждой арендой и включаются сами — без карт, кодов и звонков менеджеру.',
    join: 'Вступить в клуб',
    joined: 'Вы в клубе',
    book: 'Забронировать',
    how: 'Как это работает',
    cardMember: 'Участник клуба',
    cardGuest: 'Ваше имя',
    cardSince: 'с 2026',
    demo: 'Демонстрационная программа: сайт — концепт для портфолио, скидки и условия приведены для примера.',
    stats: [
      { value: '15%', label: 'максимальная скидка' },
      { value: '3', label: 'поездки до первого уровня' },
      { value: '0 €', label: 'стоимость вступления' },
      { value: '24/7', label: 'личный менеджер на Platinum' },
    ],
    stepsEyebrow: 'Как это работает',
    stepsTitle: 'Три шага к привилегиям',
    steps: [
      {
        title: 'Зарегистрируйтесь',
        text: 'Создайте аккаунт за минуту — участие в клубе начинается сразу и ничего не стоит.',
      },
      {
        title: 'Катайтесь',
        text: 'Каждая завершённая аренда засчитывается автоматически — неважно, на один день или на месяц.',
      },
      {
        title: 'Получайте привилегии',
        text: 'С 3-й поездки включается скидка, дальше — подача вне очереди, апгрейды и личный менеджер.',
      },
    ],
    tiersEyebrow: 'Уровни',
    tiersTitle: 'Выберите, к чему идти',
    tierNames: { silver: 'Silver', gold: 'Gold', platinum: 'Platinum' },
    tierFrom: (trips: number) => `с ${trips}-й поездки`,
    tierOff: 'на каждую аренду',
    tierPopular: 'Чаще всего',
    tierPerks: {
      silver: ['Скидка 5% на любую машину', 'Бесплатная отмена за 24 часа', 'Закрытые предложения по почте'],
      gold: [
        'Скидка 10% на любую машину',
        'Подача вне очереди',
        'Апгрейд класса, если машина свободна',
        'Лимит пробега 300 км в сутки',
      ],
      platinum: [
        'Скидка 15% на любую машину',
        'Личный менеджер 24/7',
        'Залог ниже на 50%',
        'Лимит пробега 350 км в сутки',
        'Приглашения на закрытые тест-драйвы',
      ],
    },
    compareTitle: 'Сравнение уровней',
    compareFeature: 'Привилегия',
    compareRows: [
      { label: 'Скидка на аренду', cells: ['5%', '10%', '15%'] },
      { label: 'Бесплатная отмена', cells: ['за 24 ч', 'за 24 ч', 'за 12 ч'] },
      { label: 'Подача вне очереди', cells: [false, true, true] },
      { label: 'Апгрейд класса при наличии', cells: [false, true, true] },
      { label: 'Пробег в сутки', cells: ['250 км', '300 км', '350 км'] },
      { label: 'Залог', cells: ['полный', '−25%', '−50%'] },
      { label: 'Личный менеджер', cells: [false, false, true] },
      { label: 'Закрытые тест-драйвы', cells: [false, false, true] },
    ] as { label: string; cells: Cell[] }[],
    yes: 'есть',
    no: 'нет',
    calcEyebrow: 'Калькулятор',
    calcTitle: 'Сколько вы сэкономите',
    calcLead: 'Выберите машину, срок и уровень — посчитаем стоимость аренды со скидкой клуба.',
    calcCar: 'Автомобиль',
    calcDays: 'Срок аренды',
    calcTier: 'Уровень',
    calcBase: 'Без скидки',
    calcDiscount: 'Скидка клуба',
    calcTotal: 'Итого',
    calcSaving: (amount: string) => `Экономия — ${amount}`,
    days: { one: 'сутки', few: 'суток', many: 'суток' },
    perksEyebrow: 'Привилегии',
    perksTitle: 'Что даёт клуб',
    perks: [
      {
        icon: 'discount',
        title: 'Скидки до 15%',
        text: 'Скидка уровня применяется к каждой аренде автоматически и суммируется со скидкой за длительный срок.',
      },
      {
        icon: 'fast',
        title: 'Быстрое бронирование',
        text: 'Данные и документы уже в профиле — новая бронь занимает меньше минуты.',
      },
      {
        icon: 'manager',
        title: 'Персональный менеджер',
        text: 'На уровне Platinum — один человек на связи 24/7: знает ваши привычки и любимые машины.',
      },
      {
        icon: 'exclusive',
        title: 'Эксклюзивные предложения',
        text: 'Новые машины парка раньше всех, приглашения на тест-драйвы и закрытые акции.',
      },
    ] as { icon: PerkIcon; title: string; text: string }[],
    faqEyebrow: 'Вопросы',
    faqTitle: 'Частые вопросы о клубе',
    faq: [
      {
        id: 'cost',
        question: 'Сколько стоит участие?',
        answer:
          'Нисколько. Достаточно зарегистрироваться на сайте — уровень и скидки считаются по вашим завершённым арендам.',
      },
      {
        id: 'count',
        question: 'Какие поездки засчитываются?',
        answer: 'Любая завершённая аренда, независимо от срока и машины. Отменённые брони не учитываются.',
      },
      {
        id: 'combine',
        question: 'Суммируется ли скидка с другими акциями?',
        answer: 'Со скидкой за длительный срок — да. С разовыми промокодами — нет: применяется большая из двух скидок.',
      },
      {
        id: 'expire',
        question: 'Может ли уровень сгореть?',
        answer:
          'Уровень сохраняется 12 месяцев с последней поездки. Если за год не было ни одной аренды, он снижается на одну ступень.',
      },
      {
        id: 'corporate',
        question: 'Есть ли программа для компаний?',
        answer:
          'Для компаний — отдельные условия корпоративной аренды: скидка зависит от объёма заказов и обсуждается с менеджером.',
      },
    ],
    ctaTitle: 'Начните копить привилегии сегодня',
    ctaText: 'Регистрация занимает минуту, а первая скидка ждёт уже на третьей поездке.',
    ctaFleet: 'Выбрать автомобиль',
    photoCredit: 'Фото салона:',
  },
  {
    title: 'Loyalty programme',
    eyebrow: 'DriveLux Club',
    heroTitle: ['Every trip brings you', 'closer to better terms'],
    heroLead:
      'Joining is free. Discounts and privileges grow with every rental and switch on automatically — no cards, codes or calls to a manager.',
    join: 'Join the club',
    joined: 'You are a member',
    book: 'Book now',
    how: 'How it works',
    cardMember: 'Club member',
    cardGuest: 'Your name',
    cardSince: 'since 2026',
    demo: 'A demonstration programme: this is a portfolio concept site, discounts and terms are examples.',
    stats: [
      { value: '15%', label: 'maximum discount' },
      { value: '3', label: 'trips to the first tier' },
      { value: '€0', label: 'to join' },
      { value: '24/7', label: 'personal manager on Platinum' },
    ],
    stepsEyebrow: 'How it works',
    stepsTitle: 'Three steps to privileges',
    steps: [
      { title: 'Sign up', text: 'Create an account in a minute — membership starts right away and costs nothing.' },
      { title: 'Drive', text: 'Every completed rental counts automatically — whether it lasts a day or a month.' },
      {
        title: 'Enjoy the perks',
        text: 'From trip 3 your discount kicks in, then priority delivery, upgrades and a personal manager.',
      },
    ],
    tiersEyebrow: 'Tiers',
    tiersTitle: 'Choose what to aim for',
    tierNames: { silver: 'Silver', gold: 'Gold', platinum: 'Platinum' },
    tierFrom: (trips: number) => `from trip ${trips}`,
    tierOff: 'off every rental',
    tierPopular: 'Most common',
    tierPerks: {
      silver: ['5% off any car', 'Free cancellation up to 24 hours', 'Private offers by e-mail'],
      gold: ['10% off any car', 'Priority delivery', 'Class upgrade when available', '300 km per day'],
      platinum: [
        '15% off any car',
        'Personal manager 24/7',
        '50% lower deposit',
        '350 km per day',
        'Invitations to private test drives',
      ],
    },
    compareTitle: 'Tier comparison',
    compareFeature: 'Privilege',
    compareRows: [
      { label: 'Rental discount', cells: ['5%', '10%', '15%'] },
      { label: 'Free cancellation', cells: ['24 h before', '24 h before', '12 h before'] },
      { label: 'Priority delivery', cells: [false, true, true] },
      { label: 'Class upgrade when available', cells: [false, true, true] },
      { label: 'Mileage per day', cells: ['250 km', '300 km', '350 km'] },
      { label: 'Deposit', cells: ['full', '−25%', '−50%'] },
      { label: 'Personal manager', cells: [false, false, true] },
      { label: 'Private test drives', cells: [false, false, true] },
    ],
    yes: 'yes',
    no: 'no',
    calcEyebrow: 'Calculator',
    calcTitle: 'How much you will save',
    calcLead: 'Pick a car, a duration and a tier — we will calculate the rental with the club discount.',
    calcCar: 'Car',
    calcDays: 'Rental length',
    calcTier: 'Tier',
    calcBase: 'Without discount',
    calcDiscount: 'Club discount',
    calcTotal: 'Total',
    calcSaving: (amount: string) => `You save ${amount}`,
    days: { one: 'day', few: 'days', many: 'days' },
    perksEyebrow: 'Privileges',
    perksTitle: 'What the club gives you',
    perks: [
      {
        icon: 'discount',
        title: 'Up to 15% off',
        text: 'Your tier discount applies to every rental automatically and stacks with the long-term rate.',
      },
      {
        icon: 'fast',
        title: 'Fast booking',
        text: 'Your details and documents are already saved — a new booking takes less than a minute.',
      },
      {
        icon: 'manager',
        title: 'Personal manager',
        text: 'On Platinum — one person available 24/7 who knows your habits and favourite cars.',
      },
      {
        icon: 'exclusive',
        title: 'Exclusive offers',
        text: 'New cars before anyone else, test-drive invitations and private deals.',
      },
    ],
    faqEyebrow: 'Questions',
    faqTitle: 'Club FAQ',
    faq: [
      {
        id: 'cost',
        question: 'How much does membership cost?',
        answer:
          'Nothing. Just sign up on the website — your tier and discounts are calculated from your completed rentals.',
      },
      {
        id: 'count',
        question: 'Which trips count?',
        answer: 'Any completed rental, regardless of its length or the car. Cancelled bookings do not count.',
      },
      {
        id: 'combine',
        question: 'Does the discount stack with other offers?',
        answer:
          'With the long-term rate — yes. With one-off promo codes — no: the larger of the two discounts applies.',
      },
      {
        id: 'expire',
        question: 'Can my tier expire?',
        answer:
          'Your tier is kept for 12 months after your last trip. If there were no rentals for a year, it drops by one level.',
      },
      {
        id: 'corporate',
        question: 'Is there a programme for companies?',
        answer:
          'Companies get separate corporate rental terms: the discount depends on the volume of orders and is agreed with a manager.',
      },
    ],
    ctaTitle: 'Start collecting privileges today',
    ctaText: 'Signing up takes a minute, and your first discount is waiting on your third trip.',
    ctaFleet: 'Choose a car',
    photoCredit: 'Cabin photo:',
  },
)
