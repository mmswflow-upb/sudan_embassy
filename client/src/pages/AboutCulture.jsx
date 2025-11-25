import { useTranslation } from 'react-i18next'

export default function AboutCulture(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">{t('about.culture_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 leading-relaxed text-gray-700">
        <h2 className="text-xl font-semibold">The Sudanese Family</h2>
        <p>Communities are traditionally formed around extended families and lineages, with respected elders guiding social life. Family ties influence opportunities, marriage, and local leadership. Urbanization blends traditional customs with modern life in Khartoum, Omdurman, and other cities.</p>
        <p>Social gatherings often observe gender segregation in traditional settings. In cities, families work and study alongside diverse ethnic groups. Upper‑income households in major cities are closely connected to public service, business, and the professions.</p>
      </div>
    </main>
  )
}




