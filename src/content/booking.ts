import { localized, type Localized } from '@/i18n/lang'

// Опции страницы бронирования (pages/Booking): пакеты защиты, дополнительные
// услуги, способы оплаты и скидки за срок. Сайт — концепт: цены
// демонстрационные и согласованы с остальным сайтом — детское кресло и
// второй водитель бесплатны, Wi-Fi от 10 € в сутки, водитель от 80 €.
//
// perDay — цена за сутки, once — разово за всю аренду. max — сколько штук
// можно взять (детских кресел — до двух)

// --- Скидки за срок -------------------------------------------------------------------
// С 3 суток — 5%, с 7 — 10% (недельный тариф из услуги «Долгосрочная аренда»)
export const LONG_TERM = [
  { days: 7, discount: 0.1 },
  { days: 3, discount: 0.05 },
]

// Демо-промокод: −10% на аренду. Подсказка с кодом показана прямо в форме
export const PROMO = { code: 'DRIVELUX10', discount: 0.1 }

// --- Защита -----------------------------------------------------------------------------
export type ProtectionId = 'basic' | 'plus' | 'premium'

export interface Protection {
  id: ProtectionId
  perDay: number
  depositShare: number // доля залога: 1 — полный
  title: Localized<string>
  points: Localized<string[]>
}

export const PROTECTIONS: Protection[] = [
  {
    id: 'basic',
    perDay: 0,
    depositShare: 1,
    title: { ru: 'Базовая', en: 'Basic' },
    points: {
      ru: ['КАСКО и ОСАГО', 'Франшиза до 1 500 €', 'Помощь на дороге 24/7'],
      en: ['Full insurance cover', 'Excess up to €1,500', '24/7 roadside assistance'],
    },
  },
  {
    id: 'plus',
    perDay: 15,
    depositShare: 0.75,
    title: { ru: 'Расширенная', en: 'Extended' },
    points: {
      ru: ['Франшиза до 300 €', 'Стёкла, фары и шины', 'Залог ниже на 25%'],
      en: ['Excess up to €300', 'Glass, lights and tyres', '25% lower deposit'],
    },
  },
  {
    id: 'premium',
    perDay: 30,
    depositShare: 0.5,
    title: { ru: 'Премиум', en: 'Premium' },
    points: {
      ru: ['Без франшизы', 'Стёкла, шины, диски и салон', 'Залог ниже на 50%', 'Подменная машина за 2 часа'],
      en: ['Zero excess', 'Glass, tyres, wheels and interior', '50% lower deposit', 'Replacement car within 2 hours'],
    },
  },
]

// --- Дополнительные опции -----------------------------------------------------------------
export type ExtraId =
  'child-seat' | 'second-driver' | 'chauffeur' | 'unlimited' | 'wifi' | 'meet' | 'fuel' | 'decor' | 'photo'

export type ExtraIcon = 'baby' | 'users' | 'chauffeur' | 'infinity' | 'wifi' | 'sign' | 'fuel' | 'flower' | 'camera'

export interface Extra {
  id: ExtraId
  icon: ExtraIcon
  perDay?: number
  once?: number
  max?: number
  title: Localized<string>
  text: Localized<string>
}

export const EXTRAS_OPTIONS: Extra[] = [
  {
    id: 'child-seat',
    icon: 'baby',
    perDay: 0,
    max: 2,
    title: { ru: 'Детское кресло', en: 'Child seat' },
    text: {
      ru: 'По возрасту и весу ребёнка, установим заранее',
      en: 'Matched to your child’s age and weight, fitted in advance',
    },
  },
  {
    id: 'second-driver',
    icon: 'users',
    perDay: 0,
    title: { ru: 'Второй водитель', en: 'Second driver' },
    text: { ru: 'Впишем в договор бесплатно', en: 'Added to the contract for free' },
  },
  {
    id: 'chauffeur',
    icon: 'chauffeur',
    perDay: 150,
    title: { ru: 'Личный водитель', en: 'Personal chauffeur' },
    text: { ru: 'Водитель в костюме на весь срок аренды', en: 'A suited chauffeur for the whole rental' },
  },
  {
    id: 'unlimited',
    icon: 'infinity',
    perDay: 40,
    title: { ru: 'Безлимитный пробег', en: 'Unlimited mileage' },
    text: { ru: 'Вместо 250 км в сутки — без ограничений', en: 'No limit instead of 250 km per day' },
  },
  {
    id: 'wifi',
    icon: 'wifi',
    perDay: 10,
    title: { ru: 'Мобильный Wi-Fi', en: 'Mobile Wi-Fi' },
    text: { ru: 'Безлимитный интернет в машине', en: 'Unlimited internet in the car' },
  },
  {
    id: 'meet',
    icon: 'sign',
    perDay: 0,
    title: { ru: 'Встреча с табличкой', en: 'Meet & greet with a sign' },
    text: { ru: 'В аэропорту или на вокзале, помощь с багажом', en: 'At the airport or station, help with luggage' },
  },
  {
    id: 'fuel',
    icon: 'fuel',
    once: 60,
    title: { ru: 'Полный бак при возврате', en: 'Prepaid full tank' },
    text: { ru: 'Верните машину с любым уровнем топлива', en: 'Return the car with any fuel level' },
  },
  {
    id: 'decor',
    icon: 'flower',
    once: 80,
    title: { ru: 'Свадебное украшение', en: 'Wedding decoration' },
    text: { ru: 'Живые цветы и ленты от флориста', en: 'Fresh flowers and ribbons by a florist' },
  },
  {
    id: 'photo',
    icon: 'camera',
    once: 150,
    title: { ru: 'Фотосессия с машиной', en: 'Photo shoot with the car' },
    text: { ru: 'Час съёмки с фотографом в Москва-Сити', en: 'An hour with a photographer in Moscow City' },
  },
]

// --- Оплата ------------------------------------------------------------------------------
export type PaymentId = 'card' | 'pickup' | 'invoice'

export const PAYMENTS: { id: PaymentId; title: Localized<string>; text: Localized<string> }[] = [
  {
    id: 'card',
    title: { ru: 'Картой онлайн', en: 'Card online' },
    text: { ru: 'Visa, Mastercard, «Мир», Apple Pay', en: 'Visa, Mastercard, Mir, Apple Pay' },
  },
  {
    id: 'pickup',
    title: { ru: 'При получении', en: 'On pick-up' },
    text: { ru: 'Картой или наличными при передаче машины', en: 'By card or cash when you collect the car' },
  },
  {
    id: 'invoice',
    title: { ru: 'Счёт для компании', en: 'Company invoice' },
    text: { ru: 'С закрывающими документами', en: 'With all accounting documents' },
  },
]

// --- Тексты страницы ------------------------------------------------------------------------
export const BOOKING_PAGE = localized(
  {
    title: 'Бронирование',
    home: 'Главная',
    fleet: 'Автопарк',
    lead: 'Шесть коротких шагов — и машина ждёт вас в нужное время в нужном месте. Стоимость пересчитывается сразу. Это демо-версия: заявка не отправляется.',
    trust: [
      'Бесплатная отмена за 48 часов',
      'Страховка в каждой аренде',
      'Подача 24/7 по Москве',
      'Без скрытых платежей',
    ],
    steps: {
      car: 'Автомобиль',
      when: 'Когда и где',
      protection: 'Защита',
      extras: 'Дополнительные опции',
      contacts: 'Контакты',
      payment: 'Оплата и подтверждение',
    },
    stepOf: (step: number, total: number) => `Шаг ${step} из ${total}`,
    change: 'Сменить',
    collapse: 'Свернуть',
    allClasses: 'Все',
    noCar: 'Выберите машину — без неё заявку не собрать.',
    pickupPlace: 'Где получить',
    returnPlace: 'Где вернуть',
    address: 'Адрес подачи',
    addressPlaceholder: 'Улица, дом, подъезд или название отеля',
    pickup: 'Получение',
    dropoff: 'Возврат',
    editPickup: 'Изменить дату получения',
    editDropoff: 'Изменить дату возврата',
    time: 'Время',
    calendar: 'Даты аренды',
    longTermHint: (days: string, percent: number) => `Ещё ${days} — и скидка будет ${percent}%`,
    longTermOn: (percent: number) => `Скидка за срок ${percent}% уже учтена`,
    longTermBoth: (percent: number, next: string) => `Скидка за срок ${percent}% уже учтена. ${next}`,
    perDay: '/ сутки',
    once: 'разово',
    free: 'бесплатно',
    included: 'Включено',
    recommended: 'Рекомендуем',
    quantity: 'Количество',
    less: 'Меньше',
    more: 'Больше',
    name: 'Имя и фамилия',
    phone: 'Телефон',
    email: 'E-mail',
    flight: 'Номер рейса или поезда',
    flightPlaceholder: 'Например, SU 1234',
    comment: 'Пожелания',
    commentPlaceholder: 'Цвет салона, детали встречи, что угодно',
    optional: ' — необязательно',
    signedIn: (name: string) => `Данные взяты из аккаунта ${name}`,
    signInHint: 'Есть аккаунт?',
    signIn: 'Войдите',
    signInRest: '— контакты заполнятся сами.',
    promo: 'Промокод',
    promoPlaceholder: 'Введите код',
    promoApply: 'Применить',
    promoRemove: 'Убрать',
    promoHint: (code: string) => `Демо-код: ${code}`,
    promoOk: (code: string) => `Промокод ${code} применён: −10% на аренду`,
    promoBad: 'Такого промокода нет',
    paymentTitle: 'Способ оплаты',
    terms: 'Согласен с условиями аренды и обработкой данных',
    submit: 'Отправить заявку',
    submitNote: 'Демо: данные никуда не отправляются',
    summary: 'Ваша бронь',
    summaryEmpty: 'Машина не выбрана. Выберите её в первом шаге или в автопарке.',
    openFleet: 'Открыть автопарк',
    rows: {
      rent: (days: string, price: string) => `Аренда: ${days} × ${price}`,
      longTerm: 'Скидка за срок',
      promo: 'Промокод',
      protection: 'Защита',
      extras: 'Опции',
      delivery: 'Подача и возврат',
      total: 'Итого',
      deposit: 'Залог',
      depositNote: 'блокируется на карте и возвращается',
    },
    freeCancel: (date: string) => `Бесплатная отмена до ${date}`,
    help: 'Нужна помощь с выбором?',
    helpText: 'Позвоните — подберём машину и опции за пару минут.',
    days: { one: 'сутки', few: 'суток', many: 'суток' },
    errors: {
      car: 'Выберите машину',
      address: 'Укажите адрес подачи',
      name: 'Укажите имя',
      phone: 'Укажите телефон — от 10 цифр',
      email: 'Похоже, в e-mail ошибка',
      terms: 'Нужно согласие с условиями',
    },
    errorSummary: 'Проверьте поля с ошибкой — подсказки под ними.',
    includedTitle: 'В каждой аренде',
    includedLead: 'То, за что не нужно доплачивать',
    reviewsTitle: (name: string) => `Отзывы о ${name}`,
    reviewsClassTitle: 'Отзывы клиентов',
    allReviews: 'Все отзывы',
    faqTitle: 'Вопросы о бронировании',
    demoTitle: 'Это демонстрационный сайт',
    demoText:
      'DriveLux — концепт для портфолио: бронирование здесь не работает, данные формы никуда не ушли и нигде не сохранились. Так выглядела бы ваша заявка:',
    notSentTitle: 'Заявка не отправлена',
    edit: 'Изменить заявку',
    backToFleet: 'Вернуться в автопарк',
    recap: {
      car: 'Автомобиль',
      pickup: 'Получение',
      dropoff: 'Возврат',
      term: 'Срок',
      protection: 'Защита',
      extras: 'Опции',
      payment: 'Оплата',
      contact: 'Контакты',
      total: 'Итого',
      none: 'нет',
    },
  },
  {
    title: 'Booking',
    home: 'Home',
    fleet: 'Fleet',
    lead: 'Six short steps — and the car will be waiting for you at the right time and place. The price updates instantly. This is a demo: the request is not sent.',
    trust: [
      'Free cancellation up to 48 hours',
      'Insurance in every rental',
      '24/7 delivery across Moscow',
      'No hidden fees',
    ],
    steps: {
      car: 'Car',
      when: 'When and where',
      protection: 'Protection',
      extras: 'Extras',
      contacts: 'Contact details',
      payment: 'Payment and confirmation',
    },
    stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
    change: 'Change',
    collapse: 'Collapse',
    allClasses: 'All',
    noCar: 'Choose a car — the request cannot be built without it.',
    pickupPlace: 'Pick-up place',
    returnPlace: 'Return place',
    address: 'Delivery address',
    addressPlaceholder: 'Street, building, entrance or hotel name',
    pickup: 'Pick-up',
    dropoff: 'Return',
    editPickup: 'Change the pick-up date',
    editDropoff: 'Change the return date',
    time: 'Time',
    calendar: 'Rental dates',
    longTermHint: (days: string, percent: number) => `${days} more and it becomes ${percent}%`,
    longTermOn: (percent: number) => `A ${percent}% long-rental discount is applied`,
    longTermBoth: (percent: number, next: string) => `A ${percent}% long-rental discount is applied. ${next}`,
    perDay: '/ day',
    once: 'one-off',
    free: 'free',
    included: 'Included',
    recommended: 'Recommended',
    quantity: 'Quantity',
    less: 'Fewer',
    more: 'More',
    name: 'Full name',
    phone: 'Phone',
    email: 'E-mail',
    flight: 'Flight or train number',
    flightPlaceholder: 'E.g. SU 1234',
    comment: 'Wishes',
    commentPlaceholder: 'Interior colour, meeting details, anything',
    optional: ' — optional',
    signedIn: (name: string) => `Details taken from ${name}’s account`,
    signInHint: 'Have an account?',
    signIn: 'Sign in',
    signInRest: '— your contact details will fill in automatically.',
    promo: 'Promo code',
    promoPlaceholder: 'Enter a code',
    promoApply: 'Apply',
    promoRemove: 'Remove',
    promoHint: (code: string) => `Demo code: ${code}`,
    promoOk: (code: string) => `Promo code ${code} applied: 10% off the rental`,
    promoBad: 'There is no such promo code',
    paymentTitle: 'Payment method',
    terms: 'I agree to the rental terms and data processing',
    submit: 'Send request',
    submitNote: 'Demo: nothing is sent anywhere',
    summary: 'Your booking',
    summaryEmpty: 'No car selected. Choose one in the first step or in the fleet.',
    openFleet: 'Open the fleet',
    rows: {
      rent: (days: string, price: string) => `Rental: ${days} × ${price}`,
      longTerm: 'Long-rental discount',
      promo: 'Promo code',
      protection: 'Protection',
      extras: 'Extras',
      delivery: 'Delivery and return',
      total: 'Total',
      deposit: 'Deposit',
      depositNote: 'held on your card and released',
    },
    freeCancel: (date: string) => `Free cancellation until ${date}`,
    help: 'Need help choosing?',
    helpText: 'Call us — we will pick a car and extras in a couple of minutes.',
    days: { one: 'day', few: 'days', many: 'days' },
    errors: {
      car: 'Choose a car',
      address: 'Enter the delivery address',
      name: 'Enter your name',
      phone: 'Enter a phone number — 10+ digits',
      email: 'This e-mail looks wrong',
      terms: 'You need to accept the terms',
    },
    errorSummary: 'Check the fields with errors — hints are below them.',
    includedTitle: 'In every rental',
    includedLead: 'Things you never pay extra for',
    reviewsTitle: (name: string) => `Reviews of the ${name}`,
    reviewsClassTitle: 'Client reviews',
    allReviews: 'All reviews',
    faqTitle: 'Booking questions',
    demoTitle: 'This is a demo site',
    demoText:
      'DriveLux is a portfolio concept: booking does not work here, the form data was not sent or stored anywhere. This is what your request would look like:',
    notSentTitle: 'Request not sent',
    edit: 'Edit request',
    backToFleet: 'Back to the fleet',
    recap: {
      car: 'Car',
      pickup: 'Pick-up',
      dropoff: 'Return',
      term: 'Length',
      protection: 'Protection',
      extras: 'Extras',
      payment: 'Payment',
      contact: 'Contact',
      total: 'Total',
      none: 'none',
    },
  },
)
