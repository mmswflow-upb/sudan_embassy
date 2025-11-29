import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AppointCTA(){
  const { t } = useTranslation()
  return (
    <div className="sticky bottom-3 z-40 md:hidden px-3">
      <Link to="/appointments" className="block w-full text-center bg-gradient-to-r from-sudan-black via-sudan-red to-sudan-green text-white font-medium py-3 rounded-lg shadow-lg">
        <i className="fa-solid fa-calendar-check me-2" /> {t('nav.book_appointment')}
      </Link>
    </div>
  )
}


