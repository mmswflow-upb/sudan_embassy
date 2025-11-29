import { useTranslation } from 'react-i18next'

export default function AboutCulture(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">{t('about.culture_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-3 md:space-y-4 leading-relaxed text-sm md:text-base text-gray-700">
        <h2 className="text-lg md:text-xl font-semibold">The Sudanese Family</h2>
        <p>Communities are traditionally formed around extended families and lineages, with respected elders guiding social life. Family ties influence opportunities, marriage, and local leadership. Urbanization blends traditional customs with modern life in Khartoum, Omdurman, and other cities.</p>
        <p>Social gatherings often observe gender segregation in traditional settings. In cities, families work and study alongside diverse ethnic groups. Upper‑income households in major cities are closely connected to public service, business, and the professions.</p>
      </div>
    </main>
  )
}




