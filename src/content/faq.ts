import type { SocialId } from '@/components/icons/logoPaths'
import { localized, type Localized } from '@/i18n/lang'
import { CONTACTS } from './site'

// «Частые вопросы»: залог, возраст водителя, документы, оплата, отмена
// брони и возврат машины — то, что спрашивают перед каждым заказом. Плюс
// что входит в цену и поездки за пределы Москвы. Первый вопрос открыт
// сразу — видно, что ответы раскрываются
export interface FaqItem {
  id: string
  question: Localized<string>
  answer: Localized<string>
}

export const FAQ: FaqItem[] = [
  {
    id: 'deposit',
    question: { ru: 'Какой нужен залог?', en: 'What deposit is required?' },
    answer: {
      ru: 'Залог блокируется на карте при получении машины и разблокируется в течение 3 рабочих дней после возврата. Сумма зависит от класса: от 1 000 € за бизнес-седан до 5 000 € за спорткар.',
      en: 'The deposit is held on your card when you collect the car and released within 3 business days after the return. The amount depends on the class: from €1,000 for a business saloon to €5,000 for a sports car.',
    },
  },
  {
    id: 'age',
    question: { ru: 'Сколько лет должно быть водителю?', en: 'How old does the driver need to be?' },
    answer: {
      ru: 'От 23 лет и стаж от 3 лет. Для спорткаров и Rolls-Royce — от 25 лет и стаж от 5 лет. Второго водителя впишем в договор бесплатно.',
      en: '23 or older with at least 3 years of driving. For sports cars and Rolls-Royce — 25 or older with at least 5 years. A second driver is added to the contract free of charge.',
    },
  },
  {
    id: 'documents',
    question: { ru: 'Какие документы нужны?', en: 'Which documents do I need?' },
    answer: {
      ru: 'Паспорт и водительское удостоверение категории B. Гостям из других стран может понадобиться ещё международное удостоверение.',
      en: 'A passport and a category B driving licence. Guests from other countries may also need an international driving permit.',
    },
  },
  {
    id: 'included',
    question: { ru: 'Что входит в стоимость?', en: 'What is included in the price?' },
    answer: {
      ru: 'Страховка КАСКО и ОСАГО, 250 км пробега в сутки, подача по Москве и в аэропорты, круглосуточная поддержка. Детское кресло и второй водитель — бесплатно.',
      en: 'Full insurance cover, 250 km per day, delivery across Moscow and to the airports, and 24/7 support. A child seat and a second driver are free.',
    },
  },
  {
    id: 'payment',
    question: { ru: 'Как оплатить аренду?', en: 'How can I pay?' },
    answer: {
      ru: 'Картой Visa, Mastercard или «Мир» на сайте, через СБП, наличными или переводом в офисе. Компаниям выставляем счёт и готовим закрывающие документы.',
      en: 'By Visa, Mastercard or Mir card on the website, via SBP, in cash or by bank transfer at the office. Companies receive an invoice and all accounting documents.',
    },
  },
  {
    id: 'cancel',
    question: { ru: 'Можно ли отменить бронирование?', en: 'Can I cancel a booking?' },
    answer: {
      ru: 'Да, бесплатно — не позднее чем за 48 часов до подачи. При более поздней отмене удерживается стоимость одних суток аренды.',
      en: 'Yes, free of charge up to 48 hours before delivery. For later cancellations one day of rental is charged.',
    },
  },
  {
    id: 'return',
    question: { ru: 'Как вернуть автомобиль?', en: 'How do I return the car?' },
    answer: {
      ru: 'Там же, где получили, или в любой точке Москвы и в аэропортах — бесплатно. Бак — на том же уровне, что при получении; мыть машину не нужно. Задержка до часа — без доплаты.',
      en: 'Where you picked it up, or anywhere in Moscow and at the airports — free of charge. Return it with the same fuel level; no need to wash it. Up to an hour late costs nothing.',
    },
  },
  {
    id: 'abroad',
    question: { ru: 'Можно ли выехать за пределы Москвы?', en: 'Can I drive outside Moscow?' },
    answer: {
      ru: 'Да: по Московской области — свободно, в другие регионы России — по предварительному согласованию. Доверенность оформим за один день.',
      en: 'Yes: anywhere in the Moscow region freely, to other regions of Russia by prior arrangement. We prepare the power of attorney within a day.',
    },
  },
]

// Карточка «Не нашли ответ?» — мессенджеры и телефон из контактов сайта
export interface FaqChannel {
  label: string
  href: string
  icon: SocialId | 'phone'
}

// Карточка «В каждой аренде» под контактами: заполняет левую колонку до
// низа списка вопросов. Пункты — те же обещания, что в ответах справа
// (страховка, подача, возврат, отмена), только собранные в одном месте
export type GuaranteeIcon = 'insurance' | 'delivery' | 'return' | 'cancel'

export interface Guarantee {
  icon: GuaranteeIcon
  title: string
  text: string
}

const CHANNELS: FaqChannel[] = [
  { label: 'Telegram', href: CONTACTS.telegram, icon: 'telegram' },
  { label: 'WhatsApp', href: CONTACTS.whatsapp, icon: 'whatsapp' },
  { label: CONTACTS.phone.label, href: CONTACTS.phone.href, icon: 'phone' },
]

export const FAQ_SECTION = localized(
  {
    eyebrow: 'Частые вопросы',
    title: 'Всё, что стоит знать до поездки',
    lead: 'Собрали ответы на вопросы, которые нам задают чаще всего перед арендой.',
    contactTitle: 'Не нашли ответ?',
    contactText: 'Напишите нам — ответим за 5 минут в любое время суток.',
    guaranteesTitle: 'В каждой аренде',
    guarantees: [
      { icon: 'insurance', title: 'Страховка включена', text: 'КАСКО и ОСАГО без доплат' },
      { icon: 'delivery', title: 'Подача к двери', text: 'По Москве и в аэропорты' },
      { icon: 'return', title: 'Возврат без мойки', text: 'Задержка до часа — бесплатно' },
      { icon: 'cancel', title: 'Бесплатная отмена', text: 'За 48 часов до подачи' },
    ] as Guarantee[],
    channels: CHANNELS,
  },
  {
    eyebrow: 'FAQ',
    title: 'Everything to know before the trip',
    lead: 'The answers to the questions we hear most often before a rental.',
    contactTitle: 'Still have a question?',
    contactText: 'Message us — we reply within 5 minutes, day or night.',
    guaranteesTitle: 'In every rental',
    guarantees: [
      { icon: 'insurance', title: 'Insurance included', text: 'Full cover at no extra cost' },
      { icon: 'delivery', title: 'Door-to-door delivery', text: 'Across Moscow and to the airports' },
      { icon: 'return', title: 'No-wash return', text: 'Up to an hour late — free' },
      { icon: 'cancel', title: 'Free cancellation', text: 'Up to 48 hours before' },
    ],
    channels: CHANNELS,
  },
)
