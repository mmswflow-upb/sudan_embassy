import { useTranslation } from 'react-i18next'

export default function AboutVisiting(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">{t('about.visiting_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-3 md:space-y-4 leading-relaxed text-sm md:text-base text-gray-700">
        <h2 className="text-lg md:text-xl font-semibold">Sudan in the international arena</h2>
        <p>With a dual African‑Arab heritage and a strategic location, Sudan plays an active role in regional and international organizations, including the UN, AU, Arab League, OIC, COMESA, IGAD, and others. Sudan advocates non‑interference, mutual benefit, and a rules‑based international order that promotes justice and development.</p>
        <h2 className="text-lg md:text-xl font-semibold">Bilateral relations</h2>
        <p>Sudan maintains diplomatic ties worldwide, including strong relations with countries across Africa, the Middle East, Europe, and Asia. For Romanian travelers in Bucharest, the Embassy of the Republic of Sudan provides consular services, visas, and travel guidance pertinent to Sudan.</p>
        <h2 className="text-lg md:text-xl font-semibold">Challenges and diplomacy</h2>
        <p>Sudan continues to address internal challenges while pursuing stability and constructive engagement abroad through its embassies and consulates.</p>
      </div>
    </main>
  )
}




