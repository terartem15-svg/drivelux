import type { Localized } from '@/i18n/lang'

// Описания машин на двух языках — для страницы машины. Отдельно от
// vehicles.ts: каталог, шапка и поиск описаний не показывают, а в общем
// файле сайта они весили бы около сотни килобайт. Этот файл грузится
// вместе со страницей машины
export const VEHICLE_DESCRIPTIONS: Record<string, Localized<string>> = {
  'huracan': {
    ru: 'Атмосферный V10 на 640 л.с. и задний привод: Tecnica — самый «водительский» Huracán, собранный из опыта гоночного STO, но удобный и на каждый день. Самый узнаваемый суперкар парка — для тех, кто хочет почувствовать Lamborghini без компромиссов.',
    en: 'A naturally aspirated 640 hp V10 and rear-wheel drive: the Tecnica is the most driver-focused Huracán, built on lessons from the racing STO yet easy to live with every day. The most recognisable supercar in the fleet — for those who want Lamborghini without compromise.',
  },
  'urus': {
    ru: 'Суперкроссовер с битурбо V8: разгон как у спорткара и пять полноценных мест. Подходит и для поездки компанией за город, и для эффектного появления в центре.',
    en: 'A super-SUV with a twin-turbo V8: sports-car acceleration and five proper seats. Equally good for a trip out of town with friends and for a grand entrance in the city centre.',
  },
  'g-class': {
    ru: 'Mercedes-AMG G 63 — «гелендваген» с битурбо V8 на 585 л.с. Рамная конструкция, три блокировки дифференциалов и силуэт, который не спутать ни с чем.',
    en: 'The Mercedes-AMG G 63 — the iconic “G-Wagen” with a 585 hp twin-turbo V8. Body-on-frame construction, three locking differentials and a silhouette you cannot mistake for anything else.',
  },
  's-class': {
    ru: 'Флагманский седан S 580 4MATIC: пневмоподвеска, тишина в салоне и задний ряд, где удобно работать в дороге. Выбор для деловых встреч и трансферов из аэропорта.',
    en: 'The flagship S 580 4MATIC saloon: air suspension, a hushed cabin and a rear seat made for working on the move. The choice for business meetings and airport transfers.',
  },
  'a-class': {
    ru: 'Компактный седан A 200 с экономичным турбомотором и цифровой приборной панелью MBUX. Самый доступный способ ездить на Mercedes-Benz по городу.',
    en: 'The compact A 200 saloon with a frugal turbo engine and the digital MBUX cockpit. The most affordable way to drive a Mercedes-Benz around the city.',
  },
  'sl-63': {
    ru: 'Родстер AMG с мягкой крышей, битурбо V8 и полным приводом 4MATIC+. Крыша складывается за 15 секунд — даже на ходу, на скорости до 60 км/ч.',
    en: 'An AMG roadster with a soft top, twin-turbo V8 and 4MATIC+ all-wheel drive. The roof folds in 15 seconds — even on the move, at up to 60 km/h.',
  },
  'm8': {
    ru: 'Гран-туризмо M8 Competition с V8 на 625 л.с. и полным приводом M xDrive. Быстрый, как спорткар, и при этом спокойный и удобный в дальней дороге.',
    en: 'The M8 Competition grand tourer with a 625 hp V8 and M xDrive all-wheel drive. As fast as a sports car, yet calm and comfortable on a long journey.',
  },
  'bmw-7': {
    ru: 'Подзаряжаемый гибрид 745Le xDrive: рядная «шестёрка» вместе с электромотором и удлинённая база с просторным задним рядом. По городу может ехать бесшумно, на одном электричестве.',
    en: 'The 745Le xDrive plug-in hybrid: an inline six paired with an electric motor and a long wheelbase with a roomy rear seat. In town it can glide silently on electricity alone.',
  },
  'x7': {
    ru: 'Самый большой BMW: три ряда сидений на семь человек и экономичный дизель xDrive40d. Для семейных поездок и путешествий с большим багажом.',
    en: 'The biggest BMW: three rows of seats for seven people and the frugal xDrive40d diesel. Made for family trips and journeys with plenty of luggage.',
  },
  '911-gt3': {
    ru: 'Атмосферный оппозитный мотор 4.0, который крутится до 9 000 об/мин, и шестиступенчатая механика. GT3 — машина для тех, кто ценит сам процесс вождения больше, чем цифры разгона.',
    en: 'A naturally aspirated 4.0 flat-six that revs to 9,000 rpm and a six-speed manual. The GT3 is for those who value the act of driving more than acceleration figures.',
  },
  'taycan': {
    ru: 'Электрический спортивный седан с полным приводом и двухступенчатой коробкой. Мгновенный разгон и управляемость, которой ждёшь от Porsche, — без единой капли бензина.',
    en: 'An electric sports saloon with all-wheel drive and a two-speed gearbox. Instant acceleration and the handling you expect from a Porsche — without a drop of petrol.',
  },
  'cayenne': {
    ru: 'Самая быстрая версия Cayenne: кузов купе, V8 на 640 л.с. и четыре спортивных кресла. Кроссовер, который на треке спорит со спорткарами.',
    en: 'The fastest Cayenne: a coupé body, a 640 hp V8 and four sports seats. An SUV that can take on sports cars on a race track.',
  },
  'rs6': {
    ru: 'Универсал с битурбо V8, полным приводом quattro и огромным багажником. Отвезёт семью на море и по дороге обгонит большинство спорткаров.',
    en: 'An estate with a twin-turbo V8, quattro all-wheel drive and a huge boot. It will take the family to the seaside and overtake most sports cars on the way.',
  },
  'rs3': {
    ru: 'Хэтчбек с рядной «пятёркой» на 400 л.с. и полным приводом quattro: компактный по размерам, но быстрее многих спорткаров. Удобно парковать в центре и весело ехать за городом.',
    en: 'A hatchback with a 400 hp five-cylinder and quattro all-wheel drive: compact in size but quicker than many sports cars. Easy to park in the centre and fun out of town.',
  },
  'r8': {
    ru: 'Атмосферный V10 за спиной водителя и полный привод quattro. R8 — суперкар на каждый день: в нём удобно и в городской пробке, и на горном серпантине.',
    en: 'A naturally aspirated V10 behind the driver and quattro all-wheel drive. The R8 is an everyday supercar: comfortable in a city traffic jam and on a mountain road alike.',
  },
  'phantom': {
    ru: 'Флагман Rolls-Royce с V12, задними дверями, открывающимися против хода, и знаменитой плавностью хода. Для свадеб, юбилеев и встреч, где важна каждая деталь.',
    en: 'The Rolls-Royce flagship with a V12, rear-hinged coach doors and the famous magic-carpet ride. For weddings, anniversaries and occasions where every detail matters.',
  },
  'cullinan': {
    ru: 'Внедорожник Rolls-Royce в версии Black Badge: 600 л.с., затемнённый хром и полный привод. Роскошь, которой не страшны ни горный серпантин, ни грунтовка к загородному клубу.',
    en: 'The Rolls-Royce SUV in Black Badge form: 600 hp, darkened chrome and all-wheel drive. Luxury that is unfazed by a mountain road or a gravel track to a country club.',
  },
  'continental-gt': {
    ru: 'Гран-туризмо ручной сборки в версии V8 S: битурбо V8, кожа и дерево в салоне, четыре места. Bentley для долгих поездок вдвоём — или вчетвером, если задний ряд не пугает.',
    en: 'A hand-built grand tourer in V8 S form: twin-turbo V8, leather and wood inside, four seats. A Bentley for long journeys for two — or for four, if the rear seat does not put you off.',
  },
  'range-rover': {
    ru: 'Range Rover пятого поколения в топовой версии Autobiography с дизелем D350. Пневмоподвеска, тишина в салоне и проходимость, которой хватит на любую дорогу.',
    en: 'The fifth-generation Range Rover in top Autobiography trim with the D350 diesel. Air suspension, a silent cabin and enough off-road ability for any road.',
  },
  'range-rover-sport': {
    ru: 'Самая мощная версия Range Rover Sport: компрессорный V8 на 575 л.с. и громкий выхлоп. Внедорожник с характером спорткара.',
    en: 'The most powerful Range Rover Sport: a supercharged 575 hp V8 and a loud exhaust. An SUV with the character of a sports car.',
  },
  'model-s': {
    ru: 'Электроседан Long Range с запасом хода больше 600 км и разгоном до сотни за 3,2 секунды. Тихий и быстрый — удобен и для деловых поездок по городу, и для дороги в другой город.',
    en: 'The Long Range electric saloon with more than 600 km of range and 0–100 km/h in 3.2 seconds. Quiet and fast — ideal for business trips in town and for a long drive to another city.',
  },
  'model-3': {
    ru: 'Двухмоторная версия Long Range с полным приводом и запасом хода около 600 км. Недорогой и удобный способ попробовать, каково это — жить с электромобилем.',
    en: 'The dual-motor Long Range version with all-wheel drive and about 600 km of range. An affordable and convenient way to find out what living with an electric car is like.',
  },
  'mclaren-765lt': {
    ru: 'Облегчённая «длиннохвостая» версия 720S: 765 л.с., много карбона и аэродинамика, отточенная на треке. Машина для тех, кому нужна максимальная острота.',
    en: 'The lightweight “Longtail” version of the 720S: 765 hp, lots of carbon fibre and aerodynamics honed on the track. A car for those who want maximum sharpness.',
  },
  'ferrari-296': {
    ru: 'Битурбо V6 и электромотор вместе выдают 830 л.с. По городу 296 GTB может ехать на одном электричестве, а за городом — разогнаться до сотни за 2,9 секунды.',
    en: 'A twin-turbo V6 and an electric motor make 830 hp together. In town the 296 GTB can run on electricity alone, and out of town it hits 100 km/h in 2.9 seconds.',
  },
  'mercedes-e-class': {
    ru: 'Новое поколение E-Class: тихий салон, мягкая подвеска и полный привод 4MATIC. Машина, в которой одинаково удобно ехать на переговоры и в аэропорт.',
    en: 'The new-generation E-Class: a quiet cabin, a supple ride and 4MATIC all-wheel drive. Equally at home on the way to a meeting or to the airport.',
  },
  'kia-picanto': {
    ru: 'Компактный городской хэтчбек: паркуется где угодно, тратит мало и легко управляется в пробках. Лучший выбор, если нужно просто удобно передвигаться по Москве.',
    en: 'A compact city hatchback: parks anywhere, uses little fuel and is easy to drive in traffic. The best choice when you simply need to get around Moscow with ease.',
  },
  'porsche-911-carrera-s': {
    ru: 'Классический 911 поколения 992: оппозитный битурбо-мотор сзади, точный руль и сотня за 3,7 секунды. Спорткар, на котором приятно ездить и каждый день.',
    en: 'The classic 992-generation 911: a twin-turbo flat-six at the back, precise steering and 100 km/h in 3.7 seconds. A sports car that is a pleasure to drive every day.',
  },
  'toyota-camry': {
    ru: 'Просторный седан с гибридной установкой: по городу едет тихо и расходует меньше 5 литров. Надёжный вариант для командировки или поездки семьёй.',
    en: 'A roomy hybrid saloon: quiet in town and using under 5 litres per 100 km. A dependable choice for a business trip or a family drive.',
  },
  'mercedes-maybach-s580': {
    ru: 'Удлинённый S-Class с V8 и задним рядом, где кресла раскладываются почти в кровать. Машина для тех, кто едет сзади: лучше подходит для поездки с водителем.',
    en: 'A long-wheelbase S-Class with a V8 and rear seats that recline almost into a bed. A car for those who ride in the back — best enjoyed with a chauffeur.',
  },
  'kia-k5': {
    ru: 'Стремительный седан с силуэтом фастбэка, большим экраном и вентилируемыми креслами. Выглядит дороже своего класса — и так же ощущается в дороге.',
    en: 'A sleek fastback-style saloon with a large screen and ventilated seats. It looks more expensive than its class — and feels that way on the road too.',
  },
  'land-rover-defender': {
    ru: 'Легендарный внедорожник в новом поколении: пневмоподвеска, понижающая передача и салон, в котором комфортно и в городе, и на грунтовке. Для поездки за город без оглядки на дорогу.',
    en: 'A legendary off-roader in its new generation: air suspension, low-range gearing and a cabin that is comfortable in the city and on a dirt road. For trips out of town without worrying about the road.',
  },
  'toyota-corolla': {
    ru: 'Экономичный гибридный седан: в городском цикле часто едет на одном электричестве и почти не тратит бензин. Просторный салон и багажник — для повседневных поездок.',
    en: 'An economical hybrid saloon: in town it often runs on electricity alone and barely touches the fuel. A roomy cabin and boot for everyday trips.',
  },
  'ferrari-roma': {
    ru: 'Элегантное гран-туризмо в духе итальянской «сладкой жизни»: V8 на 620 л.с. под длинным капотом и мягкий характер в повседневной езде. Ferrari для вечернего города.',
    en: 'An elegant grand tourer in the spirit of the Italian dolce vita: a 620 hp V8 under the long bonnet and a gentle character in everyday driving. A Ferrari for the city at night.',
  },
  'genesis-g80': {
    ru: 'Бизнес-седан с битурбо V6 на 380 л.с. и полным приводом: быстрый, тихий и богато оснащённый. Узнаваемая решётка-«щит» и салон с отделкой как в машинах классом выше.',
    en: 'A business saloon with a 380 hp twin-turbo V6 and all-wheel drive: fast, quiet and richly equipped. A distinctive crest grille and a cabin trimmed like cars from the class above.',
  },
  'rolls-royce-ghost': {
    ru: 'Самый «водительский» Rolls-Royce: V12, полный привод и подвеска, которая сглаживает любую дорогу. Строгий и спокойный — для особых поводов и важных встреч.',
    en: 'The most driver-focused Rolls-Royce: a V12, all-wheel drive and suspension that smooths out any road. Understated and calm — for special occasions and important meetings.',
  },
  'kia-carnival': {
    ru: 'Минивэн с высокой крышей и салоном-лаунжем: кресла с подножками, экран для пассажиров и место для багажа. Удобен для трансфера компании до семи человек.',
    en: 'A high-roof MPV with a lounge cabin: reclining seats with leg rests, a passenger screen and room for luggage. Ideal for transfers of up to seven people.',
  },
  'bmw-5-series': {
    ru: 'Новая «пятёрка»: изогнутый экран на всю панель, подсвеченная решётка и фирменная управляемость BMW. Деловой седан для тех, кто любит сам сидеть за рулём.',
    en: 'The new 5 Series: a curved screen across the dashboard, an illuminated grille and trademark BMW handling. A business saloon for those who like to drive themselves.',
  },
  'bmw-m3': {
    ru: 'Седан на пять мест с характером суперкара: рядная «шестёрка» на 510 л.с. и полный привод M xDrive, который можно перевести в задний. Быстро, практично и очень эмоционально.',
    en: 'A five-seat saloon with a supercar temper: a 510 hp straight-six and M xDrive all-wheel drive that can switch to rear-wheel drive. Fast, practical and very emotional.',
  },
  'toyota-land-cruiser-300': {
    ru: 'Большой рамный внедорожник с битурбо V6 и семью местами. Пройдёт там, где другие застрянут, а по трассе едет спокойно и уверенно.',
    en: 'A large body-on-frame SUV with a twin-turbo V6 and seven seats. It goes where others get stuck, yet cruises calmly and confidently on the motorway.',
  },
  'hyundai-sonata': {
    ru: 'Седан с футуристичной светодиодной полосой спереди и просторным задним рядом. Тихий, экономичный и удобный — для командировки или поездок по городу.',
    en: 'A saloon with a futuristic full-width LED strip and a spacious rear seat. Quiet, economical and comfortable — for business trips or getting around town.',
  },
  'porsche-911-turbo-s': {
    ru: 'Самый быстрый 911 без гоночных приставок: 650 л.с., полный привод и сотня за 2,7 секунды. Суперкар, который спокойно едет и по зимней Москве.',
    en: 'The fastest 911 without a racing suffix: 650 hp, all-wheel drive and 100 km/h in 2.7 seconds. A supercar that is just as happy on a winter Moscow street.',
  },
  'kia-sorento': {
    ru: 'Семиместный кроссовер с турбомотором и полным приводом: третий ряд для детей, большой багажник и современный салон. Для семейной поездки за город.',
    en: 'A seven-seat crossover with a turbo engine and all-wheel drive: a third row for the kids, a big boot and a modern cabin. For a family trip out of town.',
  },
  'lexus-es': {
    ru: 'Тихий и мягкий бизнес-седан с безупречной репутацией надёжности. Лучше всего подходит для спокойных поездок по городу и встреч, где важен комфорт пассажира.',
    en: 'A quiet, supple business saloon with an impeccable reputation for reliability. Best for relaxed city driving and meetings where passenger comfort matters.',
  },
  'bentley-bentayga': {
    ru: 'Роскошный внедорожник ручной сборки: салон из кожи и дерева, V8 на 550 л.с. и подвеска, которая гасит любые неровности. Для тех, кто не готов выбирать между комфортом и проходимостью.',
    en: 'A hand-built luxury SUV: a leather-and-wood cabin, a 550 hp V8 and suspension that soaks up any bump. For those who refuse to choose between comfort and capability.',
  },
  'hyundai-tucson': {
    ru: 'Обновлённый кроссовер с гибридной установкой и полным приводом. Экономичный в городе, просторный внутри и уверенный на загородной дороге.',
    en: 'The updated crossover with a hybrid powertrain and all-wheel drive. Economical in town, spacious inside and confident on country roads.',
  },
  'chevrolet-corvette': {
    ru: 'Первый Corvette со среднемоторной компоновкой: американский V8 за спиной и съёмная крыша-тарга. Яркий спорткар с характером, которого нет у европейцев.',
    en: 'The first mid-engined Corvette: an American V8 behind your back and a removable targa roof. A vivid sports car with a character European rivals lack.',
  },
  'audi-a6': {
    ru: 'Строгий бизнес-седан с полным приводом quattro и цифровым салоном с двумя сенсорными экранами. Собранный, тихий и быстрый — классика деловой поездки.',
    en: 'A sharp business saloon with quattro all-wheel drive and a digital cabin with two touchscreens. Composed, quiet and quick — the classic business car.',
  },
  'hyundai-palisade': {
    ru: 'Большой семиместный кроссовер с V6 и салоном уровня премиальных марок. Много места в каждом ряду — для поездки компанией или с семьёй и багажом.',
    en: 'A large seven-seat crossover with a V6 and a cabin on par with premium brands. Plenty of room in every row — for trips with friends or family and luggage.',
  },
  'mercedes-amg-gt-r': {
    ru: '«Зелёный ад» из Аффальтербаха: битурбо V8 на 585 л.с., задний привод и аэродинамика с Нюрбургринга. Машина для тех, кто ценит острые ощущения.',
    en: 'The "Green Hell" from Affalterbach: a 585 hp twin-turbo V8, rear-wheel drive and aerodynamics honed at the Nürburgring. For those who crave a thrill.',
  },
  'hyundai-ioniq-5': {
    ru: 'Электрический кроссовер в стиле ретро-футуризма: два мотора, разгон за 5 секунд и запас хода около 450 км. Тихий салон с плоским полом и кресла с подножками.',
    en: 'A retro-futuristic electric crossover: two motors, 100 km/h in about 5 seconds and around 450 km of range. A quiet cabin with a flat floor and reclining seats.',
  },
  'genesis-gv80': {
    ru: 'Премиальный кроссовер в полностью чёрном исполнении Black: битурбо V6 на 380 л.с., полный привод и салон с 27-дюймовым экраном. Сдержанный и очень солидный.',
    en: 'A premium SUV in all-black Black trim: a 380 hp twin-turbo V6, all-wheel drive and a cabin with a 27-inch screen. Understated and very substantial.',
  },
  'lexus-lx': {
    ru: 'Флагманский внедорожник Lexus на раме Land Cruiser 300: битурбо V6, семь мест и роскошный салон. Проедет где угодно и сделает это с комфортом.',
    en: 'Lexus\'s flagship SUV on the Land Cruiser 300 frame: a twin-turbo V6, seven seats and a luxurious cabin. It goes anywhere and does it in comfort.',
  },
  'zeekr-001': {
    ru: 'Электрический шутинг-брейк с двумя моторами на 544 л.с. и пневмоподвеской. Быстрый, как спорткар, и вместительный, как универсал.',
    en: 'An electric shooting brake with two motors making 544 hp and air suspension. As fast as a sports car and as roomy as an estate.',
  },
  'bmw-x5': {
    ru: 'Обновлённый X5 с рядной «шестёркой» и мягким гибридом: быстрый, управляемый и удобный в дальней дороге. Один из самых универсальных кроссоверов парка.',
    en: 'The updated X5 with a straight-six and mild hybrid: fast, agile and comfortable on long journeys. One of the most versatile SUVs in the fleet.',
  },
  'hyundai-santa-fe': {
    ru: 'Новый Santa Fe с угловатым силуэтом внедорожника и огромным задним проёмом: удобно грузить велосипеды и вещи для поездки. Семь мест и полный привод HTRAC.',
    en: 'The new Santa Fe with a boxy off-roader silhouette and a huge tailgate opening: easy to load bikes and gear for a trip. Seven seats and HTRAC all-wheel drive.',
  },
  'volvo-xc90': {
    ru: 'Скандинавский семиместный кроссовер с подключаемым гибридом: по городу — на электричестве, за городом — 407 л.с. Светлый салон и много воздуха.',
    en: 'A Scandinavian seven-seat plug-in hybrid SUV: electric in town, 407 hp out of town. A light, airy cabin with plenty of room.',
  },
  'aston-martin-vantage': {
    ru: 'Британское купе с битурбо V8 на 510 л.с. и коротким хвостом: резкое, громкое и очень красивое. Для поездки, которая запомнится.',
    en: 'A British coupé with a 510 hp twin-turbo V8 and a short tail: sharp, loud and very beautiful. For a drive you will remember.',
  },
  'ford-mustang': {
    ru: 'Самый мощный атмосферный Mustang: V8 5.0 на 507 л.с., задний привод и тот самый американский звук. Мускулкар нового поколения с цифровой приборной панелью.',
    en: 'The most powerful naturally aspirated Mustang: a 507 hp 5.0 V8, rear-wheel drive and that unmistakable American sound. A new-generation muscle car with a digital cockpit.',
  },
  'maserati-mc20': {
    ru: 'Среднемоторный суперкар Maserati с двери-«бабочками» и собственным V6 Nettuno на 630 л.с. Итальянская элегантность и гоночная техника в одном кузове.',
    en: 'Maserati\'s mid-engined supercar with butterfly doors and its own 630 hp Nettuno V6. Italian elegance and racing technology in one body.',
  },
  'volkswagen-polo': {
    ru: 'Компактный хэтчбек с немецким качеством сборки: лёгкий в управлении, экономичный и удобный для парковки в центре. Простой выбор на каждый день.',
    en: 'A compact hatchback with German build quality: easy to drive, economical and simple to park in the centre. An easy everyday choice.',
  },
  'mercedes-gle': {
    ru: 'Большой кроссовер Mercedes с экономичным дизелем и полным приводом: тихий салон, мягкий ход и огромный багажник. Для дальних поездок без усталости.',
    en: 'Mercedes\'s large SUV with an economical diesel and all-wheel drive: a quiet cabin, a soft ride and a huge boot. For long trips without fatigue.',
  },
  'kia-seltos': {
    ru: 'Компактный кроссовер с высокой посадкой и современным салоном: удобно в городе и не страшно за его пределами. Хороший баланс цены и комфорта.',
    en: 'A compact crossover with a high seating position and a modern cabin: comfortable in town and capable beyond it. A good balance of price and comfort.',
  },
  'porsche-macan': {
    ru: 'Самый спортивный компактный кроссовер: управляется как Porsche, а багажник вмещает вещи на выходные. Битурбо V6 и полный привод.',
    en: 'The sportiest compact SUV: it handles like a Porsche, while the boot fits luggage for the weekend. A twin-turbo V6 and all-wheel drive.',
  },
  'lada-vesta': {
    ru: 'Универсал с увеличенным клиренсом и пластиковой защитой кузова: не боится грунтовок и вмещает всё для поездки на дачу. Самый доступный автомобиль парка.',
    en: 'An estate with raised ground clearance and body cladding: it copes with dirt roads and fits everything for a trip to the dacha. The most affordable car in the fleet.',
  },
  'toyota-rav4': {
    ru: 'Гибридный кроссовер с полным приводом: экономичный, надёжный и просторный. Подходит и для города, и для поездки на природу всей семьёй.',
    en: 'A hybrid crossover with all-wheel drive: economical, reliable and spacious. Equally suited to the city and to a family trip into the countryside.',
  },
  'audi-q7': {
    ru: 'Семиместный кроссовер Audi: тихий, просторный и с полным приводом quattro. Удобен для поездки большой компанией или семьёй с детьми.',
    en: 'Audi\'s seven-seat SUV: quiet, roomy and with quattro all-wheel drive. Comfortable for trips with a large group or a family with children.',
  },
  'hyundai-creta': {
    ru: 'Популярный городской кроссовер: высокий клиренс, просторный салон и простое обслуживание. Выбор для тех, кому нужен практичный автомобиль без лишних трат.',
    en: 'A popular city crossover: high ground clearance, a roomy cabin and simple maintenance. The choice for those who need a practical car without extra costs.',
  },
  'exeed-vx': {
    ru: 'Большой семиместный кроссовер с богатым оснащением: панорамная крыша, массаж передних кресел и три экрана. Много техники за разумные деньги.',
    en: 'A large seven-seat crossover with rich equipment: a panoramic roof, massaging front seats and three screens. Lots of technology for sensible money.',
  },
  'mini-cooper-s': {
    ru: 'Задорный трёхдверный хэтчбек с турбомотором и «картинговой» управляемостью. Яркий автомобиль для города и коротких поездок вдвоём.',
    en: 'A lively three-door hatchback with a turbo engine and go-kart handling. A fun car for the city and short trips for two.',
  },
  'mazda-cx-5': {
    ru: 'Кроссовер с одним из самых красивых салонов в классе и отточенной управляемостью. Тихий, качественный и приятный в каждой поездке.',
    en: 'A crossover with one of the most beautiful cabins in its class and polished handling. Quiet, well made and pleasant on every drive.',
  },
  'tank-500': {
    ru: 'Большой рамный внедорожник с понижающей передачей и блокировками: проедет по бездорожью, а внутри — кожа, массаж кресел и семь мест.',
    en: 'A large body-on-frame off-roader with low-range gearing and locking differentials: it handles off-road, while inside there is leather, massaging seats and seven seats.',
  },
  'geely-coolray': {
    ru: 'Компактный кроссовер с турбомотором и спортивным дизайном. Резвый в городе, экономичный и хорошо оснащённый для своего класса.',
    en: 'A compact crossover with a turbo engine and sporty styling. Lively in town, economical and well equipped for its class.',
  },
  'nissan-x-trail': {
    ru: 'Кроссовер с гибридной системой e-Power: колёса всегда крутят электромоторы, а бензиновый мотор только заряжает батарею. Плавно, тихо и с полным приводом.',
    en: 'A crossover with the e-Power hybrid system: the wheels are always driven by electric motors, while the petrol engine only charges the battery. Smooth, quiet and all-wheel drive.',
  },
  'hyundai-elantra': {
    ru: 'Седан с выразительным дизайном и экономичной гибридной установкой. Просторный, современный и недорогой в поездках.',
    en: 'A saloon with striking design and an economical hybrid powertrain. Spacious, modern and inexpensive to run.',
  },
  'mercedes-c-class': {
    ru: 'Компактный бизнес-седан с салоном в стиле S-Class: большой вертикальный экран, мягкая подсветка и полный привод 4MATIC. Для деловых поездок по городу.',
    en: 'A compact business saloon with an S-Class-style cabin: a large portrait screen, soft ambient lighting and 4MATIC all-wheel drive. For business trips around town.',
  },
  'lamborghini-revuelto': {
    ru: 'Флагман Lamborghini: атмосферный V12 и три электромотора, вместе — 1015 л.с. Двери вверх, сотня за 2,5 секунды и звук, ради которого его выбирают.',
    en: 'Lamborghini\'s flagship: a naturally aspirated V12 and three electric motors making 1015 hp together. Upward-opening doors, 100 km/h in 2.5 seconds and the sound people choose it for.',
  },
  'bmw-3-series': {
    ru: 'Обновлённая «трёшка» с изогнутым экраном и фирменным задним приводом. Компактный, точный в управлении и экономичный — эталон седана для того, кто любит водить.',
    en: 'The updated 3 Series with a curved screen and trademark rear-wheel drive. Compact, precise and economical — the benchmark saloon for those who love driving.',
  },
  'rolls-royce-spectre': {
    ru: 'Первый электрический Rolls-Royce: огромное купе с дверями против хода и абсолютной тишиной в салоне. Роскошь будущего — уже сегодня.',
    en: 'The first electric Rolls-Royce: a huge coupé with rear-hinged doors and absolute silence inside. The luxury of the future — today.',
  },
  'tesla-model-y': {
    ru: 'Обновлённый Model Y со светодиодной полосой спереди и сзади: два мотора, автопилот и огромный багажник. Тихий электрокроссовер для города и трассы.',
    en: 'The updated Model Y with full-width light bars front and rear: two motors, Autopilot and a huge boot. A quiet electric SUV for the city and the motorway.',
  },
  'volvo-s90': {
    ru: 'Длинный скандинавский седан с минималистичным салоном и тихим ходом. Строгий, спокойный и очень комфортный в дальней дороге.',
    en: 'A long Scandinavian saloon with a minimalist cabin and a quiet ride. Understated, calm and very comfortable on long journeys.',
  },
  'mercedes-gls': {
    ru: 'S-Class среди внедорожников: битурбо V8, пневмоподвеска и полноценный третий ряд. Для поездки большой семьёй или делегацией с полным комфортом.',
    en: 'The S-Class of SUVs: a twin-turbo V8, air suspension and a proper third row. For travelling with a large family or a delegation in complete comfort.',
  },
  'bmw-i7': {
    ru: 'Электрический флагман BMW с 31-дюймовым кинотеатром для задних пассажиров. 659 л.с., полный привод и бесшумный ход — представительский седан нового поколения.',
    en: 'BMW\'s electric flagship with a 31-inch theatre screen for rear passengers. 659 hp, all-wheel drive and a silent ride — a new-generation executive saloon.',
  },
  'ferrari-f8-tributo': {
    ru: 'Последний «чистый» среднемоторный V8 Ferrari без гибридной помощи: 720 л.с. и отклик, который чувствуешь каждой клеточкой. Классика Маранелло.',
    en: 'The last pure mid-engined Ferrari V8 without hybrid help: 720 hp and a response you feel in every fibre. A Maranello classic.',
  },
  'bentley-flying-spur': {
    ru: 'Роскошный седан Bentley с V8 и полным приводом: кожа ручной выделки, дерево и вращающаяся панель с часами. Для торжественных событий и деловых поездок с водителем.',
    en: 'Bentley\'s luxury saloon with a V8 and all-wheel drive: hand-stitched leather, wood and a rotating display with a clock. For grand occasions and chauffeured business trips.',
  },
  'lexus-rx': {
    ru: 'Спортивная версия популярного кроссовера: турбогибрид на 371 л.с. и электрический полный привод. Тихий, надёжный и неожиданно быстрый.',
    en: 'The sporty version of the popular crossover: a 371 hp turbo hybrid and electric all-wheel drive. Quiet, reliable and surprisingly quick.',
  },
  'porsche-cayenne-coupe': {
    ru: 'Cayenne с покатой крышей и активным спойлером: управляемость Porsche, полный привод и салон с тремя экранами. Эффектный кроссовер для города.',
    en: 'The Cayenne with a sloping roof and active spoiler: Porsche handling, all-wheel drive and a cabin with three screens. A striking SUV for the city.',
  },
  'lotus-emira': {
    ru: 'Последний бензиновый Lotus: компрессорный V6 за спиной и легендарная управляемость марки. Лёгкий, точный и очень живой спорткар.',
    en: 'The last petrol Lotus: a supercharged V6 behind your back and the brand\'s legendary handling. A light, precise and very lively sports car.',
  },
  'land-rover-discovery': {
    ru: 'Семиместный внедорожник для больших путешествий: пневмоподвеска, понижающая передача и место для всех. Проедет и по городу, и по бездорожью.',
    en: 'A seven-seat off-roader for big journeys: air suspension, low-range gearing and room for everyone. Equally at home in the city and off-road.',
  },
  'aston-martin-dbx': {
    ru: 'Самый мощный кроссовер класса люкс: битурбо V8 на 707 л.с. и сотня за 3,3 секунды. Британская роскошь с характером суперкара.',
    en: 'The most powerful luxury SUV: a 707 hp twin-turbo V8 and 100 km/h in 3.3 seconds. British luxury with a supercar character.',
  },
  'ferrari-sf90': {
    ru: 'Подключаемый гибрид Ferrari на 1000 л.с.: V8 и три электромотора, полный привод и до 25 км на одном электричестве. Самый быстрый серийный Ferrari своего времени.',
    en: 'Ferrari\'s 1000 hp plug-in hybrid: a V8 and three electric motors, all-wheel drive and up to 25 km on electricity alone. The fastest production Ferrari of its time.',
  },
  'bmw-z4': {
    ru: 'Родстер с мягкой крышей, которая складывается за 10 секунд, и рядной «шестёркой» на 340 л.с. Для солнечного дня за городом и вечернего центра.',
    en: 'A soft-top roadster whose roof folds in 10 seconds, with a 340 hp straight-six. For a sunny day out of town and the city centre at night.',
  },
  'toyota-supra': {
    ru: 'Легендарное имя в новом поколении: рядная «шестёрка», задний привод и короткая колёсная база. Яркий спорткар для тех, кто вырос на «Форсаже».',
    en: 'A legendary name in a new generation: a straight-six, rear-wheel drive and a short wheelbase. A vivid sports car for those who grew up on Fast & Furious.',
  },
  'ferrari-purosangue': {
    ru: 'Первый четырёхдверный Ferrari с атмосферным V12 на 725 л.с. Задние двери против хода, четыре полноценных кресла и характер настоящего Ferrari.',
    en: 'The first four-door Ferrari with a 725 hp naturally aspirated V12. Rear-hinged back doors, four proper seats and the character of a true Ferrari.',
  },
  'audi-rs-q8': {
    ru: 'Кроссовер-купе с битурбо V8 на 600 л.с.: рекорды Нюрбургринга, полный привод и огромные тормоза. Быстрый, как спорткар, и вместительный, как семейный автомобиль.',
    en: 'An SUV coupé with a 600 hp twin-turbo V8: Nürburgring records, all-wheel drive and huge brakes. As fast as a sports car and as roomy as a family car.',
  },
  'genesis-g90': {
    ru: 'Флагманский седан Genesis: битурбо V6 с электрическим компрессором, задние кресла с массажем и аудиосистема Bang & Olufsen. Спокойная роскошь без лишнего пафоса.',
    en: 'Genesis\'s flagship saloon: a twin-turbo V6 with an electric supercharger, massaging rear seats and Bang & Olufsen audio. Calm luxury without excess.',
  },
  'volkswagen-golf': {
    ru: 'Восьмой Golf с экономичным дизелем: расход около 5 литров, цифровая приборная панель и выверенная управляемость. Эталон хэтчбека для города и трассы.',
    en: 'The eighth-generation Golf with an economical diesel: around 5 litres per 100 km, a digital cockpit and finely judged handling. The benchmark hatchback for town and motorway.',
  },
  'mercedes-eqs': {
    ru: 'Электрический флагман Mercedes с запасом хода около 700 км и обтекаемым кузовом-«луком». В салоне — тишина, массаж кресел и огромные экраны.',
    en: 'Mercedes\'s electric flagship with a range of around 700 km and a sleek one-bow body. Inside: silence, massaging seats and huge screens.',
  },
  'kia-sportage': {
    ru: 'Кроссовер с дерзким дизайном, изогнутым экраном на полторы панели и полным приводом. Просторный и практичный — для города и поездок на выходные.',
    en: 'A crossover with bold styling, a curved panoramic screen and all-wheel drive. Spacious and practical — for the city and weekend trips.',
  },
  'mclaren-artura': {
    ru: 'Гибридный суперкар McLaren: компактный V6 и электромотор, 680 л.с. и до 30 км на одном электричестве. Тихо выезжаете из двора — и громко уходите за горизонт.',
    en: 'McLaren\'s hybrid supercar: a compact V6 and an electric motor, 680 hp and up to 30 km on electricity alone. Leave the courtyard silently — and disappear over the horizon loudly.',
  },
  'toyota-highlander': {
    ru: 'Семиместный гибридный кроссовер: экономичный, тихий и надёжный. Третий ряд для детей и полный привод — для семейных путешествий без забот.',
    en: 'A seven-seat hybrid SUV: economical, quiet and reliable. A third row for the kids and all-wheel drive — for carefree family travel.',
  },
  'audi-a8': {
    ru: 'Удлинённый флагман Audi: кресло с массажем и подставкой для ног сзади, полный привод и пневмоподвеска. Тихий кабинет на колёсах для поездок с водителем.',
    en: 'Audi\'s long-wheelbase flagship: a rear seat with massage and a footrest, all-wheel drive and air suspension. A quiet office on wheels for chauffeured trips.',
  },
  'hyundai-i30': {
    ru: 'Европейский хэтчбек Hyundai с турбомотором и роботизированной коробкой: бодрый, экономичный и удобный в городе. Яркий красный цвет — в подарок.',
    en: 'Hyundai\'s European hatchback with a turbo engine and a dual-clutch gearbox: lively, economical and easy in town. The bright red paint comes free.',
  },
  'porsche-911-gt3-rs': {
    ru: 'Самый «гоночный» 911 для дорог общего пользования: атмосферный мотор до 9000 об/мин, огромное антикрыло и аэродинамика как у болида. Для тех, кто понимает.',
    en: 'The most track-focused road-legal 911: a naturally aspirated engine revving to 9000 rpm, a huge rear wing and race-car aerodynamics. For those who understand.',
  },
  'skoda-kodiaq': {
    ru: 'Новый Kodiaq: просторный семиместный кроссовер с огромным багажником и продуманными мелочами вроде зонта в двери. Практичный выбор для семьи.',
    en: 'The new Kodiaq: a roomy seven-seat SUV with a huge boot and clever details like an umbrella in the door. The practical choice for a family.',
  },
  'porsche-panamera': {
    ru: 'Четырёхдверный Porsche с битурбо V8 и характером спорткара: четыре полноценных кресла, полный привод и сотня за 3,9 секунды.',
    en: 'A four-door Porsche with a twin-turbo V8 and a sports-car character: four proper seats, all-wheel drive and 100 km/h in 3.9 seconds.',
  },
  'hyundai-staria': {
    ru: 'Минивэн-«космолёт» с панорамным остеклением и креслами-лаунж во втором ряду. Удобен для трансфера компании или семьи с большим багажом.',
    en: 'A spaceship-like MPV with panoramic glazing and lounge seats in the second row. Ideal for transferring a group or a family with lots of luggage.',
  },
  'aston-martin-db12': {
    ru: 'Британский гран-туризмо с мягкой складной крышей и битурбо V8 на 680 л.с. Роскошный кабриолет для летнего вечера и долгой дороги к морю.',
    en: 'A British grand tourer with a folding soft top and a 680 hp twin-turbo V8. A luxurious convertible for a summer evening and a long road to the sea.',
  },
  'toyota-alphard': {
    ru: 'Представительский минивэн нового поколения: кресла второго ряда как в бизнес-классе самолёта, тишина и мягкий ход. Любимая машина для VIP-трансферов.',
    en: 'The new-generation executive MPV: second-row seats like business class on a plane, silence and a soft ride. The favourite car for VIP transfers.',
  },
  'audi-rs-e-tron-gt': {
    ru: 'Электрический гран-туризмо Audi на платформе Taycan: два мотора, полный привод и сотня за 3,3 секунды. Бесшумная скорость в очень красивом кузове.',
    en: 'Audi\'s electric grand tourer on the Taycan platform: two motors, all-wheel drive and 100 km/h in 3.3 seconds. Silent speed in a very beautiful body.',
  },
  'zeekr-009': {
    ru: 'Электрический минивэн с решёткой-водопадом и двумя моторами на 544 л.с. Шесть кресел, пневмоподвеска и запас хода около 700 км.',
    en: 'An electric MPV with a waterfall grille and two motors making 544 hp. Six seats, air suspension and a range of around 700 km.',
  },
  'volkswagen-golf-gti': {
    ru: 'Легендарный «горячий» хэтчбек: турбомотор на 245 л.с., спортивная подвеска и красная полоска на решётке. Практичный на каждый день и азартный на извилистой дороге.',
    en: 'The legendary hot hatch: a 245 hp turbo engine, sports suspension and a red stripe across the grille. Practical every day and thrilling on a twisty road.',
  },
  'bmw-x6': {
    ru: 'Кроссовер-купе с подсвеченной решёткой и рядной «шестёркой» на 381 л.с. Эффектный силуэт, полный привод и спортивный характер.',
    en: 'An SUV coupé with an illuminated grille and a 381 hp straight-six. A striking silhouette, all-wheel drive and a sporty character.',
  },
}
