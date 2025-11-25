import { useTranslation } from 'react-i18next'

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">{t('about.title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 leading-relaxed text-gray-700">
        <p>{t('about.overview_p1')}</p>
        <p>{t('about.overview_p2')}</p>
      </div>
    </main>
  )
}


