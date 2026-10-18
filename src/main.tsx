import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
// Шрифт из референса, self-hosted через Fontsource (без внешнего CDN):
// Manrope с осью веса, кириллица и латиница подгружаются по unicode-range
import '@fontsource-variable/manrope/wght.css'
import '@/styles/tokens.css'
import '@/styles/global.css'
import { router } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
