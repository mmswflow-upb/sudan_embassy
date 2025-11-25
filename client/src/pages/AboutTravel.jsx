import { useTranslation } from 'react-i18next'

export default function AboutTravel(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">{t('about.travel_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 leading-relaxed text-gray-700">
        <p>Airplanes, buses, trains, ships, and multiple land crossings connect Sudan with its neighbors. Land frontier length is approximately 6,780 km across Egypt, Libya, Chad, Central African Republic, South Sudan, Ethiopia, and Eritrea.</p>
        <h2 className="text-xl font-semibold">Main land routes and checkpoints</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sudan–Egypt: Halayib customs checkpoint; road to Suez via Shalateen and Abu Ramad.</li>
          <li>Sudan–Libya: Jebel Oweinat border; tracks to Dongola and Kutum.</li>
          <li>Sudan–Chad: El Geneina (SD) – Adré (TD) main crossing.</li>
          <li>Sudan–Central Africa: Um Dafoug (Darfur) checkpoint.</li>
          <li>Sudan–Eritrea: Kassala – Teseney checkpoint; other northern entries.</li>
        </ul>
        <h2 className="text-xl font-semibold">Travel within Sudan</h2>
        <p>All means of transport are available. Overland travel is common due to an expanding road network and legacy rail lines.</p>
        <h3 className="font-semibold">Air travel</h3>
        <p>Sudan Airways and Badr Airlines connect major cities; foreign carriers operate routes to Khartoum. Travelers from Romania typically connect via regional hubs.</p>
        <h3 className="font-semibold">Marine & river transport</h3>
        <p>Sea links serve nearby countries on the Red Sea. River transport complements overland routes in some areas.</p>
        <h3 className="font-semibold">Railways</h3>
        <p>Historic lines (Khartoum–Atbara–Port Sudan; Nyala–Khartoum; Wadi Halfa–Atbara–Khartoum) support passenger and freight. Trips range ~24–30 hours depending on route.</p>
        <h3 className="font-semibold">Motorways</h3>
        <p>Key corridors include Khartoum–Atbara, Khartoum–Damazin, Khartoum–El Obeid, Khartoum–Kadugli, Khartoum–Port Sudan, and Nyala–Kass–Zalingei. Seasonal tracks can be impassable during the rainy season (Jun–Sep).</p>
      </div>
    </main>
  )
}




