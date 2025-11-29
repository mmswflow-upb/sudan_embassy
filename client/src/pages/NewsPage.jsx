import News from '../components/News'
import { useTranslation } from 'react-i18next'

export default function NewsPage() {
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-sudan-black mb-4 md:mb-6">{t('nav.news')}</h1>
      <News showHeader={false} />
    </main>
  )
}


