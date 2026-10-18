import { localized, type Localized } from '@/i18n/lang'
import { ROUTES } from './site'

// Отзывы клиентов — для секции на главной (три свежих с оценкой 5) и для
// страницы «Отзывы» (/reviews) с фильтром по оценке и классу машины и
// сортировкой. Сайт — концепт: отзывы, имена и даты вымышленные.
//
// car — id машины из content/vehicles.ts: по нему отзыв показывает
// название, ведёт на страницу машины и попадает в фильтр по классу.
// helpful — сколько человек отметили отзыв полезным: по этому числу
// сортировка «Популярные». reply — ответ DriveLux, если он был.
// Даты — в ISO, на экране — по правилам языка (utils/format)
export interface Review {
  id: string
  name: Localized<string>
  date: string
  rating: number
  car: string
  text: Localized<string>
  helpful: number
  reply?: Localized<string>
}

export const REVIEWS: Review[] = [
  {
    id: 'alexander',
    name: { ru: 'Александр К.', en: 'Alexander K.' },
    date: '2026-10-09',
    rating: 5,
    car: 'huracan',
    helpful: 48,
    text: {
      ru: 'Отличный сервис! Брал Lamborghini на выходные. Машина в идеальном состоянии, процесс аренды занял 10 минут. Обязательно вернусь!',
      en: 'Excellent service! I took the Lamborghini for the weekend. The car was in perfect condition and the whole rental took 10 minutes. I will definitely be back!',
    },
  },
  {
    id: 'maria',
    name: { ru: 'Мария Т.', en: 'Maria T.' },
    date: '2026-10-04',
    rating: 5,
    car: 'g-class',
    helpful: 37,
    text: {
      ru: 'Очень понравилось! Удобный сайт, вежливые менеджеры, всё прозрачно и без скрытых платежей. Брала Mercedes G-Class — это просто восторг!',
      en: 'Loved it! A convenient website, polite managers, everything transparent with no hidden fees. I took the Mercedes G-Class — pure delight!',
    },
  },
  {
    id: 'dmitry',
    name: { ru: 'Дмитрий С.', en: 'Dmitry S.' },
    date: '2026-09-28',
    rating: 5,
    car: 'm8',
    helpful: 29,
    text: {
      ru: 'Профессиональный подход, машины в отличном состоянии, хорошие цены. Уже не первый раз пользуюсь DriveLux и всегда доволен!',
      en: 'A professional approach, cars in great condition, fair prices. Not my first time with DriveLux and I am always happy!',
    },
  },
  {
    id: 'elena',
    name: { ru: 'Елена В.', en: 'Elena V.' },
    date: '2026-09-21',
    rating: 5,
    car: 'phantom',
    helpful: 64,
    text: {
      ru: 'Заказывали Phantom с водителем на свадьбу. Машину подали к ЗАГСу минута в минуту, водитель в костюме, в салоне — вода и цветы. Гости до сих пор вспоминают.',
      en: 'We booked the Phantom with a chauffeur for our wedding. The car arrived at the registry office to the minute, the driver wore a suit and there was water and flowers inside. Our guests still talk about it.',
    },
  },
  {
    id: 'igor',
    name: { ru: 'Игорь Н.', en: 'Igor N.' },
    date: '2026-09-15',
    rating: 4,
    car: 's-class',
    helpful: 12,
    text: {
      ru: 'S-Class забрал в Шереметьево после ночного рейса — встретили у выхода, всё быстро. Минус звезда за то, что в машине не было зарядки для iPhone, хотя я просил.',
      en: 'Picked up the S-Class at Sheremetyevo after a night flight — met at the exit, everything quick. One star off because there was no iPhone charger in the car, although I had asked for one.',
    },
    reply: {
      ru: 'Игорь, спасибо за отзыв и извините за кабель! Мы добавили зарядки в стандартный комплект каждой машины.',
      en: 'Igor, thank you for the review and sorry about the cable! We have added chargers to the standard kit of every car.',
    },
  },
  {
    id: 'anna',
    name: { ru: 'Анна Л.', en: 'Anna L.' },
    date: '2026-09-08',
    rating: 5,
    car: 'model-3',
    helpful: 21,
    text: {
      ru: 'Первый раз села за электромобиль и боялась зарядок. Менеджер показал карту станций в Москве и объяснил всё за пять минут. Неделя пролетела — хочу свою Tesla.',
      en: 'It was my first time in an electric car and I was worried about charging. The manager showed me a map of stations in Moscow and explained everything in five minutes. The week flew by — now I want my own Tesla.',
    },
  },
  {
    id: 'sergey',
    name: { ru: 'Сергей П.', en: 'Sergey P.' },
    date: '2026-08-30',
    rating: 5,
    car: '911-gt3',
    helpful: 41,
    text: {
      ru: 'GT3 на механике — машина мечты, и здесь её реально дают. Залог большой, но всё честно: разблокировали через два дня после возврата.',
      en: 'A manual GT3 is a dream car, and here you can actually rent one. The deposit is high but fair: it was released two days after the return.',
    },
  },
  {
    id: 'olga',
    name: { ru: 'Ольга Д.', en: 'Olga D.' },
    date: '2026-08-24',
    rating: 5,
    car: 'x7',
    helpful: 18,
    text: {
      ru: 'Брали X7 на дачу всей семьёй: трое детей, два кресла, собака. Кресла поставили заранее и бесплатно. Машина огромная и очень тихая.',
      en: 'We took the X7 to the country house with the whole family: three kids, two child seats and a dog. The seats were fitted in advance and free of charge. A huge and very quiet car.',
    },
  },
  {
    id: 'artem',
    name: { ru: 'Артём Г.', en: 'Artem G.' },
    date: '2026-08-17',
    rating: 5,
    car: 'urus',
    helpful: 26,
    text: {
      ru: 'Urus на день рождения друга — эффект что надо. Привезли в Москва-Сити к назначенному времени, забрали оттуда же поздно вечером.',
      en: 'The Urus for a friend’s birthday — quite the effect. Delivered to Moscow City at the agreed time and collected from the same place late in the evening.',
    },
  },
  {
    id: 'kristina',
    name: { ru: 'Кристина М.', en: 'Kristina M.' },
    date: '2026-08-09',
    rating: 3,
    car: 'sl-63',
    helpful: 9,
    text: {
      ru: 'Сама машина прекрасная, но подачу задержали на 40 минут из-за пробок на Кутузовском. Предупредили заранее и сделали скидку, но вечер был расписан по минутам.',
      en: 'The car itself is gorgeous, but delivery was 40 minutes late because of traffic on Kutuzovsky Avenue. They warned me in advance and gave a discount, but my evening was planned to the minute.',
    },
    reply: {
      ru: 'Кристина, нам очень жаль. Теперь на вечерние подачи в центр мы выезжаем с запасом в час — чтобы пробки не портили ваши планы.',
      en: 'Kristina, we are very sorry. For evening deliveries to the centre we now leave an hour early so that traffic does not spoil your plans.',
    },
  },
  {
    id: 'pavel',
    name: { ru: 'Павел Р.', en: 'Pavel R.' },
    date: '2026-08-02',
    rating: 5,
    car: 'range-rover',
    helpful: 15,
    text: {
      ru: 'Range Rover на две недели для командировки. Долгосрочный тариф заметно дешевле посуточного, а менеджер сам напоминал о плановой мойке.',
      en: 'A Range Rover for two weeks on a business trip. The long-term rate is noticeably cheaper than daily, and the manager reminded me about the scheduled wash himself.',
    },
  },
  {
    id: 'victoria',
    name: { ru: 'Виктория С.', en: 'Victoria S.' },
    date: '2026-07-26',
    rating: 5,
    car: 'continental-gt',
    helpful: 22,
    text: {
      ru: 'Bentley на годовщину — муж был в восторге. Отдельное спасибо за открытку от DriveLux в бардачке, приятная мелочь.',
      en: 'A Bentley for our anniversary — my husband was thrilled. Special thanks for the card from DriveLux in the glovebox, a lovely touch.',
    },
  },
  {
    id: 'nikita',
    name: { ru: 'Никита Ф.', en: 'Nikita F.' },
    date: '2026-07-19',
    rating: 4,
    car: 'r8',
    helpful: 8,
    text: {
      ru: 'R8 огонь, звук V10 — отдельное удовольствие. Лимит 250 км в сутки показался маловат для поездки в Тверь и обратно, пришлось доплатить.',
      en: 'The R8 is fire, and the V10 sound is a joy of its own. The 250 km daily limit felt a bit short for a trip to Tver and back, so I had to pay extra.',
    },
  },
  {
    id: 'yulia',
    name: { ru: 'Юлия К.', en: 'Yulia K.' },
    date: '2026-07-11',
    rating: 5,
    car: 'cullinan',
    helpful: 33,
    text: {
      ru: 'Cullinan Black Badge для фотосессии на Рублёвке. Водитель помог выставить машину в кадре и терпеливо ждал три часа. Сервис на высоте.',
      en: 'The Cullinan Black Badge for a photo shoot in Rublyovka. The driver helped position the car for the shots and patiently waited for three hours. Top-notch service.',
    },
  },
  {
    id: 'maxim',
    name: { ru: 'Максим Е.', en: 'Maxim E.' },
    date: '2026-07-03',
    rating: 5,
    car: 'model-s',
    helpful: 14,
    text: {
      ru: 'Model S на неделю вместо такси по Москве. Тихо, быстро, бесплатные парковки для электромобилей — сэкономил больше, чем заплатил за аренду.',
      en: 'A Model S for a week instead of taxis around Moscow. Quiet, fast, and free parking for electric cars — I saved more than the rental cost.',
    },
  },
  {
    id: 'ekaterina',
    name: { ru: 'Екатерина Б.', en: 'Ekaterina B.' },
    date: '2026-06-25',
    rating: 5,
    car: 'g-class',
    helpful: 19,
    text: {
      ru: 'Вторая аренда G-Class за год — уже как у себя дома. После третьей поездки дали скидку 5%, приятно, что программа лояльности работает автоматически.',
      en: 'My second G-Class rental this year — I feel right at home. After the third trip I got a 5% discount; nice that the loyalty programme works automatically.',
    },
  },
  {
    id: 'roman',
    name: { ru: 'Роман Т.', en: 'Roman T.' },
    date: '2026-06-18',
    rating: 5,
    car: 'mclaren-765lt',
    helpful: 52,
    text: {
      ru: '765LT — самое острое, что я водил. Перед выдачей провели инструктаж по режимам и отвезли на тихую трассу за городом, чтобы привыкнуть.',
      en: 'The 765LT is the sharpest thing I have ever driven. Before handing it over they briefed me on the driving modes and took me to a quiet road out of town to get used to it.',
    },
  },
  {
    id: 'svetlana',
    name: { ru: 'Светлана И.', en: 'Svetlana I.' },
    date: '2026-06-09',
    rating: 5,
    car: 'bmw-7',
    helpful: 7,
    text: {
      ru: 'Корпоративный клиент: заказываем седаны для партнёров уже полгода. Все документы для бухгалтерии приходят вовремя, менеджер один и тот же.',
      en: 'A corporate client: we have been ordering saloons for our partners for six months. All accounting documents arrive on time and we always deal with the same manager.',
    },
  },
  {
    id: 'denis',
    name: { ru: 'Денис А.', en: 'Denis A.' },
    date: '2026-05-30',
    rating: 5,
    car: 'ferrari-296',
    helpful: 45,
    text: {
      ru: '296 GTB в электрорежиме тихо выезжает со двора, а за МКАД превращается в ракету. Машина чистая, бак полный, фото сделали вместе со мной при передаче.',
      en: 'In electric mode the 296 GTB slips quietly out of the yard, and beyond the ring road it turns into a rocket. The car was clean with a full tank, and we took photos together at handover.',
    },
  },
  {
    id: 'irina',
    name: { ru: 'Ирина Ж.', en: 'Irina Z.' },
    date: '2026-05-21',
    rating: 4,
    car: 'taycan',
    helpful: 6,
    text: {
      ru: 'Taycan понравился, но запас хода зимой меньше заявленного — стоит учитывать при поездках за город. Поддержка ответила ночью за пару минут.',
      en: 'I liked the Taycan, but the winter range is shorter than advertised — worth keeping in mind for trips out of town. Support answered at night within a couple of minutes.',
    },
  },
  {
    id: 'konstantin',
    name: { ru: 'Константин Л.', en: 'Konstantin L.' },
    date: '2026-05-12',
    rating: 5,
    car: 'rs6',
    helpful: 17,
    text: {
      ru: 'RS 6 — идеальный компромисс: влезли чемоданы, лыжи и трое пассажиров, а на трассе он быстрее многих спорткаров. Сдал во Внуково, без очередей.',
      en: 'The RS 6 is the perfect compromise: suitcases, skis and three passengers fitted in, and on the motorway it is quicker than many sports cars. Returned it at Vnukovo with no queues.',
    },
  },
  {
    id: 'natalia',
    name: { ru: 'Наталья Ш.', en: 'Natalia Sh.' },
    date: '2026-04-28',
    rating: 5,
    car: 's-class',
    helpful: 11,
    text: {
      ru: 'Брала S-Class с водителем для родителей — встретить в Домодедово и отвезти на дачу. Водитель помог с багажом и ехал очень аккуратно.',
      en: 'I booked the S-Class with a chauffeur for my parents — to meet them at Domodedovo and drive them to the country house. The driver helped with the luggage and drove very carefully.',
    },
  },
  {
    id: 'vladimir',
    name: { ru: 'Владимир О.', en: 'Vladimir O.' },
    date: '2026-04-16',
    rating: 5,
    car: 'range-rover-sport',
    helpful: 10,
    text: {
      ru: 'SVR звучит так, что прохожие оборачиваются. Всё оформили онлайн, в офис не заезжал ни разу — ключи привезли домой.',
      en: 'The SVR sounds so good that passers-by turn their heads. Everything was arranged online and I never went to the office — the keys were brought to my home.',
    },
  },
  {
    id: 'alina',
    name: { ru: 'Алина Х.', en: 'Alina H.' },
    date: '2026-04-02',
    rating: 5,
    car: 'a-class',
    helpful: 5,
    text: {
      ru: 'Не нужен был суперкар — просто удобная машина на месяц, пока своя в ремонте. A-Class экономичный, а сервис такой же внимательный, как к дорогим машинам.',
      en: 'I did not need a supercar — just a convenient car for a month while mine was being repaired. The A-Class is economical, and the service was as attentive as for the expensive cars.',
    },
  },
  {
    id: 'georgy',
    name: { ru: 'Георгий М.', en: 'Georgy M.' },
    date: '2026-03-19',
    rating: 5,
    car: 'cayenne',
    helpful: 13,
    text: {
      ru: 'Cayenne Turbo GT на выходные в Завидово. Мощный, комфортный, с отличной подвеской. Вернул на Белорусском вокзале, удобно.',
      en: 'The Cayenne Turbo GT for a weekend in Zavidovo. Powerful, comfortable, with superb suspension. Returned it at Belorussky station — very convenient.',
    },
  },
  {
    id: 'daria',
    name: { ru: 'Дарья Н.', en: 'Daria N.' },
    date: '2026-03-05',
    rating: 5,
    car: 'huracan',
    helpful: 30,
    text: {
      ru: 'Подарила мужу день на Huracán. Менеджер помог всё спланировать как сюрприз: машина ждала у подъезда с бантом. Лучший подарок за все годы!',
      en: 'I gave my husband a day with the Huracán. The manager helped plan it as a surprise: the car was waiting at our entrance with a bow. The best gift in years!',
    },
  },
  {
    id: 'timur',
    name: { ru: 'Тимур З.', en: 'Timur Z.' },
    date: '2026-02-14',
    rating: 5,
    car: 'phantom',
    helpful: 20,
    text: {
      ru: 'Phantom на 14 февраля — сделал предложение прямо в машине под звёздным потолком. Она согласилась, так что DriveLux теперь часть нашей истории.',
      en: 'The Phantom on Valentine’s Day — I proposed right in the car under the starlight headliner. She said yes, so DriveLux is now part of our story.',
    },
  },
  {
    id: 'oleg',
    name: { ru: 'Олег В.', en: 'Oleg V.' },
    date: '2026-01-22',
    rating: 4,
    car: 'g-class',
    helpful: 4,
    text: {
      ru: 'Зимой G-Class — то что нужно, на шипах и с подогревом всего. Хотелось бы возможность забрать машину раньше 8 утра без доплаты.',
      en: 'In winter the G-Class is exactly right, on studded tyres and with everything heated. I wish I could pick it up before 8 am without paying extra.',
    },
  },
  {
    id: 'polina',
    name: { ru: 'Полина Р.', en: 'Polina R.' },
    date: '2025-12-28',
    rating: 5,
    car: 'x7',
    helpful: 16,
    text: {
      ru: 'Новогодние каникулы с X7: зимний комплект, щётки и даже термос в багажнике. Вернули в Шереметьево перед вылетом, всё приняли за пять минут.',
      en: 'New Year holidays with the X7: a winter kit, brushes and even a thermos in the boot. We returned it at Sheremetyevo before our flight and the check took five minutes.',
    },
  },
  {
    id: 'anton',
    name: { ru: 'Антон Ю.', en: 'Anton Y.' },
    date: '2025-12-10',
    rating: 5,
    car: 'urus',
    helpful: 24,
    text: {
      ru: 'Пятая аренда, уже золотой уровень программы — машину подают вне очереди, а скидка ощутимая. Рекомендую друзьям.',
      en: 'My fifth rental and I am already on the gold tier — the car is delivered as a priority and the discount is noticeable. I recommend DriveLux to friends.',
    },
  },
]

// Средняя оценка и число отзывов считаются по самим отзывам — цифры у
// заголовка на главной и на странице отзывов всегда совпадают со списком
export const REVIEW_STATS = {
  total: REVIEWS.length,
  rating: Math.round((REVIEWS.reduce((sum, review) => sum + review.rating, 0) / REVIEWS.length) * 10) / 10,
}

// На главной — три свежих отзыва с высшей оценкой
export const HOME_REVIEWS = [...REVIEWS]
  .filter((review) => review.rating === 5)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3)

export const REVIEWS_SECTION = localized(
  {
    eyebrow: 'Отзывы клиентов',
    title: 'Что говорят о DriveLux',
    link: { label: 'Все отзывы', href: ROUTES.reviews },
    reviews: { one: 'отзыв', few: 'отзыва', many: 'отзывов' },
    car: 'Автомобиль',
    rating: (value: string) => `Оценка ${value} из 5`,
  },
  {
    eyebrow: 'Client reviews',
    title: 'What people say about DriveLux',
    link: { label: 'All reviews', href: ROUTES.reviews },
    reviews: { one: 'review', few: 'reviews', many: 'reviews' },
    car: 'Car',
    rating: (value: string) => `Rated ${value} out of 5`,
  },
)
