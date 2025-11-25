import News from '../components/News'
import { useTranslation } from 'react-i18next'

export default function NewsPage() {
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-sudan-black mb-6">{t('pages.news_and_announcements')}</h1>
      <News />
    </main>
  )
}


