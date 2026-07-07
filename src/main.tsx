import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@leenguyen/react-flip-clock-countdown/dist/index.css"
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
