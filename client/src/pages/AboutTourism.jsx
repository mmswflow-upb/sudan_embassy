import { useTranslation } from 'react-i18next'

export default function AboutTourism(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">{t('about.tourism_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-3 md:space-y-4 leading-relaxed text-sm md:text-base text-gray-700">
        <h2 className="text-lg md:text-xl font-semibold">{t('about.tourism_places_title')}</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
          {t('about.tourism_places', { returnObjects: true }).map((item, i) => (<li key={i}>{item}</li>))}
        </ul>
        <h3 className="text-base md:text-lg font-semibold">{t('about.tourism_cultural_title')}</h3>
        <p>{t('about.tourism_cultural_p1')}</p>
      </div>
    </main>
  )
}




