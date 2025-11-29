import { useTranslation } from 'react-i18next'

export default function AboutCulture(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">{t('about.culture_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-3 md:space-y-4 leading-relaxed text-sm md:text-base text-gray-700">
        <h2 className="text-lg md:text-xl font-semibold">{t('about.culture_family_title')}</h2>
        <p>{t('about.culture_family_p1')}</p>
        <p>{t('about.culture_family_p2')}</p>
      </div>
    </main>
  )
}




