import { useState } from 'react'

// Вид каталога — сеткой или списком. Это привычка человека, а не часть
// отбора, поэтому хранится не в адресе, а в localStorage: каталог
// открывается так, как его оставили в прошлый раз
export type ViewMode = 'grid' | 'list'

const STORAGE_KEY = 'drivelux:fleet-view'

function read(): ViewMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

export function useViewMode() {
  const [view, setView] = useState<ViewMode>(read)

  function change(next: ViewMode) {
    setView(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Без localStorage вид просто не запомнится
    }
  }

  return [view, change] as const
}
