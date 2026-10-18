import {
  siAstonmartin,
  siAudi,
  siBentley,
  siBmw,
  siFerrari,
  siInstagram,
  siLamborghini,
  siMaserati,
  siMclaren,
  siPorsche,
  siRollsroyce,
  siTelegram,
  siTesla,
  siVk,
  siWhatsapp,
  siYoutube,
} from 'simple-icons'

// Контуры логотипов из simple-icons. Импорт поимённый — в сборку попадают
// только эти иконки, а не вся библиотека

// --- Марки -------------------------------------------------------------------------
// Mercedes-Benz из simple-icons убран по просьбе правообладателя, поэтому
// звезда нарисована здесь в той же сетке 24×24: кольцо — две окружности
// с обходом в разные стороны (внутренняя вырезается из внешней), внутри —
// трёхлучевая звезда, лучи касаются кольца
const MERCEDES_STAR =
  'M12 .5a11.5 11.5 0 1 0 0 23 11.5 11.5 0 1 0 0-23z' +
  'M12 1.6a10.4 10.4 0 1 1 0 20.8 10.4 10.4 0 1 1 0-20.8z' +
  'M12 1.6l1.65 9.45 7.36 6.15L12 13.9l-9.01 3.3 7.36-6.15z'

export const BRAND_PATHS = {
  lamborghini: siLamborghini.path,
  mercedes: MERCEDES_STAR,
  bmw: siBmw.path,
  porsche: siPorsche.path,
  'rolls-royce': siRollsroyce.path,
  audi: siAudi.path,
  ferrari: siFerrari.path,
  bentley: siBentley.path,
  mclaren: siMclaren.path,
  tesla: siTesla.path,
  'aston-martin': siAstonmartin.path,
  maserati: siMaserati.path,
}

export type BrandId = keyof typeof BRAND_PATHS

// --- Соцсети и мессенджеры ------------------------------------------------------------
export const SOCIAL_PATHS = {
  instagram: siInstagram.path,
  telegram: siTelegram.path,
  youtube: siYoutube.path,
  vk: siVk.path,
  whatsapp: siWhatsapp.path,
}

export type SocialId = keyof typeof SOCIAL_PATHS
