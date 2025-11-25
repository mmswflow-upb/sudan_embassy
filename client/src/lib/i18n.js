import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import ro from '../locales/ro.json'
import ar from '../locales/ar.json'

const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
const browser = typeof navigator !== 'undefined' ? (navigator.language || '').slice(0,2) : 'en'
const initial = saved || (['en','ro','ar'].includes(browser) ? browser : 'en')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
      ar: { translation: ar },
    },
    lng: initial,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (lng) => {
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lng)
      document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr')
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', lng)
  } catch {}
})

// Set initial dir/lang
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('lang', initial)
  document.documentElement.setAttribute('dir', initial === 'ar' ? 'rtl' : 'ltr')
}

export default i18n



