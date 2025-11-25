import { useTranslation } from 'react-i18next'

export default function AboutBrief(){
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">{t('about.brief_title')}</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 leading-relaxed text-gray-700">
        <h2 className="text-xl font-semibold">{t('about.brief_where')}</h2>
        <p>{t('about.brief_p1')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc pl-5 space-y-1">
            {t('about.brief_list1', { returnObjects: true }).map((item)=> (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="list-disc pl-5 space-y-1">
            {t('about.brief_list2', { returnObjects: true }).map((item)=> (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p>{t('about.brief_p2')}</p>
      </div>
    </main>
  )
}




