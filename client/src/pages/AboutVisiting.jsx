import { useTranslation } from 'react-i18next'

export default function AboutVisiting(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">{t('about.visiting_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-3 md:space-y-4 leading-relaxed text-sm md:text-base text-gray-700">
        <h2 className="text-lg md:text-xl font-semibold">{t('about.visiting_intl_title')}</h2>
        <p>{t('about.visiting_intl_p1')}</p>
        <h2 className="text-lg md:text-xl font-semibold">{t('about.visiting_bilateral_title')}</h2>
        <p>{t('about.visiting_bilateral_p1')}</p>
        <h2 className="text-lg md:text-xl font-semibold">{t('about.visiting_challenges_title')}</h2>
        <p>{t('about.visiting_challenges_p1')}</p>
      </div>
    </main>
  )
}




