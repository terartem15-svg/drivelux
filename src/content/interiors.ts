// Фото салонов автопарка. Лежат в src/assets/interiors/<id>.webp — по одному
// на машину, имя файла совпадает с id машины. Фото — из Wikimedia Commons:
// лицензии (CC BY, CC BY-SA, CC0) разрешают использование, а CC BY и CC BY-SA
// требуют подписать автора и лицензию — подпись выводится под фото салона
// на странице машины.
//
// Салон снят у той же модели и поколения, что и машина в парке; где в
// открытых источниках нет снимка именно этой версии, взят ближайший из
// той же линейки (см. note). Машины без снимка (RS 3, 296 GTB) показывают
// страницу без блока с фото салона
import type { Localized } from '@/i18n/lang'

export interface InteriorPhoto {
  src: string
  credit: {
    author: string
    license: string
    url: string
    // Пояснение, если на фото не точная версия машины
    note?: Localized<string>
  }
}

const FILES = import.meta.glob<string>('/src/assets/interiors/*.webp', { eager: true, import: 'default' })

const CREDITS: Record<string, InteriorPhoto['credit']> = {
  huracan: {
    author: 'Ethan Llamas',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:2016_Lamborghini_Hurac%C3%A1n_LP_610-4_Coupe_(interior).jpg',
  },
  urus: {
    author: 'Y.Leclercq',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Lamborghini_Urus_07.jpg',
  },
  'g-class': {
    author: 'Tokumeigakarinoaoshima',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Mercedes-AMG_G_63_(W463A)_interior.jpg',
  },
  's-class': {
    author: 'Tokumeigakarinoaoshima',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Mercedes-Benz_S_580_4MATIC_long_(V223)_interior.jpg',
  },
  'a-class': {
    author: 'Bindydad123',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:2019_Mercedes_Benz_A-Class_Hatchback_A_200_(10).jpg',
  },
  'sl-63': {
    author: 'Tokumeigakarinoaoshima',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Mercedes-AMG_SL_63_S_E_Performance_(R232)_interior.jpg',
  },
  m8: {
    author: 'Vauxford',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:2019_BMW_M8_Competition_Interior.jpg',
  },
  'bmw-7': {
    author: 'Tokumeigakarinoaoshima',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:BMW_740i_(G11)_interior.jpg',
  },
  x7: {
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:BMW_G07_LCI_X7_BMW_Individual_Extended_Merino_Leather_Tartufo_(4).jpg',
  },
  '911-gt3': {
    author: 'Sokrates 399',
    license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:992_GT3_IR2.jpg',
  },
  taycan: {
    author: 'Aos.1905',
    license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Porsche_Taycan_GTS_(interior)_(taken_in_2022)_(Kyoto,_Japan).jpg',
  },
  cayenne: {
    author: 'Vauxford',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:2018_Porsche_Cayenne_S_Interior.jpg',
  },
  rs6: {
    author: 'MoCars',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:2023_Audi_RS6_Avant_in_Nardo_Grey_(Interior).jpg',
  },
  r8: {
    author: 'TTTNIS',
    license: 'public domain',
    url: 'https://commons.wikimedia.org/wiki/File:Audi_R8_V10_interior.jpg',
  },
  phantom: {
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Rolls-Royce_Phantom_VIII_Series_II_Scivaro_Grey_Peony_Pink_Iceland_Moss_(2).jpg',
  },
  cullinan: {
    author: 'Kārlis Dambrāns',
    license: 'CC BY 2.0',
    url: 'https://commons.wikimedia.org/wiki/File:Rolls_Royce_Cullinan_Interior.jpg',
  },
  'continental-gt': {
    author: 'Y.Leclercq',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Bentley_Continental_GT_II_planche_de_bord_(2).jpg',
  },
  'range-rover': {
    author: 'Damian B Oh',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Land_Rover_Range_Rover_Autobiography_L460_Deep_Garnet_(12).jpg',
  },
  'range-rover-sport': {
    author: 'Tokumeigakarinoaoshima',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Land_Rover_RANGE_ROVER_SPORT_HSE_(L494)_interior.jpg',
  },
  'model-s': {
    author: 'Peteratkins',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Tesla_Model_S_Interior.jpg',
  },
  'model-3': {
    author: 'Kazyakuruma',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Tesla_Model_3_(2023),_long_range,_Japan,_interior.jpg',
  },
  'mclaren-765lt': {
    author: 'Aos.1905',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Interior_of_a_McLaren_750S_(Japanese_specification).jpg',
    note: {
      ru: 'Салон McLaren 750S — преемника 720S, на платформе которого построена 765LT',
      en: 'Cabin of the McLaren 750S — the successor to the 720S, on which the 765LT is based',
    },
  },
}

export function interiorOf(id: string): InteriorPhoto | undefined {
  const src = FILES[`/src/assets/interiors/${id}.webp`]
  const credit = CREDITS[id]
  return src && credit ? { src, credit } : undefined
}
