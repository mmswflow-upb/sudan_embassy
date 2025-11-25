import { useTranslation } from 'react-i18next'

export default function AboutTourism(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">{t('about.tourism_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 leading-relaxed text-gray-700">
        <h2 className="text-xl font-semibold">Places to visit</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sudan National Museum (Khartoum) — artifacts spanning from the Stone Age to medieval eras.</li>
          <li>Ethnography Museum (Khartoum) — cultures, customs, and tribes of Sudan.</li>
          <li>Al‑Khalifa House Museum (Omdurman) — Mahdist period history near Al‑Mahdi’s Tomb.</li>
          <li>Sheikan Museum (El Obeid) — Mahdist relics and regional history.</li>
          <li>Sultan Ali Dinar Palace Museum (Al‑Fashir) — Darfur heritage.</li>
        </ul>
        <h3 className="font-semibold">Cultural experiences</h3>
        <p>The Whirling Dervishes of Sudan are renowned for rhythmic devotional dances. Cultural centers and libraries in Khartoum host exhibitions, language programs, and forums (e.g., Abdel Karim Merghani Cultural Center, Goethe‑Institut, French Institute, British Council).</p>
      </div>
    </main>
  )
}




