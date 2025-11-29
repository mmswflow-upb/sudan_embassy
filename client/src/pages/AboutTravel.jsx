import { useTranslation } from 'react-i18next'

export default function AboutTravel(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">{t('about.travel_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-3 md:space-y-4 leading-relaxed text-sm md:text-base text-gray-700">
        <p>{t('about.travel_p1')}</p>
        <h2 className="text-lg md:text-xl font-semibold">{t('about.travel_routes_title')}</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
          {t('about.travel_routes', { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <h2 className="text-lg md:text-xl font-semibold">{t('about.travel_within_title')}</h2>
        <p>{t('about.travel_within_p1')}</p>
        <h3 className="text-base md:text-lg font-semibold">{t('about.travel_air_title')}</h3>
        <p>{t('about.travel_air_p1')}</p>
        <h3 className="text-base md:text-lg font-semibold">{t('about.travel_marine_title')}</h3>
        <p>{t('about.travel_marine_p1')}</p>
        <h3 className="text-base md:text-lg font-semibold">{t('about.travel_rail_title')}</h3>
        <p>{t('about.travel_rail_p1')}</p>
        <h3 className="text-base md:text-lg font-semibold">{t('about.travel_motor_title')}</h3>
        <p>{t('about.travel_motor_p1')}</p>
      </div>
    </main>
  )
}




