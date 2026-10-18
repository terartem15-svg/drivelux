import { localized, type Localized } from '@/i18n/lang'
import { HEADER_ACTIONS } from './site'

// «Как это работает»: три шага аренды. На эту секцию ведёт кнопка
// «Как это работает» первого экрана. Кнопки — к бронированию и к условиям
// аренды (они собраны в «Частых вопросах»)
export type StepId = 'choose' | 'confirm' | 'keys'

export interface Step {
  id: StepId
  title: Localized<string>
  text: Localized<string>
}

export const STEPS: Step[] = [
  {
    id: 'choose',
    title: { ru: 'Выберите автомобиль', en: 'Choose a car' },
    text: {
      ru: 'В каталоге — по классу, бюджету и поводу. Сомневаетесь — менеджер подберёт машину за пару минут.',
      en: 'In the catalogue — by class, budget and occasion. Not sure? A manager will find you a car in a couple of minutes.',
    },
  },
  {
    id: 'confirm',
    title: { ru: 'Подтвердите бронирование', en: 'Confirm the booking' },
    text: {
      ru: 'Договор и оплата — онлайн за 5 минут, без визита в офис. Залог блокируется на карте и возвращается после поездки.',
      en: 'Contract and payment online in 5 minutes, no office visit. The deposit is held on your card and released after the trip.',
    },
  },
  {
    id: 'keys',
    title: { ru: 'Получите ключи', en: 'Get the keys' },
    text: {
      ru: 'Подадим машину к дому, отелю или в аэропорт Москвы — чистую, с полным баком и точно ко времени.',
      en: 'We deliver the car to your home, hotel or a Moscow airport — clean, with a full tank and right on time.',
    },
  },
]

// Что понадобится для аренды — коротко, подробности в «Частых вопросах»
export type RequirementIcon = 'passport' | 'license' | 'age'

export const REQUIREMENTS: { icon: RequirementIcon; label: Localized<string> }[] = [
  { icon: 'passport', label: { ru: 'Паспорт или ID-карта', en: 'Passport or ID card' } },
  { icon: 'license', label: { ru: 'Права со стажем от 3 лет', en: 'Licence held for 3+ years' } },
  { icon: 'age', label: { ru: 'Возраст от 23 лет', en: 'Aged 23 or over' } },
]

export const HOW_IT_WORKS = localized(
  {
    eyebrow: 'Как это работает',
    title: 'Три шага до ключей',
    lead: 'Всё оформляется онлайн — без очередей и бумаг. Машину подадим туда, где вам удобно, в любое время суток.',
    requirementsTitle: 'Понадобится',
    primary: { label: HEADER_ACTIONS.book.label.ru, href: HEADER_ACTIONS.book.href },
    secondary: { label: 'Условия аренды', href: '/#faq' },
    // Фрагменты интерфейса в иллюстрациях шагов
    confirmed: 'Бронь подтверждена',
    signed: 'Договор подписан онлайн',
    arrived: 'Машина на месте',
    keys: 'Ключи у водителя',
  },
  {
    eyebrow: 'How it works',
    title: 'Three steps to the keys',
    lead: 'Everything is done online — no queues, no paperwork. We bring the car wherever suits you, at any time of day.',
    requirementsTitle: 'You will need',
    primary: { label: HEADER_ACTIONS.book.label.en, href: HEADER_ACTIONS.book.href },
    secondary: { label: 'Rental terms', href: '/#faq' },
    confirmed: 'Booking confirmed',
    signed: 'Contract signed online',
    arrived: 'Car has arrived',
    keys: 'Keys with the driver',
  },
)
