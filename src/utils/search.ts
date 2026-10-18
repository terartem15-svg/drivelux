// Нормализация текста для поиска: без учёта регистра и диакритики
// («huracan» находит Huracán), «ё» = «е», дефисы и подчёркивания — как
// пробелы. Каталог, поиск в шапке и отзывы сравнивают слова в таком виде
export function words(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ё/g, 'е')
    .split(/[\s\-–—_/.,«»"()]+/)
    .filter(Boolean)
}

// Каждое слово запроса должно быть началом какого-то слова из списка:
// «мерс s» → Mercedes-Benz S-Class. По началу слова, а не по любой
// подстроке: иначе одна буква «s» находила бы всё подряд
export function matchesWords(queryWords: string[], itemWords: string[]): boolean {
  return queryWords.every((word) => itemWords.some((itemWord) => itemWord.startsWith(word)))
}
