import { FLEET_PHOTO_CREDITS } from './photoCreditsFleet'

// Авторы фото автопарка. Фото машин, добавленных в каталог, — с Unsplash:
// лицензия Unsplash разрешает бесплатное использование без обязательной
// подписи, но авторов всё равно подписываем в галерее на странице машины.
// Порядок — как у файлов 01, 02… в папке машины (public/cars/<id>/):
// подпись нужна каждому фото, без неё галерея покажет кадр без автора
export interface PhotoCredit {
  author: string
  url: string
  // Откуда фото; без поля — Unsplash (так подписаны первые машины парка)
  source?: 'Unsplash' | 'Pexels' | 'Wikimedia Commons'
  // Лицензия Creative Commons — у фото из Wikimedia Commons её нужно
  // указывать рядом с автором
  license?: { name: string; url: string }
}

const BASE_CREDITS: Record<string, PhotoCredit[]> = {
  urus: [
    { author: 'Samuel Hagger', url: 'https://unsplash.com/photos/qoZSYNBvIxg' },
    { author: 'Cristian Musolino', url: 'https://unsplash.com/photos/hVld5nXY-Ok' },
    { author: 'Andrei Ianovskii', url: 'https://unsplash.com/photos/-Erqrbp2GAA' },
    { author: 'Andrei Ianovskii', url: 'https://unsplash.com/photos/OGpX6dP5b-A' },
  ],
  cullinan: [
    { author: 'Franco Debartolo', url: 'https://unsplash.com/photos/V182ALJJY1Q' },
    { author: 'Franco Debartolo', url: 'https://unsplash.com/photos/NlfRmeez6Io' },
    { author: 'Franco Debartolo', url: 'https://unsplash.com/photos/k1ZylI2MK5U' },
    { author: 'Franco Debartolo', url: 'https://unsplash.com/photos/SsbfBfu-RQU' },
  ],
  'continental-gt': [
    { author: 'Wes Tindel', url: 'https://unsplash.com/photos/hyLypdvB5CA' },
    { author: 'Wes Tindel', url: 'https://unsplash.com/photos/efej_2rWQ9c' },
    { author: 'Wes Tindel', url: 'https://unsplash.com/photos/eJjDir9OikM' },
    { author: 'Wes Tindel', url: 'https://unsplash.com/photos/TAI9GNo2i1M' },
  ],
  'range-rover': [
    { author: 'Sam Pearce-Warrilow', url: 'https://unsplash.com/photos/a85ELzGu03k' },
    { author: 'Sam Pearce-Warrilow', url: 'https://unsplash.com/photos/Ho98UeVC_nQ' },
    { author: 'Swansway Motor Group', url: 'https://unsplash.com/photos/WNts6J4kxXg' },
    { author: 'Sam Pearce-Warrilow', url: 'https://unsplash.com/photos/CfCsO9QIxLY' },
  ],
  'range-rover-sport': [
    { author: 'Robin LE MEE', url: 'https://unsplash.com/photos/aEcWlfs2emg' },
    { author: 'Robin LE MEE', url: 'https://unsplash.com/photos/qWjr0ozbGzo' },
    { author: 'Robin LE MEE', url: 'https://unsplash.com/photos/jP_6KNwnCbE' },
    { author: 'Robin LE MEE', url: 'https://unsplash.com/photos/pnBXlOARJdQ' },
  ],
  cayenne: [
    { author: 'Tim Meyer', url: 'https://unsplash.com/photos/7CguI06KKNk' },
    { author: 'Tim Meyer', url: 'https://unsplash.com/photos/eqZxve5bPuo' },
    { author: 'Tim Meyer', url: 'https://unsplash.com/photos/wKf_uAhM2ZM' },
    { author: 'Tim Meyer', url: 'https://unsplash.com/photos/X_MZuQpQtIU' },
  ],
  taycan: [
    { author: 'Samuel Hagger', url: 'https://unsplash.com/photos/Zn3Fnrt5dvk' },
    { author: 'Mitch Kemp', url: 'https://unsplash.com/photos/2w_Nxti8iKE' },
    { author: 'redcharlie', url: 'https://unsplash.com/photos/KxvLAnU6Pmc' },
    { author: 'Dan Ojog', url: 'https://unsplash.com/photos/3XYUgtdj9S0' },
  ],
  'r8': [
    { author: 'Tyler Clemmensen', url: 'https://unsplash.com/photos/d1Jum1vVLew' },
    { author: 'Damian Ochrymowicz', url: 'https://unsplash.com/photos/Dhol4s3fS_Y' },
    { author: 'Damian Ochrymowicz', url: 'https://unsplash.com/photos/Io29abHt1-4' },
    { author: 'Matthew McKinney', url: 'https://unsplash.com/photos/FwUZRE6FlbQ' },
  ],
  'rs6': [
    { author: 'serjan midili', url: 'https://unsplash.com/photos/8iZdhhP5bwg' },
    { author: 'serjan midili', url: 'https://unsplash.com/photos/qeyPtWw9_NY' },
    { author: 'ben', url: 'https://unsplash.com/photos/6fieTjpCses' },
  ],
  'rs3': [
    { author: 'David Moffatt', url: 'https://unsplash.com/photos/N5C_latUR4E' },
    { author: 'David Moffatt', url: 'https://unsplash.com/photos/v8Cn_g-VCSE' },
    { author: 'David Moffatt', url: 'https://unsplash.com/photos/JZTd9PZh_fA' },
    { author: 'David Moffatt', url: 'https://unsplash.com/photos/3aUnQrKM1uY' },
  ],
  'ferrari-296': [
    { author: 'Quentin Martinez', url: 'https://unsplash.com/photos/F_EHJFveUX4' },
    { author: '312 Visuals', url: 'https://unsplash.com/photos/63IjWI4gmQY' },
    { author: 'Yevhenii Melnychenko', url: 'https://unsplash.com/photos/jho7ToYeXCg' },
  ],
  '911-gt3': [
    { author: 'Jack White', url: 'https://unsplash.com/photos/Ls0ZPURpoDE' },
    { author: 'Jack White', url: 'https://unsplash.com/photos/NMULoAz4olo' },
    { author: 'Jack White', url: 'https://unsplash.com/photos/jC2TBT7QqSg' },
    { author: 'Jack White', url: 'https://unsplash.com/photos/yBGnUEW1MbY' },
  ],
  'model-s': [
    { author: 'Jp Valery', url: 'https://unsplash.com/photos/Qm_n6aoYzDs' },
    { author: 'Jp Valery', url: 'https://unsplash.com/photos/RQub4zZuOCs' },
    { author: 'Daniel Shapiro', url: 'https://unsplash.com/photos/G9MNjujk8Tg' },
    { author: 'Daniel Shapiro', url: 'https://unsplash.com/photos/JAQLPuJYAs8' },
  ],
  'model-3': [
    { author: 'Martin Katler', url: 'https://unsplash.com/photos/WyGUO1k7AEQ' },
    { author: 'Martin Katler', url: 'https://unsplash.com/photos/DiJR_M1Mv_A' },
    { author: 'Bram Van Oost', url: 'https://unsplash.com/photos/WIhlNrqSysc' },
  ],
  'x7': [
    { author: 'Rana Singh', url: 'https://unsplash.com/photos/o3dvLyfKGbw' },
    { author: 'Rana Singh', url: 'https://unsplash.com/photos/dpcWwZQ8Mxo' },
    { author: 'Rana Singh', url: 'https://unsplash.com/photos/vMVmyg6w7hI' },
    { author: 'Rana Singh', url: 'https://unsplash.com/photos/Qrm8OOohwx4' },
  ],
  'bmw-7': [
    { author: 'Philipp Katzenberger', url: 'https://unsplash.com/photos/Y8-H19uSx-Y' },
    { author: 'Philipp Katzenberger', url: 'https://unsplash.com/photos/_Uk_G4suLI4' },
    { author: 'David von Diemar', url: 'https://unsplash.com/photos/0QldV2TPvLg' },
  ],
  's-class': [
    { author: 'Dekler Ph', url: 'https://unsplash.com/photos/ZmcOEbW3hDg' },
    { author: 'Dekler Ph', url: 'https://unsplash.com/photos/iuLTK-vzcmE' },
    { author: 'Dekler Ph', url: 'https://unsplash.com/photos/NvP0iIzVqyI' },
  ],
  'a-class': [
    { author: 'Pasqualino Capobianco', url: 'https://unsplash.com/photos/E1wuu6IvKyk' },
    { author: 'Pasqualino Capobianco', url: 'https://unsplash.com/photos/Xn2RHH92TBE' },
    { author: 'Pasqualino Capobianco', url: 'https://unsplash.com/photos/7NOxuLzoOpA' },
    { author: 'Benjamin Brunner', url: 'https://unsplash.com/photos/GIjdCX1PUT0' },
  ],
  'sl-63': [
    { author: 'Dekler Ph', url: 'https://unsplash.com/photos/h5mrvuVBpLo' },
    { author: 'Dekler Ph', url: 'https://unsplash.com/photos/-NdFZueqI4A' },
    { author: 'Dekler Ph', url: 'https://unsplash.com/photos/4SMtgXS8F2k' },
  ],
}

// Машины, добавленные при расширении автопарка, и пять машин главной с
// переснятыми фото: их авторы — в photoCreditsFleet.ts (файл собирается
// вместе с фото, по одному списку на машину) и перекрывают старые записи
export const PHOTO_CREDITS: Record<string, PhotoCredit[]> = { ...BASE_CREDITS, ...FLEET_PHOTO_CREDITS }
