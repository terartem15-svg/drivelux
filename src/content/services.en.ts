import { SERVICE_TITLES } from './serviceLinks'
import type { OrderOption, Service, ServiceSlug } from './services'
import { SERVICES_RU } from './services.ru'

// Услуги DriveLux на английском. Структура — та же, что у русской версии:
// фото, цены, иконки, поля формы и подборки машин берутся из русских
// объектов (base), здесь — только тексты. Так у двух языков не разъедутся
// цены и списки машин
function base(slug: ServiceSlug): Service {
  const service = SERVICES_RU.find((item) => item.slug === slug)
  if (!service) throw new Error(`Нет русской версии услуги ${slug}`)
  return service
}

const PLACE_OFFICE: OrderOption = { value: 'office', label: 'DriveLux office — Moscow City' }
const PLACE_AIRPORT: OrderOption = { value: 'airport', label: 'Airport — Sheremetyevo, Vnukovo or Domodedovo' }
const PLACE_ADDRESS: OrderOption = { value: 'address', label: 'My address', needsAddress: true }

const delivery = base('delivery')
const equipment = base('equipment')
const longTerm = base('long-term-rental')
const corporate = base('corporate')
const chauffeur = base('chauffeur')

export const SERVICES_EN: Service[] = [
  {
    ...delivery,
    title: SERVICE_TITLES.delivery.en,
    tagline: 'Anywhere in the city and beyond',
    summary:
      'We bring the car of your choice to the airport, a railway station, your hotel or your address — in Moscow and beyond.',
    highlights: ['Airport / station', 'Hotel', 'Your address'],
    lead: 'The car comes to you, not the other way round: we meet you at the airport or deliver to your hotel, office or home at the agreed time. All that is left is to inspect the car, sign the papers — and drive.',
    description:
      'Delivery saves you a trip to the office: the car is brought wherever it suits you to collect it. The place, time and delivery cost are agreed in advance, and the handover itself takes little time — inspection, documents and keys.',
    price: {
      ...delivery.price,
      unit: 'one way',
      note: 'outside the ring road; free across Moscow and to the airports',
    },
    image: { ...delivery.image, alt: 'A grey Lamborghini Huracán on an airport apron next to a private jet at sunset' },
    secondary: { ...delivery.secondary, label: 'Choose a car' },
    benefits: [
      {
        icon: 'map-pin',
        title: 'Pick-up where it suits you',
        text: 'Airport, station, hotel or your address — you choose the place.',
      },
      {
        icon: 'clock',
        title: 'On your schedule',
        text: 'We agree the delivery time in advance — to match your flight, check-in or meeting.',
      },
      {
        icon: 'sparkles',
        title: 'A car ready to go',
        text: 'The car is handed over ready for the trip, with documents and the equipment you ordered.',
      },
      {
        icon: 'file-text',
        title: 'Clear handover terms',
        text: 'You know the delivery cost and the handover procedure before the order is confirmed.',
      },
    ],
    steps: [
      { title: 'Choose a car', text: 'In the fleet or in the selection further down this page.' },
      {
        title: 'Set the place and time',
        text: 'An address, a hotel or a flight number and a convenient delivery time.',
      },
      { title: 'Agree the details', text: 'A manager will get in touch to confirm the order and delivery cost.' },
      { title: 'Get the car', text: 'Inspection, documents, keys — and the car is yours.' },
    ],
    termsTitle: 'Delivery terms',
    terms: [
      {
        label: 'Pick-up place',
        value: 'Airport, station, hotel or address',
        text: 'Anywhere in Moscow; the Moscow region and other cities by arrangement.',
      },
      {
        label: 'Date and time',
        value: 'By arrangement',
        text: 'The delivery time is agreed when you order. For an airport meeting, give your flight number.',
      },
      {
        label: 'Choice of address',
        value: 'Pick-up and return',
        text: 'The return place can be set separately — it is agreed together with the order.',
      },
      {
        label: 'Delivery cost',
        value: 'Free in the city',
        text: 'Free to the airports as well. Outside the ring road — from €50 one way (demo price).',
      },
      {
        label: 'Documents',
        value: 'Passport and licence',
        text: 'A passport or ID card and a category B driving licence — checked at handover.',
      },
    ],
    faq: [
      {
        question: 'How do I choose the pick-up place?',
        answer:
          'Set it in the order form: an airport, a station, a hotel or your own address. If you have not decided yet, say so in the comment — a manager will help you choose a convenient spot.',
      },
      {
        question: 'Can I change the delivery time?',
        answer:
          'Usually yes — let us know as early as possible. Rescheduling and the new time are agreed with a manager; in the demo version of the site this is not automated.',
      },
      {
        question: 'How is the delivery cost calculated?',
        answer:
          'Delivery across Moscow and to the airports is free. Outside the ring road the price depends on the distance — the mock-up says “from €50 one way”. This is a demo figure; the exact amount is given when you order.',
      },
      {
        question: 'Which documents do I need at handover?',
        answer:
          'A passport and a category B driving licence. Guests from other countries may also need an international driving permit.',
      },
    ],
    form: {
      ...delivery.form,
      placeLabel: 'Deliver to',
      places: [
        PLACE_AIRPORT,
        { value: 'station', label: 'A Moscow railway station' },
        { value: 'hotel', label: 'Hotel', needsAddress: true },
        PLACE_ADDRESS,
      ],
      addressLabel: 'Address or hotel name',
      addressPlaceholder: 'E.g. 3 Tverskaya St or The Ritz-Carlton',
      dateLabel: 'Delivery date',
      timeLabel: 'Delivery time',
      commentPlaceholder: 'Flight number, landmark, wishes',
    },
    carsLead: 'The cars most often ordered with delivery to the airport and hotels.',
  },

  {
    ...equipment,
    title: SERVICE_TITLES.equipment.en,
    tagline: 'More options for your comfort',
    summary: 'A child seat, a second driver, a satnav and Wi-Fi or a winter kit — add whatever makes the trip easier.',
    highlights: ['Child seat', 'Additional driver', 'Satnav / Wi-Fi', 'Winter kit'],
    lead: 'Add exactly what this trip needs: a seat for your child, a second driver, a satnav and mobile internet or a winter kit. Everything is ready by the time the car is handed over.',
    description:
      'Equipment is ordered together with the car so it can be prepared and fitted before handover. A child seat and a second driver are free; everything else follows the rate quoted when you order.',
    price: {
      ...equipment.price,
      unit: 'per day',
      note: 'satnav, Wi-Fi and winter kit; child seat and second driver are free',
    },
    image: { ...equipment.image, alt: 'A child car seat fitted to the back seat of an SUV with a leather interior' },
    secondary: { ...equipment.secondary, label: 'See the terms' },
    benefits: [
      {
        icon: 'baby',
        title: 'A seat for your child’s age',
        text: 'We pick a seat for your child’s age and weight and fit it before handover.',
      },
      {
        icon: 'users',
        title: 'Second driver',
        text: 'Added to the contract for free — on a long road you can take turns.',
      },
      {
        icon: 'wifi',
        title: 'Navigation and connectivity',
        text: 'A satnav and mobile Wi-Fi help in an unfamiliar city and on the motorway.',
      },
      {
        icon: 'snowflake',
        title: 'Ready for winter',
        text: 'A winter kit for the cold season — its contents are confirmed when you order.',
      },
    ],
    steps: [
      { title: 'Choose a car', text: 'Equipment is added to a specific car and date.' },
      { title: 'Tick what you need', text: 'Child seat, second driver, satnav, Wi-Fi or winter kit.' },
      { title: 'Get everything at once', text: 'The equipment is fitted and checked before the car is handed over.' },
    ],
    termsTitle: 'What you can add',
    terms: [
      {
        label: 'Child seat',
        value: 'Free',
        text: 'Give your child’s age and weight in the comment — the seat is chosen accordingly.',
      },
      {
        label: 'Additional driver',
        value: 'Free',
        text: 'They also need a passport and a category B licence; age and experience requirements are the same as for the main driver.',
      },
      {
        label: 'Satnav and Wi-Fi',
        value: 'from €10 per day',
        text: 'A demo price — the exact cost is given when you order.',
      },
      { label: 'Winter kit', value: 'On request', text: 'The contents and availability are confirmed when you order.' },
      {
        label: 'Availability',
        value: 'Book early',
        text: 'Equipment is limited — add it to the order straight away rather than on the day of pick-up.',
      },
    ],
    faq: [
      {
        question: 'Which child seat will I get?',
        answer:
          'It is chosen by the age and weight of your child, which you give when ordering. A specific seat model cannot be selected in the demo version of the site.',
      },
      {
        question: 'Can I add equipment after booking?',
        answer:
          'Usually yes, if it is available. It is safer to tick everything at once — then the equipment will be ready at handover.',
      },
      {
        question: 'Who can be the second driver?',
        answer:
          'Anyone who meets the same requirements as the main driver: age, experience, passport and a category B licence. The second driver is added to the contract for free.',
      },
      {
        question: 'How much does the equipment cost?',
        answer:
          'A child seat and a second driver are free. For a satnav, Wi-Fi and a winter kit the mock-up says “from €10 per day” — a demo figure; the total is given when you order.',
      },
    ],
    form: {
      ...equipment.form,
      carLabel: 'Car the equipment is for',
      dateLabel: 'Car pick-up date',
      equipment: [
        { value: 'child-seat', label: 'Child seat' },
        { value: 'second-driver', label: 'Additional driver' },
        { value: 'navigator', label: 'Satnav' },
        { value: 'wifi', label: 'Mobile Wi-Fi' },
        { value: 'winter', label: 'Winter kit' },
      ],
      commentPlaceholder: 'Child’s age and weight, second driver’s details',
    },
    carsLead: 'Spacious cars for family trips — with room for a child seat and luggage.',
  },

  {
    ...longTerm,
    title: SERVICE_TITLES['long-term-rental'].en,
    tagline: 'Better terms for longer periods',
    summary:
      'Special rates for rentals of a week, a month or longer — for business trips, relocation and long journeys.',
    highlights: ['Long-term discounts', 'Priority service', 'Flexible terms'],
    lead: 'A car for weeks and months — without buying it, insuring it or worrying about servicing. The rate is calculated for your period: the longer it is, the lower the daily price.',
    description:
      'Long-term rental suits business trips, relocation, seasonal work and long journeys. The period, rate and servicing arrangements are agreed when you order — nothing in the contract will come as a surprise.',
    price: { ...longTerm.price, unit: 'per day', note: 'for long-term rentals' },
    image: { ...longTerm.image, alt: 'A black Range Rover Sport on cobblestones by a glass facade' },
    secondary: { ...longTerm.secondary, label: 'Choose a car' },
    benefits: [
      {
        icon: 'percent',
        title: 'Lower daily price',
        text: 'The rate depends on the period: weekly and monthly rates are cheaper than daily.',
      },
      {
        icon: 'wrench',
        title: 'Scheduled servicing',
        text: 'We agree routine maintenance in advance so it does not get in the way of your trips.',
      },
      {
        icon: 'refresh',
        title: 'Flexible period',
        text: 'Extensions are discussed with a manager — just message us before the rental ends.',
      },
      {
        icon: 'headset',
        title: 'Support on call',
        text: 'Support works around the clock — just as with a regular rental.',
      },
    ],
    steps: [
      { title: 'Choose a car', text: 'Any car in the fleet will do.' },
      { title: 'Set the period', text: 'The start date and the approximate length of the rental.' },
      { title: 'Get a quote', text: 'A manager will offer a rate for the car and the period.' },
      { title: 'Collect the car', text: 'At the office, at the airport or delivered across the city.' },
    ],
    termsTitle: 'Periods and terms',
    terms: [
      {
        label: 'From 7 days',
        value: 'Weekly rate',
        text: 'Cheaper per day than daily rental; the discount depends on the car and is confirmed in the quote.',
      },
      {
        label: 'From 30 days',
        value: 'Monthly rate',
        text: 'The offer is calculated individually — for the car, the period and the mileage.',
      },
      {
        label: 'Mileage',
        value: '250 km per day',
        text: 'As with a regular rental. A different limit for long periods can be discussed when ordering.',
      },
      { label: 'Deposit', value: '€1,000 to €5,000', text: 'Depends on the car class and is held on your card.' },
      {
        label: 'Pick-up',
        value: 'Office, airport or delivery',
        text: 'Delivery across Moscow and to the airports is free.',
      },
    ],
    faq: [
      {
        question: 'From what period is a rental long-term?',
        answer:
          'Under the demo terms of the site — from 7 days. Weekly and monthly rates are calculated individually for the car and the period.',
      },
      {
        question: 'Can I extend the rental?',
        answer:
          'Usually yes, if the car is free on the dates you need. Let your manager know in advance — the extension is agreed before the current period ends.',
      },
      {
        question: 'Who takes care of servicing?',
        answer:
          'DriveLux arranges routine maintenance and agrees the time with you in advance. The exact procedure is set out when you order.',
      },
      {
        question: 'Why is “from €70 per day” not for every car?',
        answer:
          'It is the lower limit from the mock-up, a demo figure. The final rate depends on the car you choose and the rental period.',
      },
    ],
    form: {
      ...longTerm.form,
      dateLabel: 'Rental start date',
      durationLabel: 'Rental period',
      durations: [
        { value: '1-2w', label: '1–2 weeks' },
        { value: '3-4w', label: '3–4 weeks' },
        { value: '1-3m', label: '1–3 months' },
        { value: '3-6m', label: '3–6 months' },
        { value: '6m+', label: 'More than 6 months' },
      ],
      placeLabel: 'Where to collect the car',
      places: [PLACE_OFFICE, PLACE_AIRPORT, PLACE_ADDRESS],
      addressLabel: 'Delivery address',
      addressPlaceholder: 'Street, building, city',
      commentPlaceholder: 'Purpose of the trip, expected mileage, wishes',
    },
    carsLead: 'Economical and comfortable cars that are easy to drive every day.',
  },

  {
    ...corporate,
    title: SERVICE_TITLES.corporate.en,
    tagline: 'Premium transport for your business',
    summary: 'Cars for business meetings, business trips, staff transport and corporate events.',
    highlights: ['Individual terms', 'Flexible discounts', 'Personal manager'],
    lead: 'Executive cars for meetings, business trips, company guests and events. One manager, a clear ordering process and terms that adapt to the size of your business.',
    description:
      'Companies order cars in different ways: once for a specific meeting or regularly under a contract. The format, the fleet and the paperwork are discussed at the start — after that, orders follow the agreed scheme.',
    price: { ...corporate.price, unit: 'per day', note: 'depends on volume and the format of cooperation' },
    image: {
      ...corporate.image,
      alt: 'A man in a business suit next to a black Mercedes-Benz S-Class at a hotel entrance',
    },
    secondary: { ...corporate.secondary, label: 'See the terms' },
    benefits: [
      {
        icon: 'briefcase',
        title: 'Cars for every task',
        text: 'Saloons for negotiations, SUVs for business trips, luxury cars for special guests.',
      },
      {
        icon: 'user',
        title: 'Personal manager',
        text: 'One contact for all company orders — no need to explain things twice.',
      },
      {
        icon: 'receipt',
        title: 'Paperwork for accounting',
        text: 'A contract with your company and closing documents — the format is agreed at onboarding.',
      },
      { icon: 'percent', title: 'Flexible discounts', text: 'Terms depend on the volume and regularity of orders.' },
    ],
    steps: [
      { title: 'Send a request', text: 'Tell us about your company and what you need the cars for.' },
      { title: 'Discuss the format', text: 'A manager will suggest cars and a way to work together.' },
      { title: 'Agree the terms', text: 'Contract, ordering procedure and documents.' },
      { title: 'Order cars', text: 'Staff and guests get cars according to the agreed scheme.' },
    ],
    termsTitle: 'Ways to work together',
    terms: [
      {
        label: 'Scenario',
        value: 'Business meetings',
        text: 'An executive car for a few hours or a day — with or without a chauffeur.',
      },
      {
        label: 'Scenario',
        value: 'Business trips and guests',
        text: 'Meeting partners at the airport, trips around the city and between cities.',
      },
      {
        label: 'Scenario',
        value: 'Events',
        text: 'Several cars of the same class for conferences, presentations and corporate parties.',
      },
      {
        label: 'Cooperation',
        value: 'One-off or by contract',
        text: 'Order as needed or sign a contract with uniform terms.',
      },
      {
        label: 'For company representatives',
        value: 'What to prepare',
        text: 'The company name, the approximate volume of orders and the contact of the person in charge.',
      },
    ],
    faq: [
      {
        question: 'Can I rent several cars at once?',
        answer:
          'Yes, several cars can be ordered for events and delegations. Availability of the right number of cars of one class is confirmed when you order.',
      },
      {
        question: 'Do you work under a contract with a company?',
        answer:
          'Working “under a contract” is part of the service concept. The specific contract terms and documents are discussed with a manager — they are not on the demo site.',
      },
      {
        question: 'Can I order a car with a chauffeur for a company guest?',
        answer:
          'Yes, corporate rental can be combined with the “Chauffeur service” — for example, to meet partners at the airport.',
      },
      {
        question: 'How is the discount calculated?',
        answer:
          'It depends on the volume and regularity of orders. The “from €60 per day” figure in the mock-up is a demo; the total is given after discussing the format.',
      },
    ],
    form: {
      ...corporate.form,
      carLabel: 'Preferred car',
      dateLabel: 'When you need the cars',
      commentPlaceholder: 'Company tasks, cities, how often you travel',
    },
    carsLead: 'Executive saloons and a spacious SUV for business travel.',
  },

  {
    ...chauffeur,
    title: SERVICE_TITLES.chauffeur.en,
    tagline: 'Comfort and safety on every trip',
    summary: 'Professional chauffeurs with experience, knowledge of the city and a high level of service.',
    highlights: ['Personal chauffeur', 'Meet & greet', 'Business trips and events'],
    lead: 'You ride — the chauffeur drives. An airport pick-up, a business day in the city, a wedding or a transfer to another city: the car and the driver arrive at the agreed time.',
    description:
      'Chauffeur service is for those who want to spend travel time productively: work, prepare for a meeting or simply relax. The route, time and format of the trip are agreed when you order.',
    price: { ...chauffeur.price, unit: 'per day', note: 'depends on the car, time and route' },
    image: {
      ...chauffeur.image,
      alt: 'A chauffeur opening the rear door of a black Rolls-Royce Phantom at a building entrance',
    },
    secondary: { ...chauffeur.secondary, label: 'Choose a car' },
    benefits: [
      {
        icon: 'route',
        title: 'A driver who knows the city',
        text: 'Airport, business district, country routes — you will not have to think about the road.',
      },
      { icon: 'luggage', title: 'Meet & greet', text: 'Meeting at the airport exit and help with luggage.' },
      {
        icon: 'armchair',
        title: 'Travel time is yours',
        text: 'Work, rest or prepare for a meeting while the chauffeur drives.',
      },
      {
        icon: 'handshake',
        title: 'Business etiquette',
        text: 'Punctuality, a business dress code and confidentiality of conversations in the car.',
      },
    ],
    steps: [
      { title: 'Choose a car', text: 'A saloon, an SUV or a luxury car.' },
      { title: 'Describe the trip', text: 'Pick-up address, time and format: transfer, a few hours or a day.' },
      { title: 'Agree the details', text: 'A manager will confirm the route and the price.' },
      { title: 'Meet your chauffeur', text: 'The car and chauffeur arrive at the agreed time.' },
    ],
    termsTitle: 'Trip formats',
    terms: [
      { label: 'Transfer', value: 'One way', text: 'To the airport, a railway station or another city.' },
      {
        label: 'Hourly',
        value: 'A few hours',
        text: 'Business meetings around the city. The minimum booking time is confirmed when ordering.',
      },
      {
        label: 'Full day',
        value: 'Events and trips',
        text: 'Weddings, delegation visits, a business day with several stops.',
      },
      {
        label: 'Price',
        value: 'from €80 per day',
        text: 'A demo price: the total depends on the car, time and route.',
      },
      {
        label: 'Route changes',
        value: 'By arrangement',
        text: 'Extra stops and waiting time are agreed with a manager.',
      },
    ],
    faq: [
      {
        question: 'Can I book a chauffeur just for an airport transfer?',
        answer:
          'Yes, a one-way transfer is one of the formats. Give your flight number in the form — the meeting time is agreed by it.',
      },
      {
        question: 'Can I choose the car?',
        answer:
          'Yes, the car is chosen from the fleet — in the selection on this page or in the catalogue. You can change it in the order form.',
      },
      {
        question: 'What if the meeting runs late?',
        answer:
          'Waiting time and route changes are agreed with a manager. How they are charged is confirmed when you order — there are no rates on the demo site.',
      },
      {
        question: 'Do I need a licence if the chauffeur drives?',
        answer:
          'No, the passenger does not need a licence with chauffeur service. A manager will confirm the documents needed for the order.',
      },
    ],
    form: {
      ...chauffeur.form,
      durationLabel: 'Trip format',
      durations: [
        { value: 'transfer', label: 'One-way transfer' },
        { value: 'hours', label: 'A few hours' },
        { value: 'day', label: 'A full day' },
        { value: 'days', label: 'Several days' },
      ],
      addressLabel: 'Pick-up address',
      addressPlaceholder: 'Address, hotel or “airport, flight …”',
      dateLabel: 'Trip date',
      timeLabel: 'Pick-up time',
      commentPlaceholder: 'Route, stops, number of passengers and luggage',
    },
    carsLead: 'Cars that are especially pleasant to ride in as a passenger.',
  },
]
