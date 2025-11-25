import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import './lib/firebase.js'
import './lib/i18n'
import AOS from 'aos'
import 'aos/dist/aos.css'
import toast, { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
    </BrowserRouter>
  </StrictMode>,
)

// Init AOS after initial mount
setTimeout(()=>{ AOS.init({ once: false, duration: 650, easing: 'ease-out-quart', offset: 40 }) }, 0)

// Global ripple handler for elements with .ripple
window.addEventListener('click', (e) => {
  const el = e.target.closest('.ripple')
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  el.style.setProperty('--ripple-x', `${x}px`)
  el.style.setProperty('--ripple-y', `${y}px`)
  el.classList.remove('is-animating')
  // force reflow
  void el.offsetWidth
  el.classList.add('is-animating')
  setTimeout(()=> el.classList.remove('is-animating'), 600)
})

// Lightweight global toast bridge
window.addEventListener('toast', (e) => {
  const { type='success', text='' } = e.detail || {}
  if (type==='error') toast.error(text)
  else toast.success(text)
})
